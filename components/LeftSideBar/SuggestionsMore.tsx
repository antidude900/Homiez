"use client";

import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogTitle,
} from "@/components/ui/dialog";
import { followUnfollowUser, getUserId } from "@/lib/actions/user.action";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { useFollowingContext } from "@/context/FollowingContext";
import { useState } from "react";

type User = {
	_id: string;
	name: string;
	username: string;
	picture: string;
};

export function SuggestionsMore({
	suggestions,
	updateUsers,
}: {
	suggestions: User[];
	updateUsers: React.Dispatch<React.SetStateAction<User[] | null>>;
}) {
	const pathname = usePathname();
	const [updating, setUpdating] = useState(false);
	const context = useFollowingContext();

	const handlefollowUnfollow = async (userId: string) => {
		const followingId = await getUserId().then((e) => JSON.parse(e));

		await followUnfollowUser({
			userId: userId,
			followingId: followingId,
			path: pathname,
		});
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<div className="text-blue-500 font-bold cursor-pointer">More</div>
			</DialogTrigger>
			<DialogContent className="max-w-[95vw] w-full md:max-w-[500px] overflow-hidden">
				<DialogTitle className="text-[20px] absolute top-2 left-2 font-bold">
					Suggestions
				</DialogTitle>
				<div className="mt-10 space-y-4 max-h-[70vh] overflow-y-auto">
					{suggestions.map((user) => (
						<div
							key={user.username}
							className="flex justify-between w-full min-w-0"
						>
							<div className="flex items-center gap-3 mr-2 min-w-0">
								<Avatar className="">
									<AvatarImage src={user.picture} />
									<AvatarFallback className="bg-green-700">
										{user.name[0]}
									</AvatarFallback>
								</Avatar>
								<Link href={`/user/${user.username}`} className="min-w-0">
									<p className="text-sm font-semibold truncate">{user.name}</p>
									<p className="text-xs text-muted-foreground truncate">
										@{user.username}
									</p>
								</Link>
							</div>

							<Button
								className="mr-4 w-[90px]"
								disabled={updating}
								onClick={async () => {
									setUpdating(true);

									await handlefollowUnfollow(user._id);
									updateUsers(
										(prev) =>
											prev?.filter((past) => past._id !== user._id) || []
									);

									setUpdating(false);

									context.setFollowings([
										...context.followings,
										{
											_id: user._id,
											name: user.name,
											username: user.username,
											picture: user.picture,
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
			</DialogContent>
		</Dialog>
	);
}
