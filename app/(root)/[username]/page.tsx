import UserInfo from "@/components/userProfile/UserInfo";
import UserPost from "@/components/userProfile/UserPost";
import { getAllPost } from "@/lib/actions/post.action";
import { getUserByUserName, getUserId } from "@/lib/actions/user.action";

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
	const { username } = await params;
	const user = await getUserByUserName(username).then((e) => JSON.parse(e));
	const userId = await getUserId().then((e) => JSON.parse(e));

	if (!user) {
		<div>Loading...</div>;
	}

	const posts = await getAllPost({ userId: user._id }).then((e) =>
		JSON.parse(e)
	);

	return (
		<>
			<div className="mb-4">
				<UserInfo
					user={user}
					isSelf={userId === user._id}
					follow={user.followers.includes(userId)}
				/>
			</div>
			<div className="grid gap-4">
				{posts.map(
					(post: {
						_id: string;
						postId: string;
						text: string;
						image?: string;
						createdAt: string;
						likes: [];
						replies: [];
					}) => (
						<UserPost
							key={post._id}
							author={user}
							postId={post._id}
							postText={post.text}
							postImg={post?.image || ""}
							postedAt={post.createdAt}
							likesCount={post.likes.length}
							repliesCount={post.replies.length}
						/>
					)
				)}
			</div>
		</>
	);
};

export default Page;
