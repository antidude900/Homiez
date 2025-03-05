import { ThemeProvider } from "@/context/theme-provider";
import LeftSideBar from "@/components/shared/LeftSideBar";
import RightSideBar from "@/components/shared/RightSideBar";
import "./globals.css";
import ThemeToogle from "@/components/ThemeToogle";
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning>
				<head>
					<title>Social Media App</title>
				</head>
				<body className="bg-[#F3EDE9] dark:bg-[#05141C] text-foreground">
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						disableTransitionOnChange
					>
						<div className="flex min-h-screen">
							<div className="w-1/4 flex-none border">
								<LeftSideBar />
							</div>

							<div className="w-1/2 flex-none	p-2 border">{children}</div>

							<div className="w-1/4 flex-none border">
								<RightSideBar />
							</div>

							<div className="absolute right-4 top-0">
								<ThemeToogle />
							</div>
						</div>
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
