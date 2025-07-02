"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SelectedChat {
	_id: string;
	userId: string;
	username: string;
	userProfilePic: string;
}

interface SelectedChatContextType {
	selectedChat: SelectedChat;
	setSelectedChat: (chat: SelectedChat) => void;
}

const SelectedChatContext = createContext<SelectedChatContextType | null>(null);

export const SelectedChatProvider = ({ children }: { children: ReactNode }) => {
	const [selectedChat, setSelectedChat] = useState<SelectedChat>({
		_id: "",
		userId: "",
		username: "",
		userProfilePic: "",
	});

	return (
		<SelectedChatContext.Provider value={{ selectedChat, setSelectedChat }}>
			{children}
		</SelectedChatContext.Provider>
	);
};

export const useSelectedChat = () => {
	const context = useContext(SelectedChatContext);
	if (!context) {
		throw new Error(
			"useSelectedChat must be used within a SelectedChatProvider"
		);
	}
	return context;
};
