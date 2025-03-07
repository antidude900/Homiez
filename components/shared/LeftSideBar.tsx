import Image from "next/image";
import ProfileCard from "./ProfileCard";
import Link from "next/link";

const LeftSideBar = () => {
	return (
		<div className="p-2">
			<div className="mb-6 flex justify-end items-center px-2">
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
			<div className="px-2">
				<ProfileCard />
			</div>
		</div>
	);
};

export default LeftSideBar;
