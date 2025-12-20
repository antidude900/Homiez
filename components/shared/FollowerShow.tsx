"use client";

import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	followUnfollowUser,
	getFollowers,
	getSelf,
	getUserId,
} from "@/lib/actions/user.action";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useFollowingContext } from "@/context/FollowingContext";

type User = {
	_id: string;
	name: string;
	username: string;
	picture: string;
	followed: boolean;
};

export function FollowerShow({
	children,
	otherUserId,
	userId,
}: {
	children: React.ReactNode;
	otherUserId: string;
	userId: string;
}) {
	const pathname = usePathname();
	const [updating, setUpdating] = useState(false);
	const [followers, setFollowers] = useState<User[] | null>(null);
	const context = useFollowingContext();

	const handlefollowUnfollow = async (userId: string) => {
		const followingId = await getUserId().then((e) => JSON.parse(e));

		await followUnfollowUser({
			userId: userId,
			followingId: followingId,
			path: pathname,
		});
	};

	useEffect(() => {
		const fetchFollowers = async () => {
			const result = await getFollowers(otherUserId).then((e) => JSON.parse(e));
			setFollowers(result);
		};

		fetchFollowers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (followers === null) return;

		if (userId !== otherUserId) {
			const validFollowingIds = context.followings.map(
				(item: { _id: string }) => item._id
			);
			const validFollowerIds =
				followers?.map((item: { _id: string }) => item._id) || [];

			if (
				validFollowerIds.includes(userId) &&
				!validFollowingIds.includes(otherUserId) //we unfollowed the user
			) {
				const filteredFollowings =
					followers?.filter((user) => user._id != userId) || [];
				setFollowers(filteredFollowings);
			} else if (
				!validFollowerIds.includes(userId) &&
				validFollowingIds.includes(otherUserId) //we followed the user
			) {
				const getUser = async () => {
					const result = await getSelf().then((e) => JSON.parse(e));
					setFollowers([...(followers || []), result]);
				};
				getUser();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [context.followings]);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<span className="cursor-pointer">{children}</span>
			</DialogTrigger>
			<DialogContent className="max-w-[95vw] w-full md:max-w-[500px] overflow-hidden">
				<DialogTitle className="text-[20px] absolute top-2 left-2 font-bold">
					Followers
				</DialogTitle>
				{followers === null || userId === null ? (
					<div>Loading...</div>
				) : (
					<div className="mt-10 space-y-4 max-h-[70vh] overflow-y-auto">
						{followers.length === 0 ? (
							<p className="text-sm text-muted-foreground">No Followers yet.</p>
						) : (
							followers.map((follower) => (
								<div
									key={follower.username}
									className="flex justify-between w-full min-w-0"
								>
									<div className="flex items-center gap-3 mr-2 min-w-0">
										<Avatar className="">
											<AvatarImage src={follower.picture} />
											<AvatarFallback className="bg-green-700">
												{follower.name[0]}
											</AvatarFallback>
										</Avatar>
										<Link
											href={`/user/${follower.username}`}
											className="min-w-0"
										>
											<p className="text-sm font-semibold truncate">
												{follower.name}
											</p>
											<p className="text-xs text-muted-foreground truncate">
												@{follower.username}
											</p>
										</Link>
									</div>
									{userId !== follower._id && (
										<Button
											className={`mr-4 w-[90px] ${
												follower.followed && "bg-destructive"
											}`}
											disabled={updating}
											onClick={async () => {
												setUpdating(true);
												await handlefollowUnfollow(follower._id as string);
												setUpdating(false);
												const followed = follower.followed;
												follower.followed = !follower.followed;
												setFollowers([...followers]);

												if (followed) {
													context.setFollowings(
														context.followings.filter(
															(f) => f._id !== follower._id
														)
													);
												} else {
													context.setFollowings([
														...context.followings,
														follower,
													]);
												}
											}}
										>
											{follower.followed ? "Unfollow" : "Follow"}
										</Button>
									)}
								</div>
							))
						)}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
