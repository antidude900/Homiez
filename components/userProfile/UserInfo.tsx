import { getUserInfo } from "@/lib/actions/user.action";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Editable from "../shared/Editable";
import { redirect } from "next/navigation";

const userInfo = async () => {
	const user = await getUserInfo();

	if (!user) {
		redirect("/sign-in");
	}

	return (
		<div className="bg-background rounded-xl border border-border relative">
			<div className=" flex w-full p-2">
				<div className="flex-1 relative vertical-flex">
					<Editable className="text-2xl font-bold" type="name">
						{user.name}
					</Editable>

					<Editable className="" type="username">
						{user.username}
					</Editable>

					<div className="font-semibold">
						<Editable className="italic" type="bio">
							{user.bio}
						</Editable>

						<div className="text-[12px] text-muted-foreground mx-4">
							<span className="cursor-pointer">99M followers</span>
							<span> &nbsp;|&nbsp; </span>
							<span className="cursor-pointer">2 following</span>
						</div>
					</div>
				</div>
				<div className=" ml-2 flex justify-center items-centerm">
					<Avatar className="w-32 h-32">
						<AvatarImage src={user.picture} />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</div>
			</div>
			<div className="text-center p-2">Posts</div>
			<hr className="border-t-4 rounded border-[#7BD8B9] dark:border-[#21CB99] w-[100px] absolute right-1/2 translate-x-1/2 bottom-0" />
		</div>
	);
};

export default userInfo;
