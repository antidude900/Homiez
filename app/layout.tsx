import { ThemeProvider } from "@/context/theme-provider";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "@/context/UserContext";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning>
				<head>
					<title>Homiez</title>
					<link
						rel="icon"
						href="/icons/handshake_square_favicon.png"
						type="image/png"
					/>
				</head>
				<body className="bg-[#E8F1F9] dark:bg-[#05141C] text-foreground">
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						disableTransitionOnChange
					>
						<UserProvider>
							{children}
							<SpeedInsights />
						</UserProvider>

						<ToastContainer hideProgressBar position="bottom-right" />
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
