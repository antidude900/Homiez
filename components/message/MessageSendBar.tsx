"use client";

import { useChat } from "@/context/ChatContext";
import { useSocket } from "@/context/SocketContext";
import { useUser } from "@/context/UserContext";
import { getConversation, sendMessage } from "@/lib/actions/message.action";

import { SendHorizonal } from "lucide-react";
import { useRef, useEffect, useState } from "react";

type Participant = {
	_id: string;
	name: string;
	username: string;
	picture: string;
};

export const MessageSendBar = () => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [text, setText] = useState("");
	const { user } = useUser();
	const {
		setConversations,
		selectedConversation,
		setSelectedConversation,
		setMessages,
	} = useChat();
	const { socket } = useSocket();

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

	if (user === null) return <div>Loading</div>;

	const handleSend = async () => {
		if (!text.trim()) return; // Prevent empty messages

		const newMessage = await sendMessage(
			selectedConversation.userId,
			text.trim()
		).then((e) => JSON.parse(e));

		let conversationId = selectedConversation._id;

		if (selectedConversation._id === "temp") {
			const conversation = await getConversation(
				selectedConversation.userId
			).then((e) => JSON.parse(e));
			conversationId = conversation._id;

			setConversations((prev) => [...prev, conversation]);

			setSelectedConversation((prev) => ({
				...prev,
				_id: conversation._id,
			}));

			const conversationCopy = {
				...conversation,
				participants: [
					...conversation.participants.filter(
						(p: Participant) => p._id !== user._id
					),
					{
						_id: user._id,
						name: user.name,
						username: user.username,
						picture: user.picture,
					},
				],
			};
			console.log("sent ", conversationCopy);
			socket?.emit("newConversation", {
				conversationCopy,
				receiverId: selectedConversation.userId,
			});
		}

		socket?.emit("message", {
			newMessage,
			receiverId: selectedConversation.userId,
		});

		console.log("updated or not", conversationId);
		setMessages((prev) => {
			const currentMessages = prev[conversationId] || [];
			return {
				...prev,
				[conversationId]: [...currentMessages, newMessage],
			};
		});

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
