"use client";

import {
	followUnfollowUser,
	getSuggestedUsers,
	getUserId,
} from "@/lib/actions/user.action";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SuggestionsMore } from "./SuggestionsMore";
import { useFollowingContext } from "@/context/FollowingContext";
import { Skeleton } from "../ui/skeleton";

interface User {
	_id: string;
	name: string;
	username: string;
	picture: string;
}

const SuggestedUsers = () => {
	const pathname = usePathname();
	const [updating, setUpdating] = useState(false);
	const context = useFollowingContext();
	const [suggestedUsers, setSuggestedUsers] = useState<User[] | null>(null);
	const [history, setHistory] = useState<User[]>([]);

	const handlefollowUnfollow = async (userId: string) => {
		const followingId = await getUserId().then((e) => JSON.parse(e));

		await followUnfollowUser({
			userId: userId,
			followingId: followingId,
			path: pathname,
		});
	};

	useEffect(() => {
		const fetchSuggestedUsers = async () => {
			const [followings, suggestions] = await Promise.all([
				context.refreshFollowers(), // Ensure it returns an empty array if void
				getSuggestedUsers().then((e) => JSON.parse(e)),
			]);

			setSuggestedUsers(suggestions);
			setHistory([...suggestions, ...followings]);
		};

		fetchSuggestedUsers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!suggestedUsers) return;

		const validFollowingIds = context.followings.map(
			(item: { _id: string }) => item._id
		);

		const filteredUsers =
			suggestedUsers?.filter((user) => !validFollowingIds.includes(user._id)) ||
			[]; // Filter out the new followed users

		if (JSON.stringify(filteredUsers) !== JSON.stringify(suggestedUsers)) {
			setSuggestedUsers(filteredUsers);
		} else {
			const unFollowedUser = history.filter(
				(user) =>
					!(
						validFollowingIds.includes(user._id) ||
						suggestedUsers?.includes(user)
					)
			);

			if (unFollowedUser.length === 1) {
				setSuggestedUsers([...(suggestedUsers || []), unFollowedUser[0]]);
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [context.followings]);

	return (
		<div className="bg-background w-full p-2 rounded-xl h-full border border-border flex flex-col">
			<div className="text-lg font-bold mb-2">Suggested Users</div>

			<div className="space-y-4 overflow-y-auto pr-1 mb-2">
				{!suggestedUsers
					? [...Array(3)].map((_, i) => (
							<div className="flex justify-between w-full" key={i}>
								<div className="flex items-center gap-1">
									<Skeleton className="w-10 h-10 rounded-full bg-secondary" />
									<div className="flex flex-col gap-1">
										<Skeleton className="w-24 h-4 rounded bg-secondary" />
										<Skeleton className="w-20 h-3 rounded bg-secondary" />
									</div>
								</div>
								<Skeleton className="w-[90px] h-7 rounded bg-secondary" />
							</div>
					  ))
					: suggestedUsers.slice(0, 3).map((suggestedUser: User) => (
							<div
								key={suggestedUser.username}
								className="flex justify-between w-full"
							>
								<div className="flex items-center gap-3">
									<Avatar className="w-10 h-10">
										<AvatarImage src={suggestedUser?.picture || ""} />
										<AvatarFallback className="bg-green-700">
											{suggestedUser.name[0]}
										</AvatarFallback>
									</Avatar>
									<Link href={`/user/${suggestedUser.username}`}>
										<p className="text-sm font-semibold">
											{suggestedUser.name}
										</p>
										<p className="text-xs text-muted-foreground">
											@{suggestedUser.username}
										</p>
									</Link>
								</div>

								<Button
									className="mr-4 w-[90px]"
									disabled={updating}
									onClick={async () => {
										setUpdating(true);

										await handlefollowUnfollow(suggestedUser._id);
										setSuggestedUsers(
											(prev) =>
												prev?.filter(
													(user) => user._id !== suggestedUser._id
												) || []
										);

										setUpdating(false);

										context.setFollowings([
											...context.followings,
											{
												_id: suggestedUser._id,
												name: suggestedUser.name,
												username: suggestedUser.username,
												picture: suggestedUser.picture,
												followed: true,
											},
										]);
									}}
								>
									Follow
								</Button>
							</div>
					  ))}
			</div>

			{suggestedUsers && suggestedUsers.length > 3 && (
				<SuggestionsMore
					suggestions={suggestedUsers}
					updateUsers={setSuggestedUsers}
				/>
			)}
		</div>
	);
};

export default SuggestedUsers;
