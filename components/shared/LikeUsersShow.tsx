"use client";

import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogTitle,
} from "@/components/ui/dialog";
import { getLikedUsers } from "@/lib/actions/user.action";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

export function LikeUsersShow({
	children,
	likedUsers,
}: {
	children: React.ReactNode;
	likedUsers: string[];
}) {
	const [users, setUsers] = useState([]);
	const [fetched, setFetched] = useState(false);

	const fetchData = async () => {
		if (!fetched && likedUsers.length > 0) {
			const users = await getLikedUsers(likedUsers).then((e) => JSON.parse(e));
			setUsers(users);
		}
		setFetched(true);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<span className="cursor-pointer" onMouseEnter={fetchData}>
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
						users.map(
							(user: { name: string; username: string; picture: string }) => (
								<div key={user.username} className="flex items-center gap-3">
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
							)
						)
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
