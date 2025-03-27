import Comment from "@/components/userProfile/Comment";
import UserPost from "@/components/userProfile/UserPost";
import { getPost } from "@/lib/actions/post.action";
import { getUserByUserName } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

const Page = async ({
	params,
}: {
	params: Promise<{ username: string; postId: string }>;
}) => {
	const { username, postId } = await params;

	const user = await getUserByUserName(username).then((e) => JSON.parse(e));
	const post = await getPost({ postId }).then((e) => JSON.parse(e));

	if (!user) {
		redirect("/sign-in");
	}

	if (!post) {
		return <div>Post not Found!</div>;
	}

	return (
		<>
			<div className="mb-4">
				<UserPost
					author={user}
					postText={post.text}
					postId={postId}
					postImg={post?.image || ""}
					postedAt={post.createdAt}
					likesCount={post.likes.length}
					repliesCount={post.replies.length}
				/>
			</div>

			<div className="grid gap-2">
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
