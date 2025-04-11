"use client";

import {
	followUnfollowUser,
	getSuggestedUsers,
	getUserId,
} from "@/lib/actions/user.action";

import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { SuggestionsMore } from "./SuggestionsMore";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type User = {
	_id: string;
	name: string;
	username: string;
	picture: string;
};

const SuggestedUsers = () => {
	const [users, setUsers] = useState<User[]>([]);
	const pathname = usePathname();

	useEffect(() => {
		const fetchData = async () => {
			const users = await getSuggestedUsers().then((e) => JSON.parse(e));
			setUsers(users);
		};

		fetchData();
	}, []);

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
		<div className="bg-background w-full p-2 rounded-xl h-full border border-border flex flex-col">
			<div className="text-lg font-bold mb-2">Suggested Users</div>

			{/* Scrollable list inside this wrapper */}
			<div className="space-y-4 overflow-y-auto pr-1 mb-2">
				{users.slice(0, 3).map((user: User) => (
					<div key={user.username} className="flex justify-between w-full">
						<div className="flex items-center gap-3">
							<Avatar className="w-10 h-10">
								<AvatarImage src={user.picture} />
								<AvatarFallback className="bg-green-700">
									{user.name[0]}
								</AvatarFallback>
							</Avatar>
							<Link href={`/${user.username}`}>
								<p className="text-sm font-semibold">{user.name}</p>
								<p className="text-xs text-muted-foreground">
									@{user.username}
								</p>
							</Link>
						</div>

						<Button
							className="mr-4 w-[90px]"
							onClick={() => handlefollowUnfollow(user._id)}
						>
							Follow
						</Button>
					</div>
				))}
			</div>
			{users.length > 3 && <SuggestionsMore suggestions={users} />}
		</div>
	);
};

export default SuggestedUsers;
