"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Participant = {
	_id: string;
	name: string;
	username: string;
	picture: string;
};

export type Conversation = {
	participants: Participant[];
	lastMessage: {
		text: string;
		sender: string;
		seen?: boolean;
	};
	_id: string;
};

export interface SelectedConversation {
	_id: string;
	userId: string;
	name: string;
	username: string;
	userProfilePic: string;
}

export type Message = {
	_id: string;
	sender: string;
	text: string;
};

interface ChatContextType {
	conversations: Conversation[];
	setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;

	selectedConversation: SelectedConversation;
	setSelectedConversation: React.Dispatch<
		React.SetStateAction<SelectedConversation>
	>;

	messages: Record<string, Message[]>;
	setMessages: React.Dispatch<React.SetStateAction<Record<string, Message[]>>>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [selectedConversation, setSelectedConversation] =
		useState<SelectedConversation>({
			_id: "",
			userId: "",
			name: "",
			username: "",
			userProfilePic: "",
		});
	const [messages, setMessages] = useState<Record<string, Message[]>>({});

	return (
		<ChatContext.Provider
			value={{
				conversations,
				setConversations,
				selectedConversation,
				setSelectedConversation,
				messages,
				setMessages,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};

export const useChat = () => {
	const context = useContext(ChatContext);
	if (!context) {
		throw new Error("useChat must be used within a ChatProvider");
	}
	return context;
};
