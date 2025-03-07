import LeftSideBar from "@/components/shared/LeftSideBar";
import RightSideBar from "@/components/shared/RightSideBar";
import ThemeToogle from "@/components/ThemeToogle";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex min-h-screen">
			<div className="w-1/4 flex-none border">
				<LeftSideBar />
			</div>

			<div className="w-1/2 flex-none	p-2 border">{children}</div>

			<div className="w-1/4 flex-none border">
				<RightSideBar />
			</div>

			<div className="absolute right-4 top-0">
				<ThemeToogle />
			</div>
		</div>
	);
};

export default Layout;
