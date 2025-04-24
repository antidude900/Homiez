import LeftSideBar from "@/components/LeftSideBar/LeftSideBar";
import RightSideBar from "@/components/RightSideBar/RightSideBar";
import { getUserId } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
	const userId = await getUserId().then((e) => JSON.parse(e));

	if (userId === null) {
		redirect("/sign-in");
	}

	return (
		<div className="flex min-h-screen">
			{/* <div className="fixed inset-0 bg-black bg-opacity-50 z-10"></div> */}
			<div
				className="w-[25%] flex-none sticky top-0 h-screen"
				id="left-sidebar"
			>
				<LeftSideBar />
			</div>

			{/* Main Content - Expands on smaller screens */}
			<div className="flex-1 p-2 px-4 relative" id="main">
				{children}
			</div>

			{/* Right Sidebar - Sticky on larger screens */}
			<div
				className="w-[25%] flex-none sticky top-0 h-screen"
				id="right-sidebar"
			>
				<RightSideBar />
			</div>
		</div>
	);
};

export default Layout;
