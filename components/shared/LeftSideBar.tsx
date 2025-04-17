import Image from "next/image";
import ProfileCard from "./ProfileCard";
import Link from "next/link";
import { getSuggestedUsers, getUserInfo } from "@/lib/actions/user.action";
import CreatePostForm from "./CreatePostForm";
import SuggestedUsers from "./SuggestedUsers";

const LeftSideBar = async () => {
	const user = await getUserInfo();
	const suggestedUsers = await getSuggestedUsers().then((e) => JSON.parse(e));

	return (
		<div className="p-2 h-screen border-r border-r-border flex flex-col">
			<div className="mb-4 flex justify-end items-center px-2">
				<Link href="/">
					<Image
						src="/icons/twitter.svg"
						alt="logo"
						width={32}
						height={32}
						className="mr-2"
					/>
				</Link>

				<input
					placeholder="Search"
					type="text"
					className="bg-background p-2 rounded-xl flex-1 border border-border outline-none focus:ring-0"
				/>
			</div>
			<div className="px-2 mb-4">
				<ProfileCard user={user} />
			</div>
			<div className="flex justify-center px-4 mb-6">
				<CreatePostForm userId={JSON.stringify(user._id)} />
			</div>

			<div className="mt-auto min-h-0 border-2">
				<SuggestedUsers suggestedUsers={suggestedUsers} />
			</div>
		</div>
	);
};

export default LeftSideBar;
