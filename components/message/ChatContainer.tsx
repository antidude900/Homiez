import { Message } from "./Message";
import { MessageSendBar } from "./MessageSendBar";
import { useChat } from "@/context/ChatContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getMessages } from "@/lib/actions/message.action";
import { useState, useEffect, useRef } from "react";
import { getUserId } from "@/lib/actions/user.action";
import { useSocket } from "@/context/SocketContext";

type Message = {
	_id: string;
	sender: string;
	text: string;
};

export const ChatContainer = () => {
	const { selectedConversation, setConversations } = useChat();
	const [messages, setMessages] = useState<Message[]>([]);
	const [loading, setLoading] = useState(true);
	const userId = useRef<string | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const isInitialLoad = useRef<boolean>(true);
	const { socket, onlineUsers } = useSocket();
	const isOnline = onlineUsers.includes(selectedConversation.userId);

	const scrollToBottom = (smooth = false) => {
		messagesEndRef.current?.scrollIntoView({
			behavior: smooth ? "smooth" : "auto",
		});
	};

	useEffect(() => {
		if (loading) return;

		if (isInitialLoad.current) {
			scrollToBottom(false);
			isInitialLoad.current = false;
		} else {
			scrollToBottom(true);
		}
	}, [messages, loading]);

	useEffect(() => {
		setMessages([]);
		setLoading(true);
		isInitialLoad.current = true;
		const fetchData = async () => {
			const data = await getMessages(selectedConversation.userId).then((e) =>
				JSON.parse(e)
			);

			const id = await getUserId().then((e) => JSON.parse(e));
			userId.current = id;

			setMessages(data);
			setLoading(false);
		};

		fetchData();
	}, [selectedConversation.userId]);

	useEffect(() => {
		socket?.on("message", (newMessage) => {
			console.log("new message", newMessage);

			if (selectedConversation._id === newMessage.conversationId) {
				console.log("messages getting changed");
				setMessages((prev) => [...prev, newMessage]);
			}

			setConversations((prev) => {
				const updatedConversations = prev.map((conversation) => {
					if (conversation._id === newMessage.conversationId) {
						return {
							...conversation,
							lastMessage: {
								text: newMessage.text,
								sender: newMessage.sender,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
		});

		return () => {
			socket?.off("message");
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket, selectedConversation]);

	return (
		<div className="flex flex-col bg-gray-200 dark:bg-gray-800 rounded-md p-2 h-screen max-h-[95vh]">
			<div className="flex items-center gap-2 w-full h-[10%] p-2">
				<div className="relative">
					<Avatar className="w-10 h-10">
						<AvatarImage src={selectedConversation.userProfilePic} />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					{isOnline && (
						<span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 border-[0.5px] border-white rounded-full"></span>
					)}
				</div>

				<div className="flex items-center text-black dark:text-white">
					{selectedConversation.name}
				</div>
			</div>

			<hr className="border-t border-gray-300 dark:border-gray-700" />

			<div className="flex flex-col gap-4 p-4 h-[80%] overflow-y-auto">
				{loading && (
					<>
						{[...Array(5)].map((_, i) => (
							<div
								key={i}
								className={`flex items-center gap-2 p-1 rounded-md self-${
									i % 2 === 0 ? "start" : "end"
								}`}
							>
								{i % 2 === 0 && (
									<div className="w-7 h-7 rounded-full bg-gray-300 animate-pulse" />
								)}
								<div className="flex flex-col gap-2">
									<div className="w-[250px] h-2 bg-gray-300 animate-pulse rounded" />
									<div className="w-[250px] h-2 bg-gray-300 animate-pulse rounded" />
									<div className="w-[250px] h-2 bg-gray-300 animate-pulse rounded" />
								</div>
								{i % 2 !== 0 && (
									<div className="w-7 h-7 rounded-full bg-gray-300 animate-pulse" />
								)}
							</div>
						))}
					</>
				)}

				{!loading &&
					messages.map((message) => (
						<Message
							key={message._id}
							message={message.text}
							ownMessage={message.sender === userId.current}
						/>
					))}

				{/* Invisible div to scroll to */}
				<div ref={messagesEndRef} />
			</div>
			<div className="w-full p-2">
				<MessageSendBar setMessages={setMessages} />
			</div>
		</div>
	);
};
