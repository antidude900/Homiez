"use client";

import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
	useCallback,
} from "react";
import { useSocket } from "./SocketContext";
import { useUser } from "./UserContext";

export type CallType = "voice" | "video";

export type CallState = "idle" | "calling" | "connected";

interface IncomingCall {
	callerId: string;
	callerName: string;
	callType: CallType;
}

interface ICallContext {
	// Call state
	callState: CallState;
	callType: CallType | null;

	isAudioEnabled: boolean;
	isAudioToggling: boolean;
	isAudioError: boolean;

	isVideoEnabled: boolean;
	isVideoToggling: boolean;
	isVideoError: boolean;

	incomingCall: IncomingCall | null;

	// Stream refs
	localStream: MediaStream | null;
	remoteStream: MediaStream | null;

	// Actions
	initiateCall: (
		receiverId: string,
		receiverName: string,
		callType: CallType
	) => void;
	acceptCall: () => void;
	rejectCall: () => void;
	endCall: () => void;
	toggleAudio: () => void;
	toggleVideo: () => void;
}

const CallContext = createContext<ICallContext>({
	callState: "idle",
	callType: null,
	isAudioEnabled: false,
	isAudioToggling: true,
	isAudioError: false,
	isVideoEnabled: false,
	isVideoToggling: true,
	isVideoError: false,
	incomingCall: null,
	localStream: null,
	remoteStream: null,
	initiateCall: () => {},
	acceptCall: () => {},
	rejectCall: () => {},
	endCall: () => {},
	toggleAudio: () => {},
	toggleVideo: () => {},
});

export const useCall = () => {
	return useContext(CallContext);
};

export const CallContextProvider = ({ children }: { children: ReactNode }) => {
	const { socket } = useSocket();
	const { user } = useUser();

	const [callState, setCallState] = useState<CallState>("idle");
	const [callType, setCallType] = useState<CallType | null>(null);

	const [isAudioError, setIsAudioError] = useState(false);
	const [isAudioEnabled, setIsAudioEnabled] = useState(false);
	const [isAudioToggling, setIsAudioToggling] = useState(false);

	const [isVideoError, setIsVideoError] = useState(false);
	const [isVideoEnabled, setIsVideoEnabled] = useState(false);
	const [isVideoToggling, setIsVideoToggling] = useState(false);

	const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
	const [localStream, setLocalStream] = useState<MediaStream | null>(null);
	const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

	const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
	const iceCandidatesQueueRef = useRef<RTCIceCandidate[]>([]);
	const remotePeerIdRef = useRef<string | null>(null);
	const pendingOfferRef = useRef<RTCSessionDescriptionInit | null>(null);
	const localStreamRef = useRef<MediaStream | null>(null);

	// Create peer connection
	const createPeerConnection = useCallback(() => {
		console.log("Creating peer connection...");
		const iceServersConfig = {
			iceServers: [
				{ urls: "stun:stun.l.google.com:19302" },
				{ urls: "stun:stun1.l.google.com:19302" },
				{ urls: "stun:stun2.l.google.com:19302" },
			],
		};

		const pc = new RTCPeerConnection(iceServersConfig);
		console.log("Peer connection created!");

		pc.onicecandidate = (event) => {
			if (event.candidate && remotePeerIdRef.current && socket) {
				console.log("Sending ICE candidate to:", remotePeerIdRef.current);
				socket.emit("call:ice-candidate", {
					receiverId: remotePeerIdRef.current,
					candidate: event.candidate,
				});
			} else if (event.candidate) {
				console.log("ICE candidate ready but no remote peer yet");
			} else {
				console.log("ICE gathering complete");
			}
		};

		pc.ontrack = (event) => {
			console.log("Received remote track:", event.streams[0]);
			setRemoteStream(event.streams[0]);
		};

		pc.oniceconnectionstatechange = () => {
			console.log("ICE connection state:", pc.iceConnectionState);
			if (
				pc.iceConnectionState === "connected" ||
				pc.iceConnectionState === "completed"
			) {
				console.log("Call connected successfully!");
				setCallState("connected");
			} else if (
				pc.iceConnectionState === "disconnected" ||
				pc.iceConnectionState === "failed"
			) {
				console.log("Call disconnected or failed");
				// Will be handled by endCall if needed
			} else if (pc.iceConnectionState === "checking") {
				console.log("Checking connection...");
			}
		};

		pc.onsignalingstatechange = () => {
			console.log("Signaling state:", pc.signalingState);
		};

		pc.onicegatheringstatechange = () => {
			console.log("ICE gathering state:", pc.iceGatheringState);
		};

		peerConnectionRef.current = pc;
		return pc;
	}, [socket]);

	// Get user media
	const getUserMedia = async (type: CallType) => {
		const stream = localStream ? localStream : new MediaStream();
		const pc = peerConnectionRef.current;

		// ---- AUDIO ----
		if (type === "voice"){
			try {
				setIsAudioToggling(true);
			
				const audioStream = await navigator.mediaDevices.getUserMedia({
					audio: {
						echoCancellation: true,
						noiseSuppression: true,
						autoGainControl: true,
						sampleRate: 48000,
						channelCount: 1,
					},
					video: false,
				});
			
				const audioTrack = audioStream.getAudioTracks()[0];
				if (audioTrack) {
					stream.addTrack(audioTrack);
				
					setIsAudioEnabled(true);
					setIsAudioError(false);
				}
			} catch (err) {
				console.error("Audio failed:", err);
				setIsAudioError(true);
			} finally {
				setIsAudioToggling(false);
			}
		}


		// ---- VIDEO ----
		if (type === "video") {
			try {
				setIsVideoToggling(true);

				const videoStream = await navigator.mediaDevices.getUserMedia({
					audio: false,
					video: {
						facingMode: "user",
						width: { ideal: 1280 },
						height: { ideal: 720 },
					},
				});

				const videoTrack = videoStream.getVideoTracks()[0];
				if (videoTrack) {
					stream.addTrack(videoTrack);

					setIsVideoEnabled(true);
					setIsVideoError(false);
				}
			} catch (err) {
				console.error("Video failed:", err);
				setIsVideoError(true);
			} finally {
				setIsVideoToggling(false);
			}
		}

		if (pc) {
			// Only add tracks that don't already have a sender
			stream.getTracks().forEach((track) => {
				const senderExists = pc
					.getSenders()
					.some((sender) => sender.track === track);
				if (!senderExists) {
					pc.addTrack(track, stream);
				}
			});

			const offer = await pc.createOffer();
			await pc.setLocalDescription(offer);
			socket?.emit("call:offer", {
				receiverId: remotePeerIdRef.current,
				offer,
			});
		}
		setLocalStream(stream);
		localStreamRef.current = stream;
		return stream;
	};

	// Initiate call
	const initiateCall = async (
		receiverId: string,
		receiverName: string,
		type: CallType
	) => {
		console.log("Initiating", type, "call to:", receiverName);
		if (!socket || !user) {
			console.error("No socket or user");
			return;
		}

		// Set initial state and show CallRoom immediately
		setCallType(type);
		remotePeerIdRef.current = receiverId;
		setCallState("calling"); // Show CallRoom immediately

		await getUserMedia("voice");
		if (type === "video") await getUserMedia("video");

		// Notify the receiver after media is acquired
		socket.emit("call:initiate", {
			receiverId,
			callType: type,
			callerId: user._id,
			callerName: user.name,
		});
		const pc = createPeerConnection();
		const stream = localStreamRef.current;
		stream?.getTracks().forEach((track) => {
			pc.addTrack(track, stream);
		});

		// Create and send offer
		try {
			console.log("Creating offer...");
			const offer = await pc.createOffer();
			await pc.setLocalDescription(offer);
			console.log("Offer created and set, sending to:", receiverId);
			socket.emit("call:offer", { receiverId, offer });
		} catch (error) {
			console.error("Error creating offer:", error);
			endCall();
		}
	};

	// End call
	const endCall = useCallback(() => {
		if (remotePeerIdRef.current && socket) {
			socket.emit("call:end", { receiverId: remotePeerIdRef.current });
		} else if (incomingCall && socket) {
			socket.emit("call:end", { receiverId: incomingCall.callerId });
		}

		// Stop all tracks
		localStream?.getTracks().forEach((track) => track.stop());
		remoteStream?.getTracks().forEach((track) => track.stop());

		// Close peer connection
		if (peerConnectionRef.current) {
			peerConnectionRef.current.close();
			peerConnectionRef.current = null;
		}

		// Reset state
		setCallState("idle");
		setCallType(null);
		remotePeerIdRef.current = null;
		setLocalStream(null);
		setRemoteStream(null);
		setIsAudioEnabled(false);
		setIsAudioToggling(false);
		setIsAudioError(false);
		setIsVideoEnabled(false);
		setIsVideoToggling(false);
		setIsVideoError(false);
		setIncomingCall(null);
		iceCandidatesQueueRef.current = [];
		pendingOfferRef.current = null;
	}, [remotePeerIdRef, socket, localStream, remoteStream, incomingCall]);

	// Process offer helper function
	const processOffer = useCallback(
		async (offer: RTCSessionDescriptionInit, stream: MediaStream) => {
			if (!socket) {
				console.error("Cannot process offer: no socket");
				return;
			}

			const pc = createPeerConnection();
			console.log("Adding local tracks to peer connection");
			stream.getTracks().forEach((track) => {
				console.log("Adding track:", track.kind, track.label);
				pc.addTrack(track, stream);
			});

			try {
				console.log("Setting remote description (offer)");
				await pc.setRemoteDescription(new RTCSessionDescription(offer));

				// Add queued ICE candidates
				console.log(
					"Processing queued ICE candidates:",
					iceCandidatesQueueRef.current.length
				);
				while (iceCandidatesQueueRef.current.length > 0) {
					const candidate = iceCandidatesQueueRef.current.shift();
					if (candidate) {
						console.log("Adding queued ICE candidate");
						await pc.addIceCandidate(candidate);
					}
				}

				console.log("Creating answer...");
				const answer = await pc.createAnswer();
				await pc.setLocalDescription(answer);
				console.log(
					"Answer created and set, sending to:",
					remotePeerIdRef.current
				);
				socket.emit("call:answer", {
					receiverId: remotePeerIdRef.current,
					answer,
				});
			} catch (error) {
				console.error("Error handling offer:", error);
				endCall();
			}
		},
		[socket, createPeerConnection, endCall]
	);

	// Accept incoming call
	const acceptCall = async () => {
		console.log("Accepting incoming call from:", incomingCall?.callerName);
		if (!socket || !incomingCall) {
			console.error("No socket or incoming call");
			return;
		}

		setCallState("calling");
		setCallType(incomingCall.callType);
		remotePeerIdRef.current = incomingCall.callerId;
		setIncomingCall(null);

		// Get local media
		await getUserMedia("voice");
		if (incomingCall.callType === "video") await getUserMedia("video");

		if (!localStreamRef.current) {
			socket.emit("call:end", { receiverId: remotePeerIdRef.current });

			setCallState("idle");
			remotePeerIdRef.current = null;
			return;
		}

		// Process pending offer if it exists
		if (pendingOfferRef.current) {
			console.log("Processing pending offer after accepting call");
			await processOffer(pendingOfferRef.current, localStreamRef.current);
			pendingOfferRef.current = null;
		} else {
			console.log("No pending offer yet, will process when received");
		}
	};

	// Reject incoming call
	const rejectCall = () => {
		if (!socket || !incomingCall) return;

		socket.emit("call:reject", { receiverId: incomingCall.callerId });
		setIncomingCall(null);
		setCallState("idle");
	};

	// Toggle audio
	const toggleAudio = async () => {
		const audioTrack = localStream ? localStream.getAudioTracks()[0] : null;

		if (audioTrack) {
			audioTrack.enabled = !audioTrack.enabled;
			setIsAudioEnabled(audioTrack.enabled);
		} else {
			await getUserMedia("voice");
		}
	};

	// Toggle video
	const toggleVideo = async () => {
		const videoTrack = localStream ? localStream.getVideoTracks()[0] : null;

		if (videoTrack) {
			// Video track exists, just toggle it
			videoTrack.enabled = !videoTrack.enabled;
			setIsVideoEnabled(videoTrack.enabled);
		} else {
			await getUserMedia("video");
		}
	};

	// Socket event listeners
	useEffect(() => {
		if (!socket) return;

		// Incoming call
		socket.on("call:incoming", ({ callerId, callerName, callType }) => {
			console.log(
				"[Socket] Incoming call from:",
				callerName,
				"Type:",
				callType
			);
			setIncomingCall({ callerId, callerName, callType });
		});

		// Receive offer
		socket.on("call:offer", async ({ offer }) => {
			console.log("Received offer");

			// Store the offer for later processing
			pendingOfferRef.current = offer;
			console.log("Offer stored, waiting for user to accept call");
			// If localStream is already available (user already accepted), process immediately
			if (localStream && remotePeerIdRef.current) {
				console.log("Local stream ready, processing offer immediately");
				await processOffer(offer, localStream);
			}
		});

		// Receive answer
		socket.on("call:answer", async ({ answer }) => {
			console.log("Received answer");
			if (!peerConnectionRef.current) {
				console.error("No peer connection for answer");
				return;
			}

			try {
				console.log("Setting remote description (answer)");
				await peerConnectionRef.current.setRemoteDescription(
					new RTCSessionDescription(answer)
				);

				// Add queued ICE candidates
				console.log(
					"Processing queued ICE candidates:",
					iceCandidatesQueueRef.current.length
				);
				while (iceCandidatesQueueRef.current.length > 0) {
					const candidate = iceCandidatesQueueRef.current.shift();
					if (candidate) {
						console.log("Adding queued ICE candidate");
						await peerConnectionRef.current.addIceCandidate(candidate);
					}
				}
				console.log("Answer processed successfully");
			} catch (error) {
				console.error("Error handling answer:", error);
				endCall();
			}
		});

		// Receive ICE candidate
		socket.on("call:ice-candidate", async ({ candidate }) => {
			console.log("Received ICE candidate");
			const pc = peerConnectionRef.current;

			if (pc && pc.remoteDescription) {
				try {
					console.log("Adding ICE candidate immediately");
					await pc.addIceCandidate(new RTCIceCandidate(candidate));
					console.log("ICE candidate added");
				} catch (error) {
					console.error("Error adding ICE candidate:", error);
				}
			} else {
				// Queue the candidate if remote description is not set yet
				console.log("Queuing ICE candidate (no remote description yet)");
				iceCandidatesQueueRef.current.push(new RTCIceCandidate(candidate));
				console.log(
					"ICE candidates in queue:",
					iceCandidatesQueueRef.current.length
				);
			}
		});

		// Call rejected
		socket.on("call:rejected", () => {
			console.log("Call was rejected");
			endCall();
		});

		// Call ended
		socket.on("call:ended", () => {
			console.log("Call was ended by remote peer");
			endCall();
		});

		return () => {
			socket.off("call:incoming");
			socket.off("call:offer");
			socket.off("call:answer");
			socket.off("call:ice-candidate");
			socket.off("call:rejected");
			socket.off("call:ended");
		};
	}, [
		socket,
		createPeerConnection,
		endCall,
		localStream,
		remotePeerIdRef,
		processOffer,
	]);

	return (
		<CallContext.Provider
			value={{
				callState,
				callType,
				isAudioEnabled,
				isAudioToggling,
				isAudioError,
				isVideoEnabled,
				isVideoToggling,
				isVideoError,
				incomingCall,
				localStream,
				remoteStream,
				initiateCall,
				acceptCall,
				rejectCall,
				endCall,
				toggleAudio,
				toggleVideo,
			}}
		>
			{children}
		</CallContext.Provider>
	);
};
