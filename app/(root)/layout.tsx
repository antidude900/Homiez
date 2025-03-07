import LeftSideBar from "@/components/shared/LeftSideBar";
import RightSideBar from "@/components/shared/RightSideBar";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex min-h-screen">
			<div className="w-1/4 flex-none border sticky top-0 h-screen">
				<LeftSideBar />
			</div>

			{/* Main Content - Expands on smaller screens */}
			<div className="flex-1 p-4 border">{children}</div>

			{/* Right Sidebar - Sticky on larger screens */}
			<div className="w-1/4 flex-none border sticky top-0 h-screen">
				<RightSideBar />
			</div>
		</div>
	);
};

export default Layout;
