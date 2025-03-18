"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
	EllipsisVertical,
	Heart,
	MessageCircle,
	SquareArrowOutUpRight,
} from "lucide-react";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";

interface UserPostProps {
	author: {
		_id: string;
		name: string;
		username: string;
		picture: string;
	};
	postText: string;
	postedAt: string;
	postImg?: string;
	likesCount: number;
	repliesCount: number;
}

const UserPost = ({
	author,
	postText,
	postedAt,
	postImg,
	likesCount,
	repliesCount,
}: UserPostProps) => {
	const [liked, setLiked] = useState(false);

	return (
		<div className="bg-background rounded-xl border border-border">
			<div className="flex p-2">
				<Avatar className="w-16 h-16 mr-5">
					<AvatarImage src={author.picture} />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>

				<div className="w-full vertical-flex">
					<div className="flex mb-4 justify-between">
						<div className="vertical-flex">
							<div>
								<span
									className="font-bold mr-2 cursor-pointer"
									onClick={() => {
										alert("Clicked!");
									}}
								>
									{author.name}
								</span>

								<span
									className="text-muted-foreground text-sm cursor-pointer"
									onClick={() => {
										alert("Clicked!");
									}}
								>
									@{author.username}
								</span>
							</div>

							<Link href={`${author.username}/post/1`}>
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
						<Link href={`${author.username}/post/1`} className="w-full mb-1">
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
						<MessageCircle />
						<SquareArrowOutUpRight />
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserPost;
