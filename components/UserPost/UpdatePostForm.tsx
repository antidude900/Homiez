"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, ImageIcon, X, Pencil } from "lucide-react";

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
import { updatePost } from "@/lib/actions/post.action";
import { toast } from "react-toastify";
import image from "next/image";

export default function UpdatePostForm({
	postId,
	txt,
	img,
}: {
	postId: string;
	txt: string;
	img: string;
}) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [text, setText] = useState(txt);
	const [imagePreview, setImagePreview] = useState<string>(img);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);


	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;

		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setImagePreview(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		} else {
			setImagePreview("");
		}
	};

	const removeImage = () => {
		setImagePreview("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!text.trim() && !image) {
			setError("Please add some text or an image");
			return;
		}

		setError(null);
		setIsSubmitting(true);

		try {
			await updatePost(postId, text, imagePreview);

			setOpen(false);
			toast.success("Post Updated!", { autoClose: 750 });

			router.refresh();
		} catch (error) {
			console.error("Error creating post:", error);
			setError("Failed to create post. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="w-full flex items-center gap-2">
				<Pencil className="w-4 h-4" />
				<span className="body-semibold">Edit</span>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px] [&>button]:hidden">
				<form onSubmit={handleSubmit}>
					<DialogHeader className="mb-4">
						<DialogTitle>Update Post</DialogTitle>
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
								onKeyDown={(e) => {
									if (e.key === " " || e.key === "Enter") {
										e.stopPropagation();
									}
								}}
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="image">Image</Label>
							{!imagePreview ? (
								<div className="flex items-center gap-2">
									<Label
										htmlFor="image-upload"
										className="flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
									>
										<ImageIcon className="h-4 w-4" />
										Upload Image
									</Label>
									<input
										id="image-upload"
										type="file"
										accept="image/*"
										onChange={handleImageChange}
										className="hidden"
									/>
								</div>
							) : (
								<div className="relative mt-2 rounded-md overflow-hidden">
									<Image
										src={imagePreview || "/placeholder.svg"}
										alt="Preview"
										width={400}
										height={300}
										className="object-cover max-h-[300px] w-full"
									/>
									<Button
										type="button"
										variant="destructive"
										size="icon"
										className="absolute top-2 right-2 h-8 w-8 rounded-full"
										onClick={removeImage}
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							)}
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
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Posting...
								</>
							) : (
								"Update"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
