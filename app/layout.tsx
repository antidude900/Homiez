import { ThemeProvider } from "@/context/theme-provider";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";

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
				<body className="bg-[#E8F1F9] dark:bg-[#05141C] text-foreground">
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						disableTransitionOnChange
					>
						{children}

						<ToastContainer hideProgressBar />
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
