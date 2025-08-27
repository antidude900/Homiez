import LeftSideBar from "@/components/LeftSideBar/LeftSideBar";
import ChatContainerMini from "@/components/message/ChatContainterMini";
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
			<div
				className="w-[25%] flex-none sticky top-0 h-screen"
				id="left-sidebar"
			>
				<LeftSideBar />
			</div>

			<div className="flex-1 p-2 px-4 relative" id="main">
				{children}
			</div>

			<div
				className="w-[25%] flex-none sticky top-0 h-screen"
				id="right-sidebar"
			>
				<RightSideBar />
				<ChatContainerMini />
			</div>
		</div>
	);
};

export default Layout;
