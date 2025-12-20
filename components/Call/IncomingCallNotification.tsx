"use client";

import { useCall } from "@/context/CallContext";
import { Phone, PhoneOff, Video } from "lucide-react";
import { Button } from "../ui/button";

export const IncomingCallNotification = () => {
	const { incomingCall, acceptCall, rejectCall } = useCall();

	if (!incomingCall) return null;

	const isVideoCall = incomingCall.callType === "video";

	return (
		<div className="fixed inset-0 z-[60] bg-black bg-opacity-70 flex items-center justify-center">
			<div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-8 max-w-[95vw] w-full md:max-w-[50vw] mx-4">
				<div className="text-center mb-6 min-w-0">
					<div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
						{isVideoCall ? (
							<Video className="w-12 h-12 text-white" />
						) : (
							<Phone className="w-12 h-12 text-white" />
						)}
					</div>
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 truncate">
						{incomingCall.callerName}
					</h2>
					<p className="text-gray-600 dark:text-gray-400">
						Incoming {isVideoCall ? "video" : "voice"} call...
					</p>
				</div>

				<div className="flex gap-4 justify-center">
					<Button
						onClick={rejectCall}
						size="lg"
						variant="destructive"
						className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 pointer-events-auto"
					>
						<PhoneOff className="w-6 h-6" />
					</Button>

					<Button
						onClick={acceptCall}
						size="lg"
						className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700 pointer-events-auto"
					>
						<Phone className="w-6 h-6" />
					</Button>
				</div>
			</div>
		</div>
	);
};
