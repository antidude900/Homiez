import UserInfo from "@/components/userProfile/UserInfo";
import UserPost from "@/components/userProfile/UserPost";

const UserProfile = ({ params }: { params: { user: string } }) => {
	const username = params.user;
	return (
		<>
			<div className="mb-2">
				<UserInfo username={username} />
			</div>
			<div className="vertical-flex gap-2">
				<UserPost
					username={username}
					postTitle="Deepseek vs OpenAi!"
					postImg="/post-1.webp"
					postedAt="1d"
					likesCount={69}
					repliesCount={69}
				/>
				<UserPost
					username={username}
					postTitle="Bird!"
					postImg="/post-2.jpg"
					postedAt="1d"
					likesCount={69}
					repliesCount={69}
				/>
				<UserPost
					username={username}
					postTitle="Logo!"
					postImg="/post-3.png"
					postedAt="1d"
					likesCount={69}
					repliesCount={69}
				/>
				<UserPost
					username={username}
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

export default UserProfile;
