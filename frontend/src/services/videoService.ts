import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export interface VideoCallOptions {
  userId: string;
  roomId: string;
  onRemoteStream: (stream: MediaStream) => void;
  onConnectionStateChange: (state: RTCPeerConnectionState) => void;
}

class VideoService {
  private socket: Socket | null = null;
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private roomId: string | null = null;
  private userId: string | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL);
      this.setupSocketListeners();
    }
    return this.socket;
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on("offer", async (data) => {
      if (!this.peerConnection) return;
      try {
        await this.peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        this.socket?.emit("answer", {
          answer,
          roomId: this.roomId,
          userId: this.userId,
          to: data.from,
        });
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    });

    this.socket.on("answer", async (data) => {
      if (!this.peerConnection) return;
      try {
        await this.peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
      } catch (error) {
        console.error("Error handling answer:", error);
      }
    });

    this.socket.on("iceCandidate", async (data) => {
      if (!this.peerConnection) return;
      try {
        await this.peerConnection.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    });

    this.socket.on("userJoined", (data) => {
      console.log("User joined the room:", data.userId);
    });

    this.socket.on("userLeft", (data) => {
      console.log("User left the room:", data.userId);
    });
  }

  async startCall(options: VideoCallOptions) {
    this.connect();
    this.roomId = options.roomId;
    this.userId = options.userId;

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      const configuration = {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      };

      this.peerConnection = new RTCPeerConnection(configuration);

      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.socket?.emit("iceCandidate", {
            candidate: event.candidate,
            roomId: this.roomId,
            userId: this.userId,
          });
        }
      };

      this.peerConnection.onconnectionstatechange = () => {
        if (this.peerConnection) {
          options.onConnectionStateChange(this.peerConnection.connectionState);
        }
      };

      this.peerConnection.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          options.onRemoteStream(event.streams[0]);
        }
      };

      this.localStream.getTracks().forEach((track) => {
        if (this.localStream && this.peerConnection) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });

      this.socket?.emit("joinRoom", {
        roomId: this.roomId,
        userId: this.userId,
      });

      return this.localStream;
    } catch (error) {
      console.error("Error starting call:", error);
      throw error;
    }
  }

  async createOffer() {
    if (!this.peerConnection || !this.socket) return;

    try {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      this.socket.emit("offer", {
        offer,
        roomId: this.roomId,
        userId: this.userId,
      });
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  }

  endCall() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    if (this.socket) {
      this.socket.emit("leaveRoom", {
        roomId: this.roomId,
        userId: this.userId,
      });
    }

    this.roomId = null;
    this.userId = null;
  }

  disconnect() {
    this.endCall();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new VideoService();
