import Comment from "@/components/userProfile/Comment";
import UserPost from "@/components/userProfile/UserPost";
import { IUser } from "@/database/user.model";
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
	console.log(post);
	if (!user) {
		redirect("/sign-in");
	}

	if (!post || post.author !== user._id) {
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
					repliesCount={post.comments.length}
				/>
			</div>

			<div className="grid gap-2">
				{post.comments.map(
					(comment: {
						_id: string;
						author: Partial<IUser>;
						text: string;
						createdAt: string;
						likes: [];
					}) => (
						<Comment
							key={comment._id}
							author={comment.author}
							text={comment.text}
							postedAt={comment.createdAt}
							likesCount={comment.likes.length}
						/>
					)
				)}
			</div>
		</>
	);
};

export default Page;
