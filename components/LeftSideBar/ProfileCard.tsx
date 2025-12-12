import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getUserId } from "@/lib/actions/user.action";
import Editable from "../shared/Editable";
import { FollowerShow } from "../shared/FollowerShow";
import { FollowingShow } from "../shared/FollowingShow";
import ToolBar from "../shared/ToolBar";

interface User {
	_id: string;
	name: string;
	username: string;
	picture: string;
	bio: string;
	followers: string[];
	following: string[];
}

const ProfileCard = async ({ user }: { user: User }) => {
	const userId = await getUserId().then((e) => JSON.parse(e));

	return (
		<div className="h-[330px] bg-background rounded-xl overflow-clip vertical-flex border border-border">
			<div className="h-[80px] bg-white relative mb-8 flex-shrink-0">
				<Image
					src="/cover-pic.jpg"
					alt="cover"
					fill
					className="object-cover object-center"
				/>
				<Avatar className="w-24 h-24 mr-5 absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
					<AvatarImage src={user.picture} />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
				<div className="absolute right-1 top-0 ">
					<ToolBar username={user.username} />
				</div>
			</div>

			<div className="flex-1 vertical-flex items-center justify-center px-2 mt-1">
				<Editable className="font-bold text-center" type={"name"}>
					{user.name}
				</Editable>

				<Editable
					className="text-muted-foreground text-center mb-2"
					type={"username"}
				>
					{user.username}
				</Editable>

				<Editable className="italic text-center" type={"bio"}>
					{user.bio}
				</Editable>
			</div>

			<hr className="border-1 border-muted-foreground" />

			<div className="flex items-center p-1">
				<div className="flex-1 text-center">
					<FollowerShow otherUserId={user._id} userId={userId}>
						<div>{user.followers.length || "0"}</div>
						<div className="text-muted-foreground font-medium">Followers</div>
					</FollowerShow>
				</div>

				<div className="border-l-[1px] border-muted-foreground h-12 mx-4"></div>

				<div className="flex-1 text-center">
					<FollowingShow otherUserId={user._id} userId={userId}>
						<div>{user.following?.length || "0"}</div>
						<div className="text-muted-foreground font-medium">Following</div>
					</FollowingShow>
				</div>
			</div>
		</div>
	);
};

export default ProfileCard;
