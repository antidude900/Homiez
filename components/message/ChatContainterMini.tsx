"use client";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
} from "@/components/ui/dialog";

import { useChat } from "@/context/ChatContext";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ChatContainer } from "./ChatContainer";
import { X } from "lucide-react";

export default function ChatContainerMini() {
	const { selectedConversation, setSelectedConversation } = useChat();

	return (
		<Dialog
			open={selectedConversation.userId != ""}
			onOpenChange={() =>
				setSelectedConversation({
					_id: "",
					userId: "",
					name: "",
					username: "",
					userProfilePic: "",
				})
			}
		>
			<DialogContent className="max-w-[50vw] [&>button:last-of-type]:hidden p-0">
				<VisuallyHidden>
					<DialogTitle>Chat Window</DialogTitle>
				</VisuallyHidden>

				<div className="h-[80vh]">
					<ChatContainer />
				</div>

				<DialogClose asChild>
					<button className="absolute right-2 top-2 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700">
						<X className="h-5 w-5" />
					</button>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
}
