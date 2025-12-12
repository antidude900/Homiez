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
import { Fullscreen, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ChatContainerMini({
	workOnDefault = false,
}: {
	workOnDefault?: boolean;
}) {
	const { selectedConversation, setSelectedConversation } = useChat();
	const [displayEnable, setDisplayEnable] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setDisplayEnable(workOnDefault || window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);

		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	return (
		<Dialog
			open={selectedConversation.userId != "" && displayEnable}
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
			<DialogContent className="max-w-[95vw] w-full md:max-w-[50vw] [&>button:last-of-type]:hidden p-0 overflow-hidden">
				<VisuallyHidden>
					<DialogTitle>Chat Window</DialogTitle>
				</VisuallyHidden>

				<div className="h-[80vh] overflow-hidden">
					<ChatContainer />
				</div>

				<div className="absolute right-2 top-2 flex items-center gap-2">
					<Link
						href="/chat"
						className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
					>
						<Fullscreen className="h-5 w-5" />
					</Link>

					<DialogClose asChild>
						<button className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700">
							<X className="h-5 w-5" />
						</button>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
}
