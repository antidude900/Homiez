import { Message } from "./Message";
import { MessageSendBar } from "./MessageSendBar";
import { useSelectedChat } from "@/context/SelectChatContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getMessages } from "@/lib/actions/message.action";
import { useState, useEffect, useRef } from "react";
import { getUserId } from "@/lib/actions/user.action";

type Message = {
	_id: string;
	sender: string;
	text: string;
};

export const ChatContainer = () => {
	const { selectedChat } = useSelectedChat();
	const [messages, setMessages] = useState<Message[]>([]);
	const [loading, setLoading] = useState(true);
	const userId = useRef<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			const data = await getMessages(selectedChat.userId).then((e) =>
				JSON.parse(e)
			);

			const id = await getUserId().then((e) => JSON.parse(e));
			userId.current = id;

			setMessages(data);
			setLoading(false);
			console.log("messages", data);
		};

		fetchData();
	}, []);

	return (
		<div className="flex flex-col bg-gray-200 dark:bg-gray-800 rounded-md p-2 h-screen max-h-[95vh]">
			<div className="flex items-center gap-2 w-full h-[10%] p-2">
				<Avatar className="w-10 h-10">
					<AvatarImage src={selectedChat.userProfilePic} />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>

				<div className="flex items-center text-black dark:text-white">
					{selectedChat.name}
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
			</div>
			<div className="w-full p-2">
				<MessageSendBar setMessages={setMessages} />
			</div>
		</div>
	);
};
