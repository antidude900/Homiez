import { ThemeProvider } from "@/context/theme-provider";
import LeftSideBar from "@/components/shared/LeftSideBar";
import RightSideBar from "@/components/shared/RightSideBar";
import "./globals.css";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<html lang="en" suppressHydrationWarning>
				<head>
					<title>Social Media App</title>
				</head>
				<body className="bg-background text-foreground">
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<div className="flex h-screen">
							<div className="w-1/4 border">
								<LeftSideBar />
							</div>

							<div className="w-1/2 border">{children}</div>

							<div className="w-1/4 border">
								<RightSideBar />
							</div>
						</div>
					</ThemeProvider>
				</body>
			</html>
		</>
	);
}
