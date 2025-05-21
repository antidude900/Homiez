"use client";

import { getConversations } from "@/lib/actions/message.action";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

type Participant = {
	username: string;
	name: string;
	picture?: string;
};

type Conversation = {
	participants: Participant[];
	lastMessage: {
		text: string;
		sender: string;
		seen: boolean;
	};
};

const ConversationList = () => {
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const getConvo = async () => {
			const data = await getConversations().then((e) => JSON.parse(e));
			setConversations(data);
			setLoading(false);
		};

		getConvo();
	}, []);

	return (
		<div className="pt-2 p-4 h-screen border-r border-r-border flex flex-col">
			{loading ? (
				<div>Loading</div>
			) : (
				<div className="grid gap-4">
					{conversations.map((conversation) => (
						<div
							key={conversation.participants[0].username}
							className="flex justify-between w-full border-2"
						>
							<div className="flex items-center gap-3">
								<Avatar className="w-10 h-10">
									<AvatarImage src={conversation.participants[0].picture} />
									<AvatarFallback className="bg-green-700">
										{conversation.participants[0].name[0]}
									</AvatarFallback>
								</Avatar>
								<Link href={`/user/${conversation.participants[0].username}`}>
									<p className="text-sm font-semibold">
										{conversation.participants[0].name}
									</p>
									<p className="text-l text-muted-foreground">
										{conversation.lastMessage.text.length > 18
											? conversation.lastMessage.text.substring(0, 18) + "..."
											: conversation.lastMessage.text}
									</p>
								</Link>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ConversationList;
