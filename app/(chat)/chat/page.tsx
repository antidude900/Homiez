"use client";

import { ChatContainer } from "@/components/message/ChatContainer";
import { useChat } from "@/context/ChatContext";
import { MessagesSquare } from "lucide-react";

const Page = () => {
	const { selectedConversation } = useChat();
	return (
		<div className="h-full">
			{!selectedConversation._id ? (
				<div className="flex flex-col justify-center items-center h-full text-center text-gray-600">
					<MessagesSquare className="w-20 h-20 mb-4" />
					<div>Select a chat to start messaging</div>
				</div>
			) : (
				<ChatContainer />
			)}
		</div>
	);
};

export default Page;
