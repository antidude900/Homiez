"use client";

import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	followUnfollowUser,
	getFollowing,
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

export function FollowingShow({
	children,
	user,
}: {
	children: React.ReactNode;
	user: string;
}) {
	const [users, setUsers] = useState<User[]>([]);
	const [userId, setUserId] = useState<string | null>(null);
	const [fetched, setFetched] = useState(false);
	const pathname = usePathname();

	const fetchData = async (user: string) => {
		if (!fetched) {
			const users = await getFollowing(user).then((e) => JSON.parse(e));
			const userId = await getUserId().then((e) => JSON.parse(e));
			setUsers(users);
			setUserId(userId);
		}
		setFetched(true);
	};

	const handlefollowUnfollow = async (userId: string) => {
		const followingId = await getUserId().then((e) => JSON.parse(e));

		await followUnfollowUser({
			userId: userId,
			followingId: followingId,
			path: pathname,
		});

		setUsers((prev) => prev.filter((user) => user._id !== userId));
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<span className="cursor-pointer" onMouseEnter={() => fetchData(user)}>
					{children}
				</span>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle className="text-[20px] absolute top-2 left-2 font-bold">
					Followings
				</DialogTitle>
				<div className="mt-10 space-y-2">
					{!fetched ? (
						<div>Loading...</div>
					) : users.length === 0 ? (
						<p className="text-sm text-muted-foreground">No Followings yet.</p>
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
										onClick={async () => {
											await handlefollowUnfollow(user._id as string);
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
