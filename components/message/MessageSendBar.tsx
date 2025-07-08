"use client";

import { useChat } from "@/context/ChatContext";
import { useUser } from "@/context/UserContext";
import { sendMessage } from "@/lib/actions/message.action";

import { SendHorizonal } from "lucide-react";
import { useRef, useEffect, useState } from "react";

type Message = {
	_id: string;
	sender: string;
	text: string;
};

export const MessageSendBar = ({
	setMessages,
}: {
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [text, setText] = useState("");
	const { user } = useUser();
	const { setConversations, selectedConversation } = useChat();

	useEffect(() => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const adjustHeight = () => {
			textarea.style.height = "auto";
			textarea.style.height = `${textarea.scrollHeight}px`;
		};

		textarea.addEventListener("input", adjustHeight);
		adjustHeight();

		return () => textarea.removeEventListener("input", adjustHeight);
	}, []);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault(); // Prevent newline
			handleSend();
		}
	};

	if (user === null) throw new Error("User not found");

	const handleSend = async () => {
		if (!text.trim()) return; // Prevent empty messages

		const newMessage = await sendMessage(user._id, text.trim()).then((e) =>
			JSON.parse(e)
		);

		setMessages((prevMessages) => [...prevMessages, newMessage]);

		setText("");

		setConversations((prevConvo) => {
			const updatedConvo = prevConvo.map((convo) => {
				if (convo._id === selectedConversation._id) {
					return {
						...convo,
						lastMessage: {
							text: text.trim(),
							sender: user._id,
						},
					};
				}
				return convo;
			});
			return updatedConvo;
		});

		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
		}
	};

	return (
		<form
			className="w-full flex items-end"
			onSubmit={(e) => {
				e.preventDefault();
				handleSend();
			}}
		>
			<div className="relative flex flex-grow items-center border border-border rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500 p-2">
				<textarea
					ref={textareaRef}
					rows={1}
					placeholder="Type a message"
					style={{ maxHeight: "150px" }}
					className="flex-grow resize-none overflow-auto p-2 placeholder-gray-500 bg-transparent outline-none transition-all"
					value={text}
					onChange={(e) => setText(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<div
					className="ml-2 flex items-center cursor-pointer"
					onClick={handleSend}
				>
					<SendHorizonal className="h-5 w-5" />
				</div>
			</div>
		</form>
	);
};
