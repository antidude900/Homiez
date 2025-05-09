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
			const result = await getSuggestedUsers().then((e) => JSON.parse(e));
			setSuggestedUsers(result);
		};

		fetchSuggestedUsers();
	}, [context.followingIds]);

	return (
		<div className="bg-background w-full p-2 rounded-xl h-full border border-border flex flex-col">
			<div className="text-lg font-bold mb-2">Suggested Users</div>

			<div className="space-y-4 overflow-y-auto pr-1 mb-2">
				{suggestedUsers === null ? (
					<div>Loading...</div>
				) : (
					suggestedUsers.slice(0, 3).map((suggestedUser: User) => (
						<div
							key={suggestedUser.username}
							className="flex justify-between w-full"
						>
							<div className="flex items-center gap-3">
								<Avatar className="w-10 h-10">
									<AvatarImage src={suggestedUser.picture} />
									<AvatarFallback className="bg-green-700">
										{suggestedUser.name[0]}
									</AvatarFallback>
								</Avatar>
								<Link href={`/user/${suggestedUser.username}`}>
									<p className="text-sm font-semibold">{suggestedUser.name}</p>
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
											prev?.filter((user) => user._id !== suggestedUser._id) ||
											[]
									);

									setUpdating(false);

									context.setFollowingIds([
										...context.followingIds,
										suggestedUser._id as string,
									]);
								}}
							>
								Follow
							</Button>
						</div>
					))
				)}
			</div>

			{suggestedUsers && suggestedUsers.length > 3 && (
				<SuggestionsMore suggestions={suggestedUsers} />
			)}
		</div>
	);
};

export default SuggestedUsers;
