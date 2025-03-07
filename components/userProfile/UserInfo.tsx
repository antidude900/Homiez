import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const userInfo = ({ username }: { username: string }) => {
	return (
		<div className="bg-background rounded-xl relative border border-border">
			<div className=" flex w-full p-2">
				<div className="flex-1  p-2 relative">
					<div className="text-2xl font-bold">Sambal Shrestha</div>
					<div className="text-sm">@{username}</div>
					<div className="absolute bottom-2 font-medium">
						<div>The One Most Beloved By Bugs🐞</div>
						<div className="text-[12px] text-muted-foreground">
							99M followers
						</div>
					</div>
				</div>
				<div className=" ml-2 flex justify-center items-center">
					<Avatar className="w-32 h-32">
						<AvatarImage src="/pp.jpg" />
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
