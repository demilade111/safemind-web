const socketIo = require("socket.io");
const { v4: uuidv4 } = require("uuid");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const activeUsers = new Map(); 
const socketToUser = new Map(); 
const activeCalls = new Map(); 
const activeBroadcasts = new Map(); 
const initializeSocketServer = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log(`New socket connection: ${socket.id}`);
    socket.on("authenticate", async (data) => {
      try {
        const { userId, token } = data;
        activeUsers.set(userId, socket.id);
        socketToUser.set(socket.id, userId);
        console.log(`User ${userId} authenticated with socket ${socket.id}`);
        socket.emit("authenticated", { success: true });
        const userCalls = Array.from(activeCalls.entries())
          .filter(
            ([_, call]) => call.userId === userId || call.therapistId === userId
          )
          .map(([callId, call]) => ({ callId, ...call }));
        if (userCalls.length > 0) {
          socket.emit("active-calls", userCalls);
        }
        const userBroadcasts = Array.from(activeBroadcasts.entries())
          .filter(
            ([_, broadcast]) =>
              broadcast.therapistId === userId ||
              broadcast.viewers.includes(userId)
          )
          .map(([broadcastId, broadcast]) => ({ broadcastId, ...broadcast }));
        if (userBroadcasts.length > 0) {
          socket.emit("active-broadcasts", userBroadcasts);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        socket.emit("error", { message: "Authentication failed" });
      }
    });
    socket.on("call-user", async (data) => {
      try {
        const { targetUserId, offer, sessionId } = data;
        const callerId = socketToUser.get(socket.id);
        if (!callerId) {
          return socket.emit("error", { message: "Not authenticated" });
        }
        const targetSocketId = activeUsers.get(targetUserId);
        if (!targetSocketId) {
          return socket.emit("error", { message: "User is not online" });
        }
        const callId = uuidv4();
        activeCalls.set(callId, {
          therapistId: callerId,
          userId: targetUserId,
          sessionId,
          status: "ringing",
          startTime: new Date(),
        });
        io.to(targetSocketId).emit("call-incoming", {
          callId,
          callerId,
          offer,
          sessionId,
        });
        socket.emit("call-initiated", {
          callId,
          targetUserId,
        });
      } catch (error) {
        console.error("Call initiation error:", error);
        socket.emit("error", { message: "Failed to initiate call" });
      }
    });
    socket.on("call-accept", (data) => {
      try {
        const { callId, answer } = data;
        const userId = socketToUser.get(socket.id);
        if (!userId) {
          return socket.emit("error", { message: "Not authenticated" });
        }
        const call = activeCalls.get(callId);
        if (!call) {
          return socket.emit("error", { message: "Call not found" });
        }
        call.status = "connected";
        activeCalls.set(callId, call);
        const callerSocketId = activeUsers.get(call.therapistId);
        if (!callerSocketId) {
          return socket.emit("error", { message: "Caller is not connected" });
        }
        io.to(callerSocketId).emit("call-accepted", {
          callId,
          answer,
          userId,
        });
      } catch (error) {
        console.error("Call accept error:", error);
        socket.emit("error", { message: "Failed to accept call" });
      }
    });
    socket.on("ice-candidate", (data) => {
      try {
        const { callId, candidate, targetUserId } = data;
        const userId = socketToUser.get(socket.id);
        if (!userId) {
          return socket.emit("error", { message: "Not authenticated" });
        }
        const targetSocketId = activeUsers.get(targetUserId);
        if (!targetSocketId) {
          return socket.emit("error", {
            message: "Target user is not connected",
          });
        }
        io.to(targetSocketId).emit("ice-candidate", {
          callId,
          candidate,
          userId,
        });
      } catch (error) {
        console.error("ICE candidate error:", error);
        socket.emit("error", { message: "Failed to send ICE candidate" });
      }
    });
    socket.on("call-end", (data) => {
      try {
        const { callId } = data;
        const userId = socketToUser.get(socket.id);
        if (!userId) {
          return socket.emit("error", { message: "Not authenticated" });
        }
        const call = activeCalls.get(callId);
        if (!call) {
          return socket.emit("error", { message: "Call not found" });
        }
        const otherUserId =
          call.therapistId === userId ? call.userId : call.therapistId;
        const otherSocketId = activeUsers.get(otherUserId);
        if (otherSocketId) {
          io.to(otherSocketId).emit("call-ended", { callId, userId });
        }
        activeCalls.delete(callId);
        socket.emit("call-end-confirmed", { callId });
      } catch (error) {
        console.error("Call end error:", error);
        socket.emit("error", { message: "Failed to end call" });
      }
    });
    socket.on("send-message", async (data) => {
      try {
        const { sessionId, content } = data;
        const senderId = socketToUser.get(socket.id);
        if (!senderId) {
          return socket.emit("error", { message: "Not authenticated" });
        }
        const message = await prisma.message.create({
          data: {
            content,
            senderId,
            sessionId,
          },
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        });
        const session = await prisma.therapistSession.findUnique({
          where: { id: sessionId },
          select: {
            userId: true,
            therapistId: true,
          },
        });
        if (!session) {
          return socket.emit("error", { message: "Session not found" });
        }
        const recipientId =
          session.therapistId === senderId
            ? session.userId
            : session.therapistId;
        const recipientSocketId = activeUsers.get(recipientId);
        socket.emit("message-sent", {
          success: true,
          message: {
            id: message.id,
            content: message.content,
            senderId: message.senderId,
            sessionId: message.sessionId,
            createdAt: message.createdAt,
            sender: message.sender,
          },
        });
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("message-received", {
            message: {
              id: message.id,
              content: message.content,
              senderId: message.senderId,
              sessionId: message.sessionId,
              createdAt: message.createdAt,
              sender: message.sender,
            },
          });
        }
      } catch (error) {
        console.error("Send message error:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });
    socket.on("broadcast-start", (data) => {
      try {
        const { sessionId, offer } = data;
        const therapistId = socketToUser.get(socket.id);
        if (!therapistId) {
          return socket.emit("error", { message: "Not authenticated" });
        }
        const broadcastId = uuidv4();
        activeBroadcasts.set(broadcastId, {
          therapistId,
          sessionId,
          viewers: [],
          status: "live",
          startTime: new Date(),
          offer,
        });
        socket.emit("broadcast-started", {
          broadcastId,
          sessionId,
        });
        socket.broadcast.emit("broadcast-available", {
          broadcastId,
          therapistId,
          sessionId,
        });
      } catch (error) {
        console.error("Broadcast start error:", error);
        socket.emit("error", { message: "Failed to start broadcast" });
      }
    });
    socket.on("broadcast-join", (data) => {
      try {
        const { broadcastId } = data;
        const userId = socketToUser.get(socket.id);
        if (!userId) {
          return socket.emit("error", { message: "Not authenticated" });
        }
        const broadcast = activeBroadcasts.get(broadcastId);
        if (!broadcast) {
          return socket.emit("error", {
            message: "Broadcast not found or ended",
          });
        }
        if (!broadcast.viewers.includes(userId)) {
          broadcast.viewers.push(userId);
          activeBroadcasts.set(broadcastId, broadcast);
        }
        socket.emit("broadcast-joined", {
          broadcastId,
          offer: broadcast.offer,
        });
        const therapistSocketId = activeUsers.get(broadcast.therapistId);
        if (therapistSocketId) {
          io.to(therapistSocketId).emit("broadcast-viewer-joined", {
            broadcastId,
            userId,
          });
        }
      } catch (error) {
        console.error("Broadcast join error:", error);
        socket.emit("error", { message: "Failed to join broadcast" });
      }
    });
    socket.on("broadcast-answer", (data) => {
      try {
        const { broadcastId, answer } = data;
        const userId = socketToUser.get(socket.id);
        if (!userId) {
          return socket.emit("error", { message: "Not authenticated" });
        }
        const broadcast = activeBroadcasts.get(broadcastId);
        if (!broadcast) {
          return socket.emit("error", { message: "Broadcast not found" });
        }
        const therapistSocketId = activeUsers.get(broadcast.therapistId);
        if (!therapistSocketId) {
          return socket.emit("error", { message: "Therapist disconnected" });
        }
        io.to(therapistSocketId).emit("broadcast-viewer-answer", {
          broadcastId,
          userId,
          answer,
        });
      } catch (error) {
        console.error("Broadcast answer error:", error);
        socket.emit("error", { message: "Failed to send answer" });
      }
    });
    socket.on("broadcast-end", (data) => {
      try {
        const { broadcastId } = data;
        const therapistId = socketToUser.get(socket.id);
        if (!therapistId) {
          return socket.emit("error", { message: "Not authenticated" });
        }
        const broadcast = activeBroadcasts.get(broadcastId);
        if (!broadcast) {
          return socket.emit("error", { message: "Broadcast not found" });
        }
        if (broadcast.therapistId !== therapistId) {
          return socket.emit("error", {
            message: "Not authorized to end this broadcast",
          });
        }
        broadcast.viewers.forEach((viewerId) => {
          const viewerSocketId = activeUsers.get(viewerId);
          if (viewerSocketId) {
            io.to(viewerSocketId).emit("broadcast-ended", { broadcastId });
          }
        });
        activeBroadcasts.delete(broadcastId);
        socket.emit("broadcast-end-confirmed", { broadcastId });
      } catch (error) {
        console.error("Broadcast end error:", error);
        socket.emit("error", { message: "Failed to end broadcast" });
      }
    });
    socket.on("disconnect", () => {
      try {
        const userId = socketToUser.get(socket.id);
        if (userId) {
          console.log(`User ${userId} disconnected (socket: ${socket.id})`);
          activeUsers.delete(userId);
          socketToUser.delete(socket.id);
          for (const [callId, call] of activeCalls.entries()) {
            if (call.userId === userId || call.therapistId === userId) {
              const otherUserId =
                call.therapistId === userId ? call.userId : call.therapistId;
              const otherSocketId = activeUsers.get(otherUserId);
              if (otherSocketId) {
                io.to(otherSocketId).emit("call-ended", {
                  callId,
                  reason: "user-disconnected",
                });
              }
              activeCalls.delete(callId);
            }
          }
          for (const [broadcastId, broadcast] of activeBroadcasts.entries()) {
            if (broadcast.therapistId === userId) {
              broadcast.viewers.forEach((viewerId) => {
                const viewerSocketId = activeUsers.get(viewerId);
                if (viewerSocketId) {
                  io.to(viewerSocketId).emit("broadcast-ended", {
                    broadcastId,
                    reason: "therapist-disconnected",
                  });
                }
              });
              activeBroadcasts.delete(broadcastId);
            }
            else if (broadcast.viewers.includes(userId)) {
              broadcast.viewers = broadcast.viewers.filter(
                (id) => id !== userId
              );
              activeBroadcasts.set(broadcastId, broadcast);
              const therapistSocketId = activeUsers.get(broadcast.therapistId);
              if (therapistSocketId) {
                io.to(therapistSocketId).emit("broadcast-viewer-left", {
                  broadcastId,
                  userId,
                });
              }
            }
          }
        }
      } catch (error) {
        console.error("Disconnect handling error:", error);
      }
    });
  });
  return io;
};
module.exports = { initializeSocketServer };
