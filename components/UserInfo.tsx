"use client";

import { IUser } from "@/database/user.model";
import { followUnfollowUser, getUserId } from "@/lib/actions/user.action";
import { usePathname } from "next/navigation";

import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { FollowerShow } from "./shared/FollowerShow";
import { FollowingShow } from "./shared/FollowingShow";

import Editable from "./shared/Editable";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
	TooltipProvider,
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "./ui/tooltip";
import { useFollowingContext } from "@/context/FollowingContext";

const UserInfo = ({
	user,
	currentUserId,
}: {
	user: Partial<IUser>;
	currentUserId: string;
}) => {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const [updating, setUpdating] = useState(false);
	const context = useFollowingContext();
	const [isFollowed, setIsFollowed] = useState(false);

	const handlefollowUnfollow = async (userId: string) => {
		const followingId = await getUserId().then((e) => JSON.parse(e));

		await followUnfollowUser({
			userId: userId,
			followingId: followingId,
			path: pathname,
		});
	};

	useEffect(() => {
		const validFollowingIds = context.followings.map(
			(item: { _id: string }) => item._id
		);
		setIsFollowed(validFollowingIds.includes(user._id as string));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [context.followings]);

	return (
		<div className="bg-background rounded-xl border border-border relative overflow-clip">
			<div className=" flex w-full p-2">
				<div className="flex-1 relative vertical-flex">
					<Editable className="text-2xl font-bold" type="name">
						{user.name}
					</Editable>

					<Editable className="" type="username">
						{user.username}
					</Editable>

					<div className="font-semibold">
						<Editable className="italic" type="bio">
							{user.bio}
						</Editable>

						<div className="text-[12px] text-muted-foreground mx-4">
							{currentUserId !== user._id && (
								<Button
									className={`mr-4 w-[90px] ${isFollowed && "bg-destructive"}`}
									disabled={updating}
									onClick={async () => {
										setUpdating(true);
										await handlefollowUnfollow(user._id as string);
										setUpdating(false);
										const followed = isFollowed;
										setIsFollowed(!isFollowed);

										if (followed) {
											context.setFollowings(
												context.followings.filter((f) => f._id !== user._id)
											);
										} else {
											context.setFollowings([
												...context.followings,
												{
													_id: user._id as string,
													name: user?.name || "",
													username: user?.username || "",
													picture: user?.picture || "",
													followed: true,
												},
											]);
										}
									}}
								>
									{isFollowed ? "Unfollow" : "Follow"}
								</Button>
							)}
							<FollowerShow
								otherUserId={user?._id || ""}
								userId={currentUserId}
							>
								<span className="cursor-pointer">
									{user.followers?.length || "0"} followers
								</span>
							</FollowerShow>

							<span> &nbsp;|&nbsp; </span>
							<FollowingShow
								otherUserId={user?._id || ""}
								userId={currentUserId}
							>
								<span className="cursor-pointer">
									{user.following?.length || "0"} following
								</span>
							</FollowingShow>
						</div>
					</div>
				</div>
				<div className=" ml-2 flex justify-center items-center">
					<Avatar className="w-32 h-32">
						<AvatarImage src={user.picture} />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</div>
			</div>

			<div className="absolute left-0 bottom-0 bg-muted-foreground px-2 rounded-sm">
				<TooltipProvider>
					<Tooltip delayDuration={0} open={isOpen} onOpenChange={setIsOpen}>
						<TooltipTrigger
							onClick={() => setIsOpen(true)}
							className="cursor-default"
							asChild
						>
							<div className="flex items-center gap-1 text-[#f5f5f5]">
								<Pencil className="w-4 h-4" />
								<span>Edit</span>
							</div>
						</TooltipTrigger>
						<TooltipContent
							side="bottom"
							className="max-w-[350px] text-center cursor-default"
						>
							<p>Hover on the specific profile info to toogle an Edit Button</p>
							<p> (Also works in the profile card at the left side)</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			<div className="text-center p-2">Posts</div>
			<hr className="border-t-4 rounded border-[#7BD8B9] dark:border-[#21CB99] w-[100px] absolute right-1/2 translate-x-1/2 bottom-0" />
		</div>
	);
};

export default UserInfo;
