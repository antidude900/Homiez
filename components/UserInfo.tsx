"use client";

import Image from "next/image";
import { IUser } from "@/database/user.model";
import { followUnfollowUser, getUserId } from "@/lib/actions/user.action";
import { usePathname } from "next/navigation";

import { MessageCircleMore, Pencil } from "lucide-react";
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

import { useChat } from "@/context/ChatContext";
import { getConversationId } from "@/lib/actions/message.action";
import { useFollowingContext } from "@/context/FollowingContext";
import { useUser } from "@/context/UserContext";

const UserInfo = ({
	user,
	currentUserId,
}: {
	user: IUser;
	currentUserId: string;
}) => {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const [updating, setUpdating] = useState(false);
	const context = useFollowingContext();
	const [isFollowed, setIsFollowed] = useState(false);
	const { setSelectedConversation } = useChat();
	const { user: currentUser } = useUser();

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
	}, [context.followings, user._id]);

	return (
		<div className="bg-background rounded-xl border border-border relative overflow-clip w-full">
			<div className="h-[140px] w-full relative">
				<Image
					src="/cover-pic.jpg"
					alt="user-cover"
					fill
					className="object-cover object-center"
				/>
			</div>

			<Avatar className="w-32 h-32 absolute left-1/2 top-[140px] -translate-x-1/2 -translate-y-1/2">
				<AvatarImage src={user.picture} />
				<AvatarFallback>CN</AvatarFallback>
			</Avatar>

			<div className="pt-20 px-2 flex flex-col items-center">
				<Editable
					className="text-2xl font-bold text-center"
					type="name"
					isSelf={currentUserId === user._id}
				>
					{user.name}
				</Editable>

				<Editable
					className="text-center text-muted-foreground"
					type="username"
					isSelf={currentUserId === user._id}
				>
					{user.username}
				</Editable>

				<Editable
					className="italic text-center mt-2"
					type="bio"
					isSelf={currentUserId === user._id}
				>
					{user.bio}
				</Editable>

				<div className="font-semibold mb-2 text-[12px] text-muted-foreground mx-4 text-center mt-2">
					{currentUserId !== user._id && (
						<div className="flex items-center justify-center mb-2">
							<Button
								className={`mr-4 w-[90px] ${isFollowed && "bg-destructive"}`}
								disabled={updating}
								onClick={async () => {
									setUpdating(true);

									await handlefollowUnfollow(user._id as string);

									setUpdating(false);

									const prev = isFollowed;
									setIsFollowed(!isFollowed);

									if (prev) {
										context.setFollowings(
											context.followings.filter((f) => f._id !== user._id)
										);
									} else {
										context.setFollowings([
											...context.followings,
											{
												_id: user._id,
												name: user.name || "",
												username: user.username || "",
												picture: user.picture || "",
												followed: true,
											},
										]);
									}
								}}
							>
								{isFollowed ? "Unfollow" : "Follow"}
							</Button>

							<MessageCircleMore
								className={`
									w-6 h-6 
									${
										!currentUser
											? "text-muted-foreground cursor-not-allowed pointer-events-none animate-pulse"
											: "text-primary cursor-pointer"
									}
								`}
								onClick={async () => {
									const id = await getConversationId(user._id);
									setSelectedConversation({
										_id: id || "temp",
										name: user.name,
										userId: user._id,
										username: user.username,
										userProfilePic: user.picture,
									});
								}}
							/>
						</div>
					)}

					<FollowerShow otherUserId={user._id || ""} userId={currentUserId}>
						<span className="cursor-pointer">
							{user.followers?.length || "0"} followers
						</span>
					</FollowerShow>

					<span> &nbsp;|&nbsp; </span>

					<FollowingShow otherUserId={user._id || ""} userId={currentUserId}>
						<span className="cursor-pointer">
							{user.following?.length || "0"} following
						</span>
					</FollowingShow>
				</div>
			</div>

			{currentUserId === user._id && (
				<div className="absolute left-0 bottom-0 bg-muted-foreground px-2 rounded-sm">
					<TooltipProvider>
						<Tooltip delayDuration={0} open={isOpen} onOpenChange={setIsOpen}>
							<TooltipTrigger
								onClick={() => setIsOpen(true)}
								className="cursor-not-allowed"
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
								<p>Click on the specific profile info you want to edit</p>
								<p>(Also works in the profile card on the left side)</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			)}

			<div className="text-center p-2">Posts</div>
			<hr className="border-t-4 rounded border-[#7BD8B9] dark:border-[#21CB99] w-[100px] absolute right-1/2 translate-x-1/2 bottom-0" />
		</div>
	);
};

export default UserInfo;
