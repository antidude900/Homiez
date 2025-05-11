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

export function FollowingShow({
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
	const [followings, setFollowings] = useState<User[] | null>(null);
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
		const fetchFollowings = async () => {
			if (userId !== otherUserId) {
				const result = await getFollowing(otherUserId).then((e) =>
					JSON.parse(e)
				);
				setFollowings(result);
			}
		};

		fetchFollowings();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (userId === otherUserId) {
			setFollowings(context.followings);
	
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [context.followings]);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<span className="cursor-pointer">{children}</span>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle className="text-[20px] absolute top-2 left-2 font-bold">
					Followings
				</DialogTitle>
				{followings === null || userId === null ? (
					<div>Loading...</div>
				) : (
					<div className="mt-10 space-y-2">
						{followings.length === 0 ? (
							<p className="text-sm text-muted-foreground">
								No Followings yet.
							</p>
						) : (
							followings.map((following) => (
								<div
									key={following.username}
									className="flex justify-between w-full"
								>
									<div className="flex items-center gap-3">
										<Avatar className="">
											<AvatarImage src={following.picture} />
											<AvatarFallback className="bg-green-700">
												{following.name[0]}
											</AvatarFallback>
										</Avatar>
										<Link href={`/user/${following.username}`} className="">
											<p className="text-sm font-semibold">{following.name}</p>
											<p className="text-xs text-muted-foreground">
												@{following.username}
											</p>
										</Link>
									</div>
									{userId !== following._id && (
										<Button
											className={`mr-4 w-[90px] ${
												following.followed && "bg-destructive"
											}`}
											disabled={updating}
											onClick={async () => {
												setUpdating(true);
												await handlefollowUnfollow(following._id as string);
												setUpdating(false);

												const followed = following.followed;
												if (userId === otherUserId) {
													setFollowings(
														(prev) =>
															prev?.filter(
																(user) => user._id !== following._id
															) || []
													);
												} else {
													following.followed = !following.followed;
													setFollowings([...followings]);
												}

												if (followed) {
													context.setFollowings(
														context.followings.filter(
															(f) => f._id !== following._id
														)
													);
												} else {
													context.setFollowings([
														...context.followings,
														following,
													]);
												}
											}}
										>
											{following.followed ? "Unfollow" : "Follow"}
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
