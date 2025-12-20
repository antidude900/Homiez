"use client";

import { useCall } from "@/context/CallContext";
import { useEffect, useRef } from "react";
import {
	Mic,
	MicOff,
	Video,
	VideoOff,
	PhoneOff,
	OctagonAlert,
} from "lucide-react";
import { Button } from "../ui/button";
import ToolTipWrapper from "../shared/ToolTipWrapper";

export const CallRoom = () => {
	const {
		callState,
		callType,
		isAudioEnabled,
		isAudioToggling,
		isAudioError,
		isVideoEnabled,
		isVideoToggling,
		isVideoError,
		localStream,
		remoteStream,
		endCall,
		toggleAudio,
		toggleVideo,
	} = useCall();

	const localVideoRef = useRef<HTMLVideoElement>(null);
	const remoteVideoRef = useRef<HTMLVideoElement>(null);
	const remoteAudioRef = useRef<HTMLAudioElement>(null);

	// Set up local video
	useEffect(() => {
		if (localVideoRef.current && localStream) {
			localVideoRef.current.srcObject = localStream;
		}
	}, [localStream, isVideoEnabled]);

	// Set up remote video
	useEffect(() => {
		if (remoteVideoRef.current && remoteStream) {
			remoteVideoRef.current.srcObject = remoteStream;
		}
	}, [remoteStream]);

	// Set up remote audio (for voice calls)
	useEffect(() => {
		if (remoteAudioRef.current && remoteStream) {
			remoteAudioRef.current.srcObject = remoteStream;
		}
	}, [remoteStream]);

	if (callState === "idle") return null;

	return (
		<div className="fixed inset-0 z-[60] bg-black flex flex-col">
			<div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
				<video
					ref={remoteVideoRef}
					autoPlay
					playsInline
					className="absolute inset-0 w-full h-full object-contain"
				/>

				{localStream && isVideoEnabled && (
					<div className="absolute top-4 right-4 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden shadow-lg border-2 border-gray-700">
						<video
							ref={localVideoRef}
							autoPlay
							playsInline
							muted
							className="w-full h-full object-contain"
						/>
					</div>
				)}

				{callState !== "connected" && (
					<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
						<div className="text-white text-center">
							<div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
							<p className="text-xl">
								{localStream === null
									? `Requesting access to Microphone${
											callType === "video" ? " and Camera" : ""
									  }`
									: "Calling"}
								...
							</p>
						</div>
					</div>
				)}
			</div>

			<div className="absolute bottom-0 left-0 right-0 pb-8 pt-4 flex items-center justify-center gap-6 bg-gradient-to-t from-black/80 to-transparent">
				<ToolTipWrapper
					description={
						isAudioError
							? "Audio Error! Enable the Microphone in the browser (no need to Reload) and toggle the button to try again"
							: ""
					}
					side="top"
				>
					<Button
						onClick={toggleAudio}
						size="lg"
						variant={isAudioEnabled ? "default" : "destructive"}
						disabled={isAudioToggling}
						className={`relative w-16 h-16 rounded-full [&_svg]:!size-auto ${
							isAudioToggling
								? "cursor-wait opacity-70"
								: isAudioEnabled
								? "hover:bg-gray-600"
								: "hover:bg-red-700"
						}`}
					>
						{isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
						{isAudioError && (
							<OctagonAlert
								className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2"
								size={16}
								color="yellow"
								strokeWidth={4}
							/>
						)}
					</Button>
				</ToolTipWrapper>

				<ToolTipWrapper
					description={
						isVideoError
							? "Video Error! Enable the Camera in the browser (no need to Reload) and toggle the button to try again"
							: ""
					}
					side="top"
				>
					<Button
						onClick={toggleVideo}
						size="lg"
						variant={isVideoEnabled ? "default" : "destructive"}
						disabled={isVideoToggling}
						className={`relative w-16 h-16 rounded-full [&_svg]:!size-auto ${
							isVideoToggling
								? "cursor-wait opacity-70"
								: isVideoEnabled
								? "hover:bg-gray-600"
								: "hover:bg-red-700"
						}`}
					>
						{isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}

						{isVideoError && (
							<OctagonAlert
								className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2"
								size={16}
								color="yellow"
								strokeWidth={4}
							/>
						)}
					</Button>
				</ToolTipWrapper>

				<Button
					onClick={endCall}
					size="lg"
					variant="destructive"
					className="w-16 h-16 rounded-full hover:bg-red-700 [&_svg]:!size-auto"
				>
					<PhoneOff size={24} />
				</Button>
			</div>
		</div>
	);
};
