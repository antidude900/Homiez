/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
	getConversations,
	markConversationSeen,
} from "@/lib/actions/message.action";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CheckCheck } from "lucide-react";
import { getUserId } from "@/lib/actions/user.action";
import { useChat } from "@/context/ChatContext";
import { useSocket } from "@/context/SocketContext";

const ConversationList = () => {
	const {
		conversations,
		setConversations,
		selectedConversation,
		setSelectedConversation,
	} = useChat();

	const [loading, setLoading] = useState(true);
	const userIdRef = useRef<string | null>(null);
	const { socket, onlineUsers } = useSocket();

	useEffect(() => {
		const fetchData = async () => {
			if (!loading) {
				return;
			}
			const id = await getUserId().then((e) => JSON.parse(e));
			userIdRef.current = id;

			const data = await getConversations().then((e) => JSON.parse(e));
			setConversations(data);
		};

		fetchData();
		setLoading(false);
	}, []);

	useEffect(() => {
		if (!socket) return;

		socket.on("messageSeen", (conversationId) => {
			setConversations((prev) =>
				prev.map((convo) =>
					convo._id === conversationId
						? {
								...convo,
								lastMessage: {
									...convo.lastMessage,
									seen: true,
								},
						  }
						: convo
				)
			);
		});

		return () => {
			socket.off("messageSeen");
		};
	}, [socket]);

	useEffect(() => {
		if (!socket) return;

		socket.on("newConversation", (conversation) => {
			console.log("received",conversation)
			setConversations((prev) => [...prev, conversation]);
		});
		console.log

		return () => {
			socket.off("newConversation");
		};
	}, [socket]);

	useEffect(() => {
		if (!selectedConversation?._id || selectedConversation._id === "temp")
			return;

		const markSeen = async () => {
			const current = conversations.find(
				(c) => c._id === selectedConversation._id
			);

			if (
				current &&
				!current.lastMessage.seen &&
				current.lastMessage.sender !== userIdRef.current
			) {
				await markConversationSeen(current._id);

				setConversations((prev) =>
					prev.map((c) =>
						c._id === current._id
							? { ...c, lastMessage: { ...c.lastMessage, seen: true } }
							: c
					)
				);
				socket?.emit("messageSeen", {
					conversationId: selectedConversation._id,
					receiverId: current.lastMessage.sender,
				});
			}
		};

		markSeen();
	}, [selectedConversation, conversations]);

	return (
		<div className="flex flex-col bg-background mx-2 rounded-lg">
			{loading ? (
				<div className="text-center text-muted-foreground mt-10">
					Loading conversations...
				</div>
			) : conversations.length === 0 ? (
				<div className="text-center text-muted-foreground mt-10">
					No conversations yet
				</div>
			) : (
				<div className="flex flex-col gap-2 overflow-y-auto px-1 py-2 h-full">
					{conversations &&
						conversations.map((conversation) => {
							console.log(conversations);
							if (!conversation.lastMessage) {
								console.log("errored one", conversation);
								return null;
							}
							const isMe =
								conversation.lastMessage.sender === userIdRef.current;
							const isUnseen = !conversation.lastMessage.seen;

							const isOnline = onlineUsers.includes(
								conversation.participants[0]._id
							);

							return (
								<div
									onClick={() => {
										setSelectedConversation({
											_id: conversation._id,
											name: conversation.participants[0].name,
											userId: conversation.participants[0]._id,
											username: conversation.participants[0].username,
											userProfilePic: conversation.participants[0].picture,
										});
										console.log(
											"selectedConversation User",
											selectedConversation
										);
									}}
									key={conversation._id}
									className={`flex items-center justify-between px-2 py-2 rounded-lg transition cursor-pointer hover:bg-muted ${
										isUnseen ? "bg-accent/30" : ""
									} ${
										selectedConversation?._id === conversation._id && "bg-muted"
									}`}
								>
									<div className="flex items-center gap-3 min-w-0">
										<div className="relative">
											<Avatar className="w-12 h-12">
												<AvatarImage
													src={conversation.participants[0].picture}
												/>
												<AvatarFallback className="bg-green-700 text-white">
													{conversation.participants[0].name[0]}
												</AvatarFallback>
											</Avatar>

											{isOnline && (
												<span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 border-[0.5px] border-white rounded-full"></span>
											)}
										</div>
										<div className="flex flex-col min-w-0">
											<p
												className={`text-sm truncate ${
													isUnseen && !isMe
														? "font-bold"
														: "font-semibold text-muted-foreground"
												}`}
											>
												{conversation.participants[0].name}
											</p>

											<div
												className={`flex items-center gap-1 text-sm max-w-[200px] ${
													isUnseen && !isMe
														? "font-medium text-foreground"
														: "text-muted-foreground"
												}`}
											>
												{isMe && (
													<CheckCheck
														className={`w-4 h-4 flex-shrink-0 ${
															conversation.lastMessage.seen
																? "text-blue-500"
																: "text-muted-foreground"
														}`}
													/>
												)}
												<span className="truncate min-w-0">
													{conversation.lastMessage.text.length > 30
														? conversation.lastMessage.text.substring(0, 30) +
														  "..."
														: conversation.lastMessage.text}
												</span>
											</div>
										</div>
									</div>

									{isUnseen && !isMe && (
										<div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
									)}
								</div>
							);
						})}
				</div>
			)}
		</div>
	);
};

export default ConversationList;
