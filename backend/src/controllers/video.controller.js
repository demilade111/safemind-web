const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");
const prisma = new PrismaClient();
exports.createVideoSession = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { therapistId, scheduledTime, duration, type } = req.body;
    const userId = req.userId;
    const therapist = await prisma.therapist.findUnique({
      where: { id: therapistId },
    });
    if (!therapist) {
      return res.status(404).json({ message: "Therapist not found" });
    }
    const session = await prisma.therapistSession.create({
      data: {
        userId,
        therapistId,
        startTime: new Date(scheduledTime),
        endTime: new Date(new Date(scheduledTime).getTime() + duration * 60000), 
        status: "scheduled",
        type: type || "video", 
      },
    });
    res.status(201).json({
      message: "Video session created successfully",
      session,
    });
  } catch (error) {
    console.error("Create video session error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getUserVideoSessions = async (req, res) => {
  try {
    const userId = req.userId;
    const { status } = req.query;
    let filter = {
      userId,
      type: { in: ["video", "chat"] },
    };
    if (status) {
      filter.status = status;
    }
    const sessions = await prisma.therapistSession.findMany({
      where: filter,
      include: {
        therapist: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            specialties: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });
    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Get user video sessions error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getTherapistVideoSessions = async (req, res) => {
  try {
    const therapistId = req.userId; 
    const { status } = req.query;
    let filter = {
      therapistId,
      type: { in: ["video", "chat"] },
    };
    if (status) {
      filter.status = status;
    }
    const sessions = await prisma.therapistSession.findMany({
      where: filter,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profile: {
              select: {
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });
    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Get therapist video sessions error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getVideoSessionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const session = await prisma.therapistSession.findFirst({
      where: {
        id,
        OR: [{ userId }, { therapistId: userId }],
      },
      include: {
        therapist: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            specialties: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profile: {
              select: {
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    const isTherapist = session.therapistId === userId;
    const sessionDetails = {
      ...session,
      role: isTherapist ? "therapist" : "patient",
      otherParticipant: isTherapist
        ? {
            id: session.user.id,
            firstName: session.user.firstName,
            lastName: session.user.lastName,
            avatarUrl: session.user.profile?.avatarUrl || null,
          }
        : {
            id: session.therapist.id,
            firstName: session.therapist.firstName,
            lastName: session.therapist.lastName,
            avatarUrl: session.therapist.avatarUrl,
          },
    };
    res.status(200).json({ session: sessionDetails });
  } catch (error) {
    console.error("Get video session details error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateVideoSessionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const userId = req.userId;
    const session = await prisma.therapistSession.findFirst({
      where: {
        id,
        OR: [{ userId }, { therapistId: userId }],
      },
    });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    const updatedSession = await prisma.therapistSession.update({
      where: { id },
      data: {
        status,
        notes: notes ? notes : undefined,
      },
    });
    res.status(200).json({
      message: "Session status updated successfully",
      session: updatedSession,
    });
  } catch (error) {
    console.error("Update video session status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.startLiveBroadcast = async (req, res) => {
  try {
    const { title, description, scheduledTime } = req.body;
    const therapistId = req.userId;
    const therapist = await prisma.therapist.findUnique({
      where: { id: therapistId },
    });
    if (!therapist) {
      return res
        .status(403)
        .json({ message: "Only therapists can start broadcasts" });
    }
    const broadcastSession = await prisma.therapistSession.create({
      data: {
        therapistId,
        userId: therapistId, 
        startTime: scheduledTime ? new Date(scheduledTime) : new Date(),
        endTime: scheduledTime
          ? new Date(new Date(scheduledTime).getTime() + 3600000)
          : new Date(new Date().getTime() + 3600000), 
        status: scheduledTime ? "scheduled" : "active",
        type: "broadcast",
        notes: `${title || "Live Session"}: ${
          description || "No description provided"
        }`,
      },
    });
    res.status(201).json({
      message: "Broadcast session created",
      session: broadcastSession,
    });
  } catch (error) {
    console.error("Start live broadcast error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getActiveBroadcasts = async (req, res) => {
  try {
    const broadcasts = await prisma.therapistSession.findMany({
      where: {
        type: "broadcast",
        status: "active",
      },
      include: {
        therapist: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            specialties: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
    });
    res.status(200).json({ broadcasts });
  } catch (error) {
    console.error("Get active broadcasts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getSessionMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const session = await prisma.therapistSession.findFirst({
      where: {
        id,
        OR: [
          { userId },
          { therapistId: userId },
          { type: "broadcast" }, 
        ],
      },
    });
    if (!session) {
      return res
        .status(404)
        .json({ message: "Session not found or access denied" });
    }
    const messages = await prisma.message.findMany({
      where: {
        sessionId: id,
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
      orderBy: {
        createdAt: "asc",
      },
    });
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Get session messages error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.recordCallStatistics = async (req, res) => {
  try {
    const { sessionId, duration, quality, issues } = req.body;
    const userId = req.userId;
    const session = await prisma.therapistSession.findFirst({
      where: {
        id: sessionId,
        OR: [{ userId }, { therapistId: userId }],
      },
    });
    if (!session) {
      return res
        .status(404)
        .json({ message: "Session not found or access denied" });
    }
    const updatedSession = await prisma.therapistSession.update({
      where: { id: sessionId },
      data: {
        notes: session.notes
          ? `${
              session.notes
            }\n\nCall Statistics: Duration=${duration}s, Quality=${quality}, Issues=${
              issues || "None"
            }`
          : `Call Statistics: Duration=${duration}s, Quality=${quality}, Issues=${
              issues || "None"
            }`,
      },
    });
    res.status(200).json({
      message: "Call statistics recorded successfully",
      session: updatedSession,
    });
  } catch (error) {
    console.error("Record call statistics error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
