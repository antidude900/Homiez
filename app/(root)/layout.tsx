import LeftSideBar from "@/components/shared/LeftSideBar";
import RightSideBar from "@/components/shared/RightSideBar";

const Layout = ({ children }: { children: React.ReactNode }) => {
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
			<div className="flex-1 p-2 relative" id="main">
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
