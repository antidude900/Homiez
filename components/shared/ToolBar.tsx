"use client";

import { CircleUserRound, LogOut } from "lucide-react";
import ThemeToogle from "../ThemeToogle";
import { toast } from "react-toastify";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const ToolBar = ({ username }: { username: string }) => {
	const { signOut } = useClerk();
	const router = useRouter();

	const handleProfileClick = () => {
		if (username) {
			router.push(`/${username}`);
		} else {
			toast.error("User is null");
		}
	};

	const handleSignOut = () => {
		router.replace("/sign-in");
		toast.promise(
			signOut({ redirectUrl: "/sign-in" }),
			{
				pending: "Signing Out...",
				success: "Signed Out!",
				error: "Sign Out Failed",
			},
			{ autoClose: 500 }
		);
	};

	return (
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
	);
};

export default ToolBar;
