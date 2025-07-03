import { SendHorizonal } from "lucide-react";
import { useRef, useEffect, useState } from "react";

export const MessageSendBar = () => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [message, setMessage] = useState("");

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

	const handleSend = () => {
		if (!message.trim()) return; // Prevent empty messages
		console.log("Sending:", message);

		// Clear input
		setMessage("");

		// Reset height
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
					value={message}
					onChange={(e) => setMessage(e.target.value)}
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
