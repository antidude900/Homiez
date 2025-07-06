import LeftSideBar from "@/components/LeftSideBar/LeftSideBar";
import RightSideBar from "@/components/RightSideBar/RightSideBar";
import { FollowingProvider } from "@/context/FollowingContext";
import { UserProvider } from "@/context/UserContext";
import { getUserId } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
	const userId = await getUserId().then((e) => JSON.parse(e));

	if (userId === null) {
		redirect("/sign-in");
	}

	return (
		<FollowingProvider>
			<div className="flex min-h-screen">
				<div
					className="w-[25%] flex-none sticky top-0 h-screen"
					id="left-sidebar"
				>
					<LeftSideBar />
				</div>

				<div className="flex-1 p-2 px-4 relative" id="main">
					<UserProvider>{children}</UserProvider>
				</div>

				<div
					className="w-[25%] flex-none sticky top-0 h-screen"
					id="right-sidebar"
				>
					<RightSideBar />
				</div>
			</div>
		</FollowingProvider>
	);
};

export default Layout;
