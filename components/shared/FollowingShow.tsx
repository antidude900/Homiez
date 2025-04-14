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

type User = {
	_id: string;
	name: string;
	username: string;
	picture: string;
	followed: boolean;
};

export function FollowingShow({
	children,
	followings,
	userId,
}: {
	children: React.ReactNode;
	followings: User[];
	userId: string;
}) {
	const pathname = usePathname();

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
				<span className="cursor-pointer">{children}</span>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle className="text-[20px] absolute top-2 left-2 font-bold">
					Followings
				</DialogTitle>
				<div className="mt-10 space-y-2">
					{followings.length === 0 ? (
						<p className="text-sm text-muted-foreground">No Followings yet.</p>
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
									<Link href={`/${following.username}`} className="">
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
										onClick={async () => {
											await handlefollowUnfollow(following._id as string);
										}}
									>
										{following.followed ? "Unfollow" : "Follow"}
									</Button>
								)}
							</div>
						))
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
