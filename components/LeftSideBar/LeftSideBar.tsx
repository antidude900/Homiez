import Image from "next/image";
import ProfileCard from "./ProfileCard";
import Link from "next/link";
import { getUserInfo } from "@/lib/actions/user.action";
import CreatePostForm from "./CreatePostForm";
import SuggestedUsers from "./SuggestedUsers";
import { Search } from "lucide-react";

const LeftSideBar = async () => {
	const user = await getUserInfo();

	return (
		<div className="pt-2 pb-4 h-screen border-r border-r-border flex flex-col">
			<div className="mb-4 flex items-center px-2">
				<Link href="/">
					<Image
						src="/icons/handshake_square.png"
						alt="logo"
						width={48}
						height={48}
						className="mr-2"
					/>
				</Link>

				<form method="GET" action="/search" className="flex w-full relative">
					<span className="absolute inset-y-0 flex items-center pl-3 text-muted-foreground">
						<Search className="h-4 w-4" />
					</span>
					<input
						placeholder="Search"
						type="text"
						name="query"
						className="bg-background p-2 rounded-xl flex-1 border border-border outline-none focus:ring-0 pl-10"
					/>
				</form>
			</div>
			<div className="px-2 mb-4">
				<ProfileCard user={user} />
			</div>
			<div className="flex justify-center px-4 mb-6">
				<CreatePostForm />
			</div>

			<div className="mt-auto min-h-0 px-2">
				<SuggestedUsers />
			</div>
		</div>
	);
};

export default LeftSideBar;
