"use client";

import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	followUnfollowUser,
	getLikedUsers,
	getUserId,
} from "@/lib/actions/user.action";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

type User = {
	_id: string;
	name: string;
	username: string;
	picture: string;
	followed: boolean;
};

export function LikeUsersShow({
	children,
	likedUsers,
	fetched,
	setFetched,
	disabled,
}: {
	children: React.ReactNode;
	likedUsers: string[];
	fetched: boolean;
	setFetched: React.Dispatch<React.SetStateAction<boolean>>;
	disabled: boolean;
}) {
	const [users, setUsers] = useState<User[]>([]);
	const [userId, setUserId] = useState<string | null>(null);
	const pathname = usePathname();
	const [updating, setUpdating] = useState(false);

	const fetchData = async () => {
		if (!fetched || !disabled) {
			const users = await getLikedUsers(likedUsers).then((e) => JSON.parse(e));
			const userId = await getUserId().then((e) => JSON.parse(e));
			setUsers(users);
			setUserId(userId);
		}
		if (!disabled) {
			setFetched(true);
		}
	};

	const handlefollowUnfollow = async (userId: string) => {
		const followingId = await getUserId().then((e) => JSON.parse(e));

		await followUnfollowUser({
			userId: userId,
			followingId: followingId,
			path: pathname,
		});

		setUsers((prev) =>
			prev.map((prevUser) =>
				userId === prevUser._id
					? {
							...prevUser,
							followed: !prevUser.followed,
					  }
					: prevUser
			)
		);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<span
					className={`${
						disabled ? "cursor-not-allowed opacity-20" : "cursor-pointer"
					}`}
					onMouseEnter={fetchData}
				>
					{children?.toString()} likes
				</span>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle className="text-[20px] absolute top-2 left-2 font-bold">
					Likes
				</DialogTitle>
				<div className="mt-10 space-y-2">
					{!fetched ? (
						<div>Loading...</div>
					) : users.length === 0 ? (
						<p className="text-sm text-muted-foreground">No likes yet.</p>
					) : (
						users.map((user) => (
							<div key={user.username} className="flex justify-between w-full">
								<div className="flex items-center gap-3">
									<Avatar className="">
										<AvatarImage src={user.picture} />
										<AvatarFallback className="bg-green-700">
											{user.name[0]}
										</AvatarFallback>
									</Avatar>
									<Link href={`/${user.username}`} className="">
										<p className="text-sm font-semibold">{user.name}</p>
										<p className="text-xs text-muted-foreground">
											@{user.username}
										</p>
									</Link>
								</div>
								{userId !== user._id && (
									<Button
										className={`mr-4 w-[90px] ${
											user.followed && "bg-destructive"
										}`}
										disabled={updating}
										onClick={async () => {
											setUpdating(true);
											await handlefollowUnfollow(user._id as string);
											setTimeout(() => {
												setUpdating(false);
											}, 1000);
										}}
									>
										{user.followed ? "Unfollow" : "Follow"}
									</Button>
								)}
							</div>
						))
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
