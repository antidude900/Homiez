"use client";

import {
	CircleUserRound,
	House,
	LogOut,
	Menu,
	MessageCircle,
	Search,
} from "lucide-react";
import ThemeToogle from "../ThemeToogle";
import { toast } from "react-toastify";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CreatePostForm from "../LeftSideBar/CreatePostForm";
import { useEffect, useRef, useState } from "react";

const ToolBar = ({ username }: { username: string }) => {
	const { signOut } = useClerk();
	const router = useRouter();
	const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
	const [showItems, setShowItems] = useState<boolean>(true);
	const inputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (showSearchBar && inputRef.current) {
			inputRef.current.focus();
		}
	}, [showSearchBar]);

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
		<div className="flex flex-col xl:flex-row gap-4 bg-secondary py-1 px-2 rounded-xl">
			<Menu
				className={`xl:hidden ${showItems ? "text-primary" : ""}`}
				size={20}
				onClick={() => setShowItems((prev) => !prev)}
			/>
			{showItems && (
				<>
					<Link href="/" className="xl:hidden">
						<House size={20} />
					</Link>

					<span className="relative xl:hidden">
						<Search
							size={20}
							onClick={() => setShowSearchBar((prev) => !prev)}
						/>

						{showSearchBar && (
							<form
								method="GET"
								action="/search"
								className="flex w-full absolute top-1/2 left-full -translate-y-1/2"
							>
								<input
									ref={inputRef}
									placeholder="Search"
									type="text"
									name="query"
									autoComplete="off"
									onBlur={() => setShowSearchBar(false)}
									onKeyDown={(e) => {
										if (e.key === "Escape") {
											e.preventDefault();
											inputRef.current?.blur();
										}
									}}
									className="bg-background p-2 rounded-xl flex-1 border border-border outline-none focus:ring-0 pl-10"
								/>
							</form>
						)}
					</span>

					<span className="xl:hidden">
						<CreatePostForm />
					</span>

					<Link href="/chat" className="lg:hidden">
						<MessageCircle size={20} />
					</Link>

					<ThemeToogle />

					<Link href={`/user/${username}`}>
						<CircleUserRound
							size={20}
							className="cursor-pointer"
							onClick={handleProfileClick}
						/>
					</Link>

					<LogOut
						size={20}
						onClick={handleSignOut}
						className="cursor cursor-pointer"
					/>
				</>
			)}
		</div>
	);
};

export default ToolBar;
