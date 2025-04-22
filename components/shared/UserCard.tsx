"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Button } from "../ui/button";
import { followUnfollowUser, getUserId } from "@/lib/actions/user.action";
import { usePathname } from "next/navigation";

interface UserCardProps {
	id: string;
	username: string;
	name: string;
	picture: string;
	followed: boolean;
}

const UserCard = ({ id, username, name, picture, followed }: UserCardProps) => {
	const pathname = usePathname();
	const handlefollowUnfollow = async (userId: string) => {
		const followingId = await getUserId().then((e) => JSON.parse(e));

		await followUnfollowUser({
			userId: userId,
			followingId: followingId,
			path: pathname,
		});
	};
	return (
		<div key={username} className="flex justify-between w-full">
			<div className="flex items-center gap-3">
				<Avatar className="w-10 h-10">
					<AvatarImage src={picture} />
					<AvatarFallback className="bg-green-700">{name[0]}</AvatarFallback>
				</Avatar>
				<Link href={`/${username}`}>
					<p className="text-sm font-semibold">{name}</p>
					<p className="text-xs text-muted-foreground">@{username}</p>
				</Link>
			</div>

			<Button
				className={`mr-4 w-[90px] ${followed && "bg-destructive"}`}
				onClick={async () => {
					await handlefollowUnfollow(id as string);
				}}
			>
				{followed ? "Unfollow" : "Follow"}
			</Button>
		</div>
	);
};

export default UserCard;
