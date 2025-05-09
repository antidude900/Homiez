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
};

export function SuggestionsMore({ suggestions }: { suggestions: User[] }) {
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
				<div className="text-blue-500 font-bold cursor-pointer">More</div>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle className="text-[20px] absolute top-2 left-2 font-bold">
					Suggestions
				</DialogTitle>
				<div className="mt-10 space-y-4">
					{suggestions.map((user) => (
						<div key={user.username} className="flex justify-between w-full">
							<div className="flex items-center gap-3">
								<Avatar className="">
									<AvatarImage src={user.picture} />
									<AvatarFallback className="bg-green-700">
										{user.name[0]}
									</AvatarFallback>
								</Avatar>
								<Link href={`/user/${user.username}`} className="">
									<p className="text-sm font-semibold">{user.name}</p>
									<p className="text-xs text-muted-foreground">
										@{user.username}
									</p>
								</Link>
							</div>

							<Button
								className="mr-4 w-[90px]"
								onClick={async () => {
									await handlefollowUnfollow(user._id as string);
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
