"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
} from "@/components/ui/menubar";
import { themes } from "@/constants/themes";

const ThemeToogle = () => {
	const { setTheme, resolvedTheme } = useTheme();

	return (
		<Menubar className="relative border-none bg-transparent shadow-none">
			<MenubarMenu>
				<MenubarTrigger className="cursor-pointer">
					<Image
						src="/icons/moon.svg"
						width={20}
						height={20}
						alt="moon"
						className="hidden dark:flex dark:invert"
					/>

					<Image
						src="/icons/sun.svg"
						width={20}
						height={20}
						alt="sun"
						className="active-theme dark:hidden dark:invert"
					/>
				</MenubarTrigger>
				<MenubarContent className="absolute -right-12 mt-3 min-w-[120px] rounded border">
					{themes.map((theme) => (
						<MenubarItem
							key={theme.value}
							className={"flex items-center gap-4 px-2.5 py-2"}
							onClick={() => {
								if (
									theme.value === "dark" ||
									(theme.value === "system" &&
										window.matchMedia("(prefers-color-scheme: dark)").matches)
								) {
									setTheme("dark");
									document.documentElement.classList.add("dark");
								} else {
									setTheme("light");
									document.documentElement.classList.remove("dark");
								}
							}}
						>
							<Image
								src={theme.icon}
								alt={theme.value}
								width={20}
								height={20}
								className={`${
									resolvedTheme === theme.value && "active-theme"
								} dark:invert`}
							/>
							<span
								className={`body-semibold ${resolvedTheme !== theme.value}`}
							>
								{theme.label}
							</span>
						</MenubarItem>
					))}
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	);
};

export default ThemeToogle;
