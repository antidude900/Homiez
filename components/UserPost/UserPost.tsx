"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Heart, SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import { IUser } from "@/database/user.model";
import CreateCommentForm from "./CommentForm";
import { usePathname } from "next/navigation";
import { likeUnlikePost } from "@/lib/actions/post.action";
import { LikeUsersShow } from "../shared/LikeUsersShow";
import { useUser } from "@/context/UserContext";

import { toast } from "react-toastify";
import EditDeletePost from "./EditDeletePost";
import { useState, useRef } from "react";

interface UserPostProps {
	author: Partial<IUser>;
	postId: string;
	postText: string;
	postedAt: string;
	postImg?: string;
	likes: string[];
	repliesCount: number;
	liked: boolean;
	isSelf: boolean;
}

const UserPost = ({
	author,
	postId,
	postText,
	postedAt,
	postImg,
	likes,
	repliesCount,
	liked,
	isSelf,
}: UserPostProps) => {
	const pathname = usePathname();
	const { user } = useUser();
	const [fetched, setFetched] = useState(false);

	const [isLiked, setIsLiked] = useState(liked);
	const [likesCount, setLikesCount] = useState(likes.length);
	const [likedUsers, setLikedUsers] = useState<string[]>(likes);
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

	return (
		<div className="bg-background rounded-xl border border-border py-4 px-6">
			<div className="flex mb-2">
				<Link href={`/user/${author.username}`}>
					<Avatar className="w-14 h-14 mr-2">
						<AvatarImage src={author.picture} />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</Link>
				<div className="w-full">
					<div className="flex mb-4 justify-between">
						<div className="space-y-1">
							<Link href={`/user/${author.username}`}>
								<div className="font-bold mr-2 cursor-pointer">
									{author.name}
								</div>

								<span className="text-muted-foreground text-sm cursor-pointer mr-5">
									@{author.username}
								</span>
							</Link>
						</div>

						<div className="flex mr-2 items-center h-fit">
							{isSelf && (
								<EditDeletePost
									postId={postId}
									txt={postText}
									img={postImg || ""}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
			<Link href={`/user/${author.username}/post/${postId}`} className="block">
				<div className="mb-2 px-1">{postText}</div>
				{postImg && (
					<div className="w-full mb-1">
						<Image
							src={postImg}
							alt="post image"
							layout="responsive"
							width={16}
							height={9}
							objectFit="contain"
							className="rounded-xl max-h-[500px]"
						/>
					</div>
				)}
			</Link>
			<div className="flex justify-between px-1">
				<div className="text-[14px] text-muted-foreground mb-2">
					<LikeUsersShow
						likedUsers={likedUsers}
						fetched={fetched}
						setFetched={setFetched}
					>
						{likesCount}
					</LikeUsersShow>{" "}
					<span> &nbsp;|&nbsp; </span>
					<Link href={`/user/${author.username}/post/${postId}`}>
						<span className="cursor-pointer">{repliesCount} replies</span>
					</Link>
				</div>

				<div className="text-muted-foreground text-sm">
					{getTimestamp(postedAt) + " ago"}
				</div>
			</div>

			<div
				className="flex justify-between px-2"
				onClick={(e) => e.preventDefault()}
			>
				<Heart
					color={isLiked ? "red" : "currentColor"}
					fill={isLiked ? "red" : "transparent"}
					onClick={() => {
						const newLikedState = !isLiked;
						setIsLiked(newLikedState);
						setLikesCount((prev) => (newLikedState ? prev + 1 : prev - 1));

						if (user?._id) {
							if (newLikedState) {
								setLikedUsers((prev) => [...prev, user._id]);
							} else {
								setLikedUsers((prev) => prev.filter((id) => id !== user._id));
							}
						}

						if (debounceTimerRef.current) {
							clearTimeout(debounceTimerRef.current);
						}

						debounceTimerRef.current = setTimeout(async () => {
							await likeUnlikePost(postId, pathname);
							setFetched(false);
						}, 250);
					}}
					className="cursor-pointer"
				/>
				<CreateCommentForm postId={postId} />
				<SquareArrowOutUpRight
					className="cursor-pointer"
					onClick={() => {
						navigator.clipboard.writeText(
							`https://homiez-rj3z.onrender.com/${author.username}/post/${postId}`
						);
						toast.success("Post Link copied!", { autoClose: 500 });
					}}
				/>
			</div>
		</div>
	);
};

export default UserPost;
