"use client";

import { Message } from "./Message";
import { MessageSendBar } from "./MessageSendBar";
import { useChat } from "@/context/ChatContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getConversation, getMessages } from "@/lib/actions/message.action";
import { useState, useEffect, useRef, useMemo } from "react";
import { useSocket } from "@/context/SocketContext";
import { MessagesSquare } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { Skeleton } from "../ui/skeleton";
import { useRouter, usePathname, useParams } from "next/navigation";

type Message = {
	_id: string;
	sender: string;
	text: string;
};

export const ChatContainer = () => {
	const {
		selectedConversation,
		messages,
		setMessages,
		setSelectedConversation,
	} = useChat();
	const router = useRouter();
	const pathname = usePathname();
	const params = useParams<{ conversationId?: string[] }>();
	const conversationId = params.conversationId?.[0];

	const currentMessages = useMemo(
		() => messages[selectedConversation.userId] || [],
		[messages, selectedConversation.userId]
	);
	const [loading, setLoading] = useState(true);
	const { user } = useUser();
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { onlineUsers } = useSocket();
	const isOnline = onlineUsers.includes(selectedConversation.userId);

	const scrollToBottom = ({ smoothScroll }: { smoothScroll: boolean }) => {
		messagesEndRef.current?.scrollIntoView({
			behavior: smoothScroll ? "smooth" : "auto",
		});
	};

	useEffect(() => {
		const fetchData = async () => {
			if (!pathname.startsWith("/chat")) return;
			if (selectedConversation._id) {
				router.push(`/chat/${selectedConversation._id}`);
			}

			if (conversationId && !selectedConversation._id) {
				try {
					const conversation = await getConversation({ conversationId }).then(
						(e) => JSON.parse(e)
					);

					setSelectedConversation({
						_id: conversation._id,
						name: conversation.participants[0].name,
						userId: conversation.participants[0]._id,
						username: conversation.participants[0].username,
						userProfilePic: conversation.participants[0].picture,
					});
				} catch (err) {
					console.error("Error fetching conversation", err);
				}
			}
		};
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (loading) return;
		scrollToBottom({ smoothScroll: true });
	}, [currentMessages, loading]);

	useEffect(() => {
		if (loading) return;
		scrollToBottom({ smoothScroll: false });
	}, [selectedConversation._id, loading]);

	useEffect(() => {
		if (!selectedConversation.userId) return;

		setLoading(true);

		const fetchData = async () => {
			// Only fetch if no messages are already cached
			if (
				messages[selectedConversation.userId] !== undefined ||
				selectedConversation._id === "temp"
			) {
				setLoading(false);
				return;
			}

			try {
				console.log("fetching messages for", selectedConversation.userId);

				const data = await getMessages(selectedConversation.userId).then((e) =>
					JSON.parse(e)
				);
				console.log("fetched messages", data);

				setMessages((prev) => ({
					...prev,
					[selectedConversation.userId]: data,
				}));
			} catch (err) {
				console.error("Error fetching messages", err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedConversation.userId]);

	if (!user) return null;

	return (
		<>
			{!selectedConversation._id ? (
				<div className="flex flex-col justify-center items-center h-full text-center text-gray-600">
					<MessagesSquare className="w-20 h-20 mb-4" />
					<div>Select a chat to start messaging</div>
				</div>
			) : (
				<div className="flex flex-col bg-gray-200 dark:bg-gray-800 rounded-md p-2 h-full">
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
							<div className="space-y-4">
								{[...Array(3)].map((_, i) => (
									<div
										key={i}
										className={`flex items-center gap-2 p-1 rounded-md ${
											i % 2 === 0 ? "justify-start" : "justify-end"
										}`}
									>
										{i % 2 === 0 && (
											<Skeleton className="w-7 h-7 rounded-full flex-shrink-0 bg-secondary" />
										)}
										<div className="flex flex-col gap-2">
											<Skeleton className="w-[250px] h-2 bg-secondary" />
											<Skeleton className="w-[200px] h-2 bg-secondary" />
											<Skeleton className="w-[180px] h-2 bg-secondary" />
										</div>
										{i % 2 !== 0 && (
											<Skeleton className="w-7 h-7 rounded-full flex-shrink-0 bg-secondary" />
										)}
									</div>
								))}
							</div>
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
						<MessageSendBar />
					</div>
				</div>
			)}
		</>
	);
};
