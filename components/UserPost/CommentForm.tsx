"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import image from "next/image";
import { createComment } from "@/lib/actions/comment.actions";
import { getUserId } from "@/lib/actions/user.action";

export default function CreateCommentForm({ postId }: { postId: string }) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [text, setText] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		const authorId = await getUserId().then((e) => JSON.parse(e));
		e.preventDefault();

		if (!text.trim() && !image) {
			setError("Please add some text or an image");
			return;
		}

		setError(null);
		setIsSubmitting(true);

		try {
			await createComment({
				text,
				author: authorId,
				postId: postId,
			});

			setText("");

			setOpen(false);

			// Refresh the page to show the new post
			router.refresh();
		} catch (error) {
			console.error("Error:", error);
			setError("Failed to comment. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<MessageCircle className="cursor-pointer" />
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px] [&>button]:hidden">
				<form onSubmit={handleSubmit}>
					<DialogHeader className="mb-4">
						<DialogTitle>Create a new post</DialogTitle>
						<DialogDescription>What&apos;s on your mind?</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 mb-4">
						<div className="grid gap-2">
							<Label htmlFor="text">Content</Label>
							<Textarea
								id="text"
								placeholder="Write it down..."
								value={text}
								onChange={(e) => setText(e.target.value)}
								className="min-h-[100px] resize-none"
							/>
						</div>

						{error && (
							<p className="text-sm font-medium text-destructive">{error}</p>
						)}
					</div>
					<DialogFooter>
						<Button
							type="button"
							className="bg-destructive"
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={handleSubmit}
							disabled={isSubmitting}
							className="cursor-pointer"
						>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Posting...
								</>
							) : (
								"Comment"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
