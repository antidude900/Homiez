import { Message } from "./Message";
import { MessageSendBar } from "./MessageSendBar";
import { useChat } from "@/context/ChatContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getMessages } from "@/lib/actions/message.action";
import { useState, useEffect, useRef } from "react";
import { useSocket } from "@/context/SocketContext";
import { MessagesSquare } from "lucide-react";
import { useUser } from "@/context/UserContext";

type Message = {
	_id: string;
	sender: string;
	text: string;
};

export const ChatContainer = () => {
	const { selectedConversation, setConversations } = useChat();
	const [messages, setMessages] = useState<Record<string, Message[]>>({});
	const currentMessages = messages[selectedConversation._id] || [];
	const [loading, setLoading] = useState(true);
	const { user } = useUser();
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
		if (!selectedConversation.userId) {
			return;
		}

		setLoading(true);
		isInitialLoad.current = true;
		const fetchData = async () => {
			if (
				messages[selectedConversation._id] ||
				selectedConversation._id === "temp"
			) {
				return;
			}

			setLoading(true);
			const data = await getMessages(selectedConversation.userId).then((e) =>
				JSON.parse(e)
			);

			setMessages((prev) => ({
				...prev,
				[selectedConversation._id]: data,
			}));
		};

		fetchData();
		setLoading(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedConversation.userId]);

	useEffect(() => {
		if (!socket) {
			return;
		}

		socket.on("message", (newMessage) => {
			setMessages((prev) => {
				const currentMessages = prev[selectedConversation._id] || [];

				// Prevent duplicates
				const messageExists = currentMessages.some(
					(msg) => msg._id === newMessage._id
				);
				if (messageExists) return prev;

				return {
					...prev,
					[selectedConversation._id]: [...currentMessages, newMessage],
				};
			});

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
	}, [socket, selectedConversation._id]);

	if (!user) return <div>Loading User...</div>;

	return (
		<>
			{!selectedConversation._id ? (
				<div className="flex flex-col justify-center items-center h-full text-center text-gray-600">
					<MessagesSquare className="w-20 h-20 mb-4" />
					<div>Select a chat to start messaging</div>
				</div>
			) : (
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
							currentMessages.map((message, index) => (
								<Message
									key={`${message._id}-${index}`}
									message={message.text}
									ownMessage={message.sender === user._id}
								/>
							))}

						<div ref={messagesEndRef} />
					</div>
					<div className="w-full p-2">
						<MessageSendBar setMessages={setMessages} />
					</div>
				</div>
			)}
		</>
	);
};
