"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { EllipsisVertical, Heart } from "lucide-react";
import { IUser } from "@/database/user.model";

interface CommentProps {
	author: Partial<IUser>;
	text: string;
	postedAt: string;
	likesCount: number;
}

const Comment = ({ author, text, postedAt, likesCount }: CommentProps) => {
	const [liked, setLiked] = useState(false);
	return (
		<div className="bg-background rounded-xl border border-border">
			<div className="flex p-2">
				<Avatar className="w-8 h-8 mr-5">
					<AvatarImage src={author.picture} />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>

				<div className="w-full">
					<div className="flex mb-4 justify-between">
						<div className="space-y-1">
							<Link href={`/${author.username}`}>
								<span className="font-bold mr-2 cursor-pointer">
									{author.name}
								</span>

								<span className="text-muted-foreground text-sm cursor-pointer">
									@{author.username}
								</span>
							</Link>

							<div>{text}</div>
						</div>
						<div className=" flex mr-2">
							<span className="text-muted-foreground">{postedAt}</span>
							<EllipsisVertical />
						</div>
					</div>

					<div className="text-[14px] text-muted-foreground mb-2 flex">
						<span>{likesCount} likes &nbsp;| </span>

						<div
							className="flex justify-between px-2"
							onClick={(e) => e.preventDefault()}
						>
							<Heart
								color={liked ? "red" : "currentColor"}
								fill={liked ? "red" : "transparent"}
								onClick={() => setLiked(!liked)}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Comment;
