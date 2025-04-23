"use client";

import { followUnfollowUser, getUserId } from "@/lib/actions/user.action";

import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { SuggestionsMore } from "./SuggestionsMore";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
	_id: string;
	name: string;
	username: string;
	picture: string;
}

const SuggestedUsers = ({ suggestedUsers }: { suggestedUsers: User[] }) => {
	const pathname = usePathname();
	const [updating, setUpdating] = useState(false);

	const handlefollowUnfollow = async (userId: string) => {
		const followingId = await getUserId().then((e) => JSON.parse(e));

		await followUnfollowUser({
			userId: userId,
			followingId: followingId,
			path: pathname,
		});
	};

	useEffect(() => {
		setUpdating(false);
	}, []);

	return (
		<div className="bg-background w-full p-2 rounded-xl h-full border border-border flex flex-col">
			<div className="text-lg font-bold mb-2">Suggested Users</div>

			{/* Scrollable list inside this wrapper */}
			<div className="space-y-4 overflow-y-auto pr-1 mb-2">
				{suggestedUsers.slice(0, 3).map((suggestedUser: User) => (
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
							<Link href={`/${suggestedUser.username}`}>
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
								console.log("clicked follow/unfollow button");
								setUpdating(true);

								await handlefollowUnfollow(suggestedUser._id);
								setTimeout(() => {
									setUpdating(false);
								}, 1000);
							}}
						>
							Follow
						</Button>
					</div>
				))}
			</div>
			{suggestedUsers.length > 3 && (
				<SuggestionsMore suggestions={suggestedUsers} />
			)}
		</div>
	);
};

export default SuggestedUsers;
