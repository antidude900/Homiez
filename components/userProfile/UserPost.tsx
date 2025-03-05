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
					<AvatarImage src="https://scontent.fktm21-2.fna.fbcdn.net/v/t39.30808-1/412891167_122161924076008085_2280771312054575541_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=105&ccb=1-7&_nc_sid=e99d92&_nc_ohc=4kX2m-S9ROcQ7kNvgFnoYln&_nc_oc=Adjaf0B1TVjDHSbAjtvvHiRpZLy4YXuRmdzhk7_6NUoGLWc0-Pu77BVw3Vh_xSV_gtp2BgDTBwILkOIeVxrfw82R&_nc_zt=24&_nc_ht=scontent.fktm21-2.fna&_nc_gid=AK9HjGqhY6Bdhvhlr45HMji&oh=00_AYCXBfYgPgvQQUtl7j_CgUy7vsjDLEv3WYfJNYgWiBUqMw&oe=67C912C4" />
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
