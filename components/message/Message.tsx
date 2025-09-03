import { useChat } from "@/context/ChatContext";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

import React from "react";
import { useUser } from "@/context/UserContext";

interface MessageProps {
	ownMessage: boolean;
	message: string;
}

export const Message = ({ ownMessage, message }: MessageProps) => {
	const { selectedConversation } = useChat();
	const { user } = useUser();

	return (
		<>
			{ownMessage ? (
				<div className="flex gap-2 self-end">
					<div className="max-w-[350px] bg-accent p-2 rounded-md text-white text-sm">
						{message}
					</div>
					<Avatar className="w-10 h-10">
						<AvatarImage src={user?.picture || ""} />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</div>
			) : (
				<div className="flex gap-4">
					<Avatar className="w-10 h-10">
						<AvatarImage src={selectedConversation.userProfilePic} />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<div className="max-w-[350px] bg-gray-400 p-2 rounded-md text-white text-sm">
						{message}
					</div>
				</div>
			)}
		</>
	);
};
