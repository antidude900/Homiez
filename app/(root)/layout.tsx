import LeftSideBar from "@/components/LeftSideBar/LeftSideBar";
import ChatContainerMini from "@/components/message/ChatContainterMini";
import RightSideBar from "@/components/RightSideBar/RightSideBar";
import ToolBar from "@/components/shared/ToolBar";
import { getUserInfo } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
	const user = await getUserInfo().then((res) => JSON.parse(res));

	if (user === null) {
		redirect("/sign-in");
	}

	return (
		<div className="relative flex min-h-screen justify-center">
			<div
				className="w-[25%] flex-none sticky top-0 h-screen hidden xl:block"
				id="left-sidebar"
			>
				<LeftSideBar />
			</div>

			<div className="w-full sm:w-[70%] xl:flex-1 p-2 px-4 relative" id="main">
				{children}
			</div>

			<div
				className="flex-1 xl:flex-none xl:w-[25%] sticky top-0 h-screen hidden lg:block"
				id="right-sidebar"
			>
				<RightSideBar />
			</div>
			<ChatContainerMini workOnDefault={true} />
			<div className="fixed top-2 left-0 xl:hidden">
				<ToolBar username={user.username} />
			</div>
		</div>
	);
};

export default Layout;
