import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import videoService from "../services/videoService";
import useAuth from "../hooks/useAuth";

const VideoCallPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<
    RTCPeerConnectionState | ""
  >("");
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!user || !sessionId) return;

    const startVideoCall = async () => {
      try {
        const stream = await videoService.startCall({
          userId: user.id,
          roomId: sessionId,
          onRemoteStream: (stream) => {
            setRemoteStream(stream);
          },
          onConnectionStateChange: (state) => {
            setConnectionState(state);
            if (
              state === "disconnected" ||
              state === "failed" ||
              state === "closed"
            ) {
              // Handle disconnection
            }
          },
        });

        setLocalStream(stream);

        // Initiate call if user is therapist
        if (user.role === "therapist") {
          setTimeout(() => {
            videoService.createOffer();
          }, 1000);
        }
      } catch (error) {
        console.error("Error starting video call:", error);
      }
    };

    startVideoCall();

    return () => {
      endCall();
    };
  }, [sessionId, user]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const toggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = () => {
    videoService.endCall();
    navigate("/dashboard/therapists");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 bg-gray-900 relative overflow-hidden">
        {remoteStream ? (
          <video
            ref={remoteVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white text-lg">
              Waiting for other participant...
            </p>
          </div>
        )}

        {localStream && (
          <div className="absolute bottom-5 right-5 w-1/4 h-1/4 border-2 border-white rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
          </div>
        )}
      </div>

      <div className="bg-gray-800 p-4 flex justify-center items-center space-x-4">
        <button
          onClick={toggleMute}
          className={`p-3 rounded-full ${
            isMuted ? "bg-red-500" : "bg-gray-600"
          }`}
        >
          {isMuted ? (
            <MicOff size={24} color="white" />
          ) : (
            <Mic size={24} color="white" />
          )}
        </button>
        <button onClick={endCall} className="p-3 rounded-full bg-red-600">
          <PhoneOff size={24} color="white" />
        </button>
        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full ${
            isVideoOff ? "bg-red-500" : "bg-gray-600"
          }`}
        >
          {isVideoOff ? (
            <VideoOff size={24} color="white" />
          ) : (
            <Video size={24} color="white" />
          )}
        </button>
      </div>

      {connectionState && connectionState !== "connected" && (
        <div className="absolute top-0 left-0 right-0 bg-yellow-500 text-center py-2 text-white">
          Connection status: {connectionState}
        </div>
      )}
    </div>
  );
};

export default VideoCallPage;
