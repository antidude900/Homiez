"use client";

import { ChatContainer } from "@/components/message/ChatContainer";
import { useSelectedChat } from "@/context/SelectChatContext";
import { MessagesSquare } from "lucide-react";

const Page = () => {
	const { selectedChat } = useSelectedChat();
	return (
		<div className="h-full">
			{/* {!selectedChat._id ? (
				<div className="flex flex-col justify-center items-center h-full text-center text-gray-600">
					<MessagesSquare className="w-20 h-20 mb-4" />
					<div>Select a chat to start messaging</div>
				</div>
			) : ( */}
				<ChatContainer />
			{/* )} */}
		</div>
	);
};

export default Page;
