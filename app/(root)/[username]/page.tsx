import UserInfo from "@/components/userProfile/UserInfo";
import UserPost from "@/components/userProfile/UserPost";
import { getAllPost } from "@/lib/actions/post.action";
import {
	getFollowers,
	getFollowing,
	getUserByUserName,
	getUserId,
} from "@/lib/actions/user.action";

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
	const { username } = await params;
	const user = await getUserByUserName(username).then((e) => JSON.parse(e));
	const followers = await getFollowers(user._id).then((e) => JSON.parse(e));
	const followings = await getFollowing(user._id).then((e) => JSON.parse(e));
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
					currentUserId={userId}
					followed={user.followers.includes(userId)}
					followers={followers}
					followings={followings}
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
						comments: [];
					}) => (
						<UserPost
							key={post._id}
							author={user}
							postId={post._id}
							postText={post.text}
							postImg={post?.image || ""}
							postedAt={post.createdAt}
							likes={post.likes}
							repliesCount={post.comments.length}
						/>
					)
				)}
			</div>
		</>
	);
};

export default Page;
