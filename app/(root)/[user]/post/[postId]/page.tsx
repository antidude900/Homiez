import Comment from "@/components/userProfile/Comment";
import UserPost from "@/components/userProfile/UserPost";

const Page = async ({
	params,
}: {
	params: Promise<{ user: string; postId: string }>;
}) => {
	const { user, postId } = await params;

	return (
		<>
			<div className="mb-4">
				<UserPost
					username={user}
					postTitle="Deepseek vs OpenAi!"
					postImg="/post-1.webp"
					postedAt="1d"
					likesCount={69}
					repliesCount={69}
				/>
			</div>

			<div className="vertical-flex gap-2">
				<Comment
					username="Hari"
					postTitle="Very interesting!"
					postedAt="1d"
					likesCount={69}
				/>{" "}
				<Comment
					username="shyam"
					postTitle="OpenAI will win!"
					postedAt="1d"
					likesCount={69}
				/>{" "}
				<Comment
					username="sita"
					postTitle="Deepseek will win!"
					postedAt="1d"
					likesCount={69}
				/>
			</div>
		</>
	);
};

export default Page;
