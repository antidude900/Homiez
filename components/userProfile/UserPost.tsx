"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { EllipsisVertical, Heart, SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import { IUser } from "@/database/user.model";
import CreateCommentForm from "../shared/CommentForm";

interface UserPostProps {
	author: Partial<IUser>;
	postId: string;
	postText: string;
	postedAt: string;
	postImg?: string;
	likesCount: number;
	repliesCount: number;
}

const UserPost = ({
	author,
	postId,
	postText,
	postedAt,
	postImg,
	likesCount,
	repliesCount,
}: UserPostProps) => {
	const [liked, setLiked] = useState(false);

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
						<span className="cursor-pointer">{likesCount} likes</span>
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
							onClick={() => setLiked(!liked)}
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
