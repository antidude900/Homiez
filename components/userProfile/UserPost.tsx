"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { EllipsisVertical, Heart, SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import { IUser } from "@/database/user.model";
import CreateCommentForm from "../shared/CommentForm";
import { getUserId } from "@/lib/actions/user.action";
import { usePathname } from "next/navigation";
import { likeUnlikePost } from "@/lib/actions/post.action";
import { Skeleton } from "../ui/skeleton";

interface UserPostProps {
	author: Partial<IUser>;
	postId: string;
	postText: string;
	postedAt: string;
	postImg?: string;
	likes: string[];
	repliesCount: number;
}

const UserPost = ({
	author,
	postId,
	postText,
	postedAt,
	postImg,
	likes,
	repliesCount,
}: UserPostProps) => {
	const [liked, setLiked] = useState<boolean | null>(null);
	const [isSelf, setisSelf] = useState<boolean>(false);

	const pathname = usePathname();

	useEffect(() => {
		const setLikeandisSelf = async () => {
			const userId = await getUserId().then((e) => JSON.parse(e));
			setLiked(likes.includes(userId));
			setisSelf(userId === author._id);
		};

		setLikeandisSelf();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (liked == null) {
		return (
			<div className="rounded-xl border border-border flex px-4 py-4">
				<div className="flex-shrink-0 mr-5">
					<Skeleton className="w-16 h-16 rounded-full" />
				</div>

				<div className="w-full vertical-flex space-y-2 mr-5">
					<div className="flex items-center">
						<Skeleton className="h-5 w-24 mr-2" />
						<Skeleton className="h-4 w-10" />
					</div>

					<Skeleton className="h-4 w-1/2" />

					<Skeleton className="w-full h-[300px] rounded-xl mb-1" />
				</div>
			</div>
		);
	}

	return (
		<div className="bg-background rounded-xl border border-border">
			<div className="flex px-2 py-4">
				<Avatar className="w-16 h-16 mr-5">
					<AvatarImage src={author.picture} />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>

				<div className="w-full vertical-flex">
					<div className="flex mb-4 justify-between">
						<div className="vertical-flex">
							<Link href={`${author.username}`}>
								<span className="font-bold mr-2 cursor-pointer">
									{author.name}
								</span>

								<span className="text-muted-foreground text-sm cursor-pointer">
									@{author.username}
								</span>
							</Link>

							<Link href={`${author.username}/post/${postId}`}>
								<span className="">{postText}</span>
							</Link>
						</div>
						<div className=" flex mr-2">
							<span className="text-muted-foreground">
								{getTimestamp(postedAt)}
							</span>
							<EllipsisVertical />
						</div>
					</div>

					{postImg && (
						<Link
							href={`${author.username}/post/${postId}`}
							className="w-full mb-1"
						>
							<Image
								src={postImg}
								alt="post image"
								layout="responsive"
								width={16}
								height={9}
								objectFit="contain"
								className="rounded-xl max-h-[500px]"
							/>
						</Link>
					)}

					<div className="text-[14px] text-muted-foreground mb-2">
						<span className="cursor-pointer">{likes.length} likes</span>
						<span> &nbsp;|&nbsp; </span>
						<span className="cursor-pointer">{repliesCount} replies</span>
					</div>

					<div
						className="flex justify-between px-2"
						onClick={(e) => e.preventDefault()}
					>
						<Heart
							color={liked ? "red" : "currentColor"}
							fill={liked ? "red" : "transparent"}
							onClick={async () => {
								if (!isSelf) {
									await likeUnlikePost(postId, pathname);
									setLiked((prev) => !prev);
								}
							}}
							className={`${isSelf && "cursor-not-allowed opacity-20"}`}
						/>
						<CreateCommentForm postId={postId} />
						<SquareArrowOutUpRight />
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserPost;
