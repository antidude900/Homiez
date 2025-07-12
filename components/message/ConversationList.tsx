"use client";

import { getConversations } from "@/lib/actions/message.action";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CheckCheck } from "lucide-react";
import { getUserId } from "@/lib/actions/user.action";
import { useChat } from "@/context/ChatContext";
import ChatSearchHeader from "../RightSideBar/ChatSearchHeader";

const ConversationList = () => {
	const { conversations, setConversations } = useChat();

	const [loading, setLoading] = useState(true);
	const userIdRef = useRef<string | null>(null);
	const { selectedConversation, setSelectedConversation } = useChat();

	console.log("selectedConversation", selectedConversation);

	useEffect(() => {
		const fetchData = async () => {
			const id = await getUserId().then((e) => JSON.parse(e));
			userIdRef.current = id;

			const data = await getConversations().then((e) => JSON.parse(e));
			setConversations(data);
			console.log("conversations", data);
			setLoading(false);
		};

		fetchData();
	}, []);

	return (
		<div className="pt-4 px-4 h-screen border-r border-border flex flex-col">
			<ChatSearchHeader fullScreenOption={false} />

			{loading ? (
				<div className="text-center text-muted-foreground mt-10">
					Loading conversations...
				</div>
			) : conversations.length === 0 ? (
				<div className="text-center text-muted-foreground mt-10">
					No conversations yet
				</div>
			) : (
				<div className="flex flex-col gap-2 overflow-y-auto pr-2 h-full">
					{conversations.map((conversation) => {
						const isMe = conversation.lastMessage.sender === userIdRef.current;
						const isUnseen = !conversation.lastMessage.seen && !isMe;

						return (
							<div
								onClick={() =>
									setSelectedConversation({
										_id: conversation._id,
										name: conversation.participants[0].name,
										userId: conversation.participants[0]._id,
										username: conversation.participants[0].username,
										userProfilePic: conversation.participants[0].picture,
									})
								}
								key={conversation._id}
								className={`flex items-center justify-between p-3 rounded-lg transition cursor-pointer hover:bg-muted ${
									isUnseen ? "bg-accent/30" : ""
								} ${
									selectedConversation?._id === conversation._id && "bg-muted"
								}`}
							>
								<div className="flex items-center gap-3 min-w-0">
									<Avatar className="w-12 h-12">
										<AvatarImage src={conversation.participants[0].picture} />
										<AvatarFallback className="bg-green-700 text-white">
											{conversation.participants[0].name[0]}
										</AvatarFallback>
									</Avatar>

									<div className="flex flex-col min-w-0">
										<p
											className={`text-sm truncate ${
												isUnseen
													? "font-bold"
													: "font-semibold text-muted-foreground"
											}`}
										>
											{conversation.participants[0].name}
										</p>

										<div
											className={`flex items-center gap-1 text-sm max-w-[200px] ${
												isUnseen
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

								{isUnseen && (
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
