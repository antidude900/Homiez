import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const userInfo = ({ username }: { username: string }) => {
	return (
		<div className="bg-background rounded-xl relative border-2 border-border">
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
						<AvatarImage src="https://scontent.fktm21-2.fna.fbcdn.net/v/t39.30808-1/412891167_122161924076008085_2280771312054575541_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=105&ccb=1-7&_nc_sid=e99d92&_nc_ohc=4kX2m-S9ROcQ7kNvgFnoYln&_nc_oc=Adjaf0B1TVjDHSbAjtvvHiRpZLy4YXuRmdzhk7_6NUoGLWc0-Pu77BVw3Vh_xSV_gtp2BgDTBwILkOIeVxrfw82R&_nc_zt=24&_nc_ht=scontent.fktm21-2.fna&_nc_gid=AK9HjGqhY6Bdhvhlr45HMji&oh=00_AYCXBfYgPgvQQUtl7j_CgUy7vsjDLEv3WYfJNYgWiBUqMw&oe=67C912C4" />
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
