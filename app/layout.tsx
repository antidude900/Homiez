import { ThemeProvider } from "@/context/theme-provider";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "@/context/UserContext";
import { SocketContextProvider } from "@/context/SocketContext";
import { ChatProvider } from "@/context/ChatContext";
import { FollowingProvider } from "@/context/FollowingContext";
import { CallContextProvider } from "@/context/CallContext";
import NextTopLoader from "nextjs-toploader";
import { CallRoom } from "@/components/Call/CallRoom";
import { IncomingCallNotification } from "@/components/Call/IncomingCallNotification";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning={true}>
				<head>
					<title>Homiez</title>
					<link
						rel="icon"
						href="/icons/handshake_square_favicon.png"
						type="image/png"
					/>
				</head>
				<body className="bg-[#E8F1F9] dark:bg-[#05141C] text-foreground">
					<NextTopLoader
						color="#3b82f6"
						height={3}
						showSpinner={false}
						speed={200}
					/>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<TooltipProvider>
							<UserProvider>
								<FollowingProvider>
									<ChatProvider>
										<SocketContextProvider>
											<CallContextProvider>
												{children}

												<CallRoom />
												<IncomingCallNotification />
											</CallContextProvider>
										</SocketContextProvider>
									</ChatProvider>
								</FollowingProvider>
							</UserProvider>
						</TooltipProvider>

						<ToastContainer hideProgressBar position="bottom-right" />
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
