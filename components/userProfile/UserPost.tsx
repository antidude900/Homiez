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

interface UserPostProps {
	username: string;
	postTitle: string;
	postedAt: string;
	postImg?: string;
	likesCount: number;
	repliesCount: number;
}

const UserPost = ({
	username,
	postTitle,
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
					<AvatarImage src="/pp.jpg" />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>

				<div className="w-full vertical-flex">
					<div className="flex mb-4 justify-between">
						<div className="vertical-flex">
							<span
								className="font-bold"
								onClick={(e) => {
									e.preventDefault();
									alert("Clicked!");
								}}
							>
								{username}
							</span>

							<Link href={`${username}/post/1`}>
								<span className="">{postTitle}</span>
							</Link>
						</div>
						<div className=" flex mr-2">
							<span className="text-muted-foreground">{postedAt}</span>
							<EllipsisVertical className="" />
						</div>
					</div>

					{postImg && (
						<Link href={`${username}/post/1`} className="w-full mb-1">
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
						<span>{likesCount} likes &nbsp;|</span>
						<span>&nbsp; {repliesCount} replies</span>
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
