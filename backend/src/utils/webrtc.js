const webRTCConfig = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};
const defaultVideoConstraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: "user",
  },
};
const audioOnlyConstraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
  video: false,
};
const screenShareConstraints = {
  audio: false,
  video: {
    cursor: "always",
    displaySurface: "monitor",
  },
};
const connectionStates = {
  new: "Initializing connection...",
  checking: "Checking connection...",
  connected: "Connection established",
  completed: "Connection completed",
  failed: "Connection failed",
  disconnected: "Disconnected",
  closed: "Connection closed",
};
const createPeerConnection = () => {
  return new RTCPeerConnection(webRTCConfig);
};
const getUserMediaStream = async (constraints = defaultVideoConstraints) => {
  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    console.error("Error getting user media:", error);
    throw error;
  }
};
const getScreenShareStream = async () => {
  try {
    return await navigator.mediaDevices.getDisplayMedia(screenShareConstraints);
  } catch (error) {
    console.error("Error sharing screen:", error);
    throw error;
  }
};
const createOffer = async (peerConnection) => {
  try {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    return offer;
  } catch (error) {
    console.error("Error creating offer:", error);
    throw error;
  }
};
const createAnswer = async (peerConnection, offer) => {
  try {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    return answer;
  } catch (error) {
    console.error("Error creating answer:", error);
    throw error;
  }
};
const setRemoteAnswer = async (peerConnection, answer) => {
  try {
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  } catch (error) {
    console.error("Error setting remote description:", error);
    throw error;
  }
};
const addIceCandidate = async (peerConnection, candidate) => {
  try {
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  } catch (error) {
    console.error("Error adding ICE candidate:", error);
  }
};
const getAudioLevel = (stream) => {
  if (!stream) return 0;
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  const microphone = audioContext.createMediaStreamSource(stream);
  const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
  analyser.smoothingTimeConstant = 0.8;
  analyser.fftSize = 1024;
  microphone.connect(analyser);
  analyser.connect(javascriptNode);
  javascriptNode.connect(audioContext.destination);
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);
  let sum = 0;
  for (const value of dataArray) {
    sum += value;
  }
  return sum / (dataArray.length * 255);
};
module.exports = {
  webRTCConfig,
  defaultVideoConstraints,
  audioOnlyConstraints,
  screenShareConstraints,
  connectionStates,
  createPeerConnection,
  getUserMediaStream,
  getScreenShareStream,
  createOffer,
  createAnswer,
  setRemoteAnswer,
  addIceCandidate,
  getAudioLevel,
};
