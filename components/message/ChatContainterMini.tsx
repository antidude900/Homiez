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
import { useEffect, useState } from "react";
import { useCall } from "@/context/CallContext";
import { usePathname, useRouter } from "next/navigation";

export default function ChatContainerMini({
	workOnDefault = false,
}: {
	workOnDefault?: boolean;
}) {
	const { selectedConversation, setSelectedConversation } = useChat();
	const { callState } = useCall();
	const [displayEnable, setDisplayEnable] = useState(false);
	const pathname = usePathname();
	const router = useRouter();

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
			modal={callState === "idle"}
			onOpenChange={() => {
				setSelectedConversation({
					_id: "",
					userId: "",
					name: "",
					username: "",
					userProfilePic: "",
				});
				if (pathname.startsWith("/chat")) {
					router.push(`/chat`);
				}
			}}
		>
			<DialogContent className="max-w-[95vw] w-full md:max-w-[50vw] [&>button:last-of-type]:hidden p-0 overflow-hidden rounded-md">
				<VisuallyHidden>
					<DialogTitle>Chat Window</DialogTitle>
				</VisuallyHidden>

				<div className="h-[80vh] overflow-hidden">
					<ChatContainer fullScreenOption={workOnDefault} />
				</div>

				<div className="absolute right-0 top-0 flex items-center">
					<DialogClose asChild>
						<X className="h-4 w-4 stroke-muted-foreground hover:stroke-destructive" />
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
}
