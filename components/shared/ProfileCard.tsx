"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ThemeToogle from "../ThemeToogle";
import { CircleUserRound, LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/actions/user.action";

const ProfileCard = () => {
	const { signOut } = useClerk();
	const router = useRouter();

	const handleProfileClick = async () => {
		const user = await getUser();

		if (user) {
			router.push(`/${user.username}`);
		} else {
			toast.error("User is null");
		}
	};

	const handleSignOut = () => {
		toast.promise(signOut({ redirectUrl: "/sign-in" }), {
			pending: "Signing Out...",
			success: "Signed Out!",
			error: "Sign Out Failed",
		});
		router.replace("/sign-in");
	};

	return (
		<div className="h-[300px] bg-background rounded-xl overflow-clip vertical-flex border border-border">
			<div className="h-[30%] bg-white relative mb-[3.5rem]">
				{/* h-24 means 6rem so half is 3rem and giving space of 0.5rem from there */}
				<Image
					src="/cover-pic.jpg"
					alt="cover"
					fill
					className="object-cover object-center"
				/>
				<Avatar className="w-24 h-24 mr-5 absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
					<AvatarImage src="/pp.jpg" />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>

				<div className="absolute right-1 top-0 flex gap-4 bg-secondary py-1 px-2 rounded-xl">
					<ThemeToogle />
					<CircleUserRound
						size={20}
						className="cursor-pointer"
						onClick={handleProfileClick}
					/>

					<LogOut
						size={20}
						onClick={handleSignOut}
						className="cursor cursor-pointer"
					/>
				</div>
			</div>
			<div className="vertical-flex items-center mb-4">
				<div className="font-bold">Sambal Shrestha</div>
				<div className="text-muted-foreground">@sam900</div>
				<div className="italic">The most beloved by Bugs!🐞</div>
			</div>

			<hr className="border-1 border-muted-foreground" />

			<div className="flex-1 flex items-center">
				<div className="flex-1 text-center">
					<div>99M</div>
					<div className="text-muted-foreground font-medium">Followers</div>
				</div>

				<div className="border-l-[1px] border-muted-foreground h-12 mx-4"></div>

				<div className="flex-1 text-center">
					<div>2</div>
					<div className="text-muted-foreground font-medium">Following</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileCard;
