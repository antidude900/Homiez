import UserInfo from "@/components/userProfile/UserInfo";
import UserPost from "@/components/userProfile/UserPost";
import { getUserByUserName } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
	const { username } = await params;
	const user = await getUserByUserName(username);

	if (!user) {
		redirect("/sign-in");
	}

	return (
		<>
			<div className="mb-2">
				<UserInfo />
			</div>
			<div className="vertical-flex gap-2">
				<UserPost
					user={user}
					postTitle="Deepseek vs OpenAi!"
					postImg="/post-1.webp"
					postedAt="1d"
					likesCount={69}
					repliesCount={69}
				/>
				<UserPost
					user={user}
					postTitle="Bird!"
					postImg="/post-2.jpg"
					postedAt="1d"
					likesCount={69}
					repliesCount={69}
				/>

				<UserPost
					user={user}
					postTitle="Logo!"
					postImg="/post-3.png"
					postedAt="1d"
					likesCount={69}
					repliesCount={69}
				/>
				<UserPost
					user={user}
					postTitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi repellendus aliquid atque incidunt eos enim nam laboriosam maxime perspiciatis dolorum iusto voluptatum praesentium tempore impedit, voluptas voluptates ut similique accusamus!
"
					postedAt="1d"
					likesCount={69}
					repliesCount={69}
				/>
			</div>
		</>
	);
};

export default Page;
