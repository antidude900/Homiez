"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Editable from "../shared/Editable";

import { Button } from "../ui/button";
import { IUser } from "@/database/user.model";
import { followUnfollowUser, getUserId } from "@/lib/actions/user.action";
import { useState } from "react";

const UserInfo = ({
	user,
	isSelf,
	follow,
}: {
	user: Partial<IUser>;
	isSelf: boolean;
	follow: boolean;
}) => {
	const [followed, setFollowed] = useState<boolean>(follow);

	const handlefollowUnfollow = async (userId: string) => {
		const followingId = await getUserId().then((e) => JSON.parse(e));

		await followUnfollowUser({
			userId: userId,
			followingId: followingId,
		});
	};

	return (
		<div className="bg-background rounded-xl border border-border relative">
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
							{!isSelf && (
								<Button
									className="mr-4 w-[90px]"
									onClick={async () => {
										await handlefollowUnfollow(user._id as string);
										setFollowed((prev) => !prev);
									}}
									disabled={followed === null} // Disable button while loading
								>
									{followed === null ? (
										<span className="size-5 animate-spin rounded-full border-2 border-gray-300 border-t-transparent"></span>
									) : followed ? (
										"Unfollow"
									) : (
										"Follow"
									)}
								</Button>
							)}

							<span className="cursor-pointer">
								{user.followers?.length || "0"} followers
							</span>
							<span> &nbsp;|&nbsp; </span>
							<span className="cursor-pointer">
								{user.following?.length || "0"} following
							</span>
						</div>
					</div>
				</div>
				<div className=" ml-2 flex justify-center items-centerm">
					<Avatar className="w-32 h-32">
						<AvatarImage src={user.picture} />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</div>
			</div>
			<div className="text-center p-2">Posts</div>
			<hr className="border-t-4 rounded border-[#7BD8B9] dark:border-[#21CB99] w-[100px] absolute right-1/2 translate-x-1/2 bottom-0" />
		</div>
	);
};

export default UserInfo;
