"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Heart } from "lucide-react";
import { IUser } from "@/database/user.model";
import { getTimestamp } from "@/lib/utils";
import { likeUnlikeReply } from "@/lib/actions/comment.actions";
import { usePathname } from "next/navigation";

interface CommentProps {
	id: string;
	author: Partial<IUser>;
	text: string;
	postedAt: string;
	likesCount: number;
	liked: boolean;
}

const Comment = ({
	id,
	author,
	text,
	postedAt,
	likesCount,
	liked,
}: CommentProps) => {
	const pathname = usePathname();
	const [disabled, setDisabled] = useState(false);

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
							<span className="text-muted-foreground">
								{getTimestamp(postedAt) + " ago"}
							</span>
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
								onClick={async () => {
									setDisabled(true);
									await likeUnlikeReply(id, pathname);
									setTimeout(() => {
										setDisabled(false);
									}, 1000);
								}}
								className={`${
									disabled ? "cursor-not-allowed opacity-20" : "cursor-pointer"
								}`}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Comment;
