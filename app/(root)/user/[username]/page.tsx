import UserInfo from "@/components/UserInfo";
import UserPost from "@/components/UserPost/UserPost";
import { getAllPost } from "@/lib/actions/post.action";
import { getUserByUserName, getUserId } from "@/lib/actions/user.action";
import { SearchX } from "lucide-react";

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
	const { username } = await params;
	const user = await getUserByUserName(username).then((e) => JSON.parse(e));

	if (!user) {
		return (
			<div className="flex flex-col items-center justify-center h-screen gap-2">
				<SearchX className="w-[5vw] h-[5vw]" />
				<div className="font-bold text-[2vw]">No Users Found!</div>
			</div>
		);
	}

	const userId = await getUserId().then((e) => JSON.parse(e));

	const posts = await getAllPost({ userId: user._id }).then((e) =>
		JSON.parse(e)
	);

	return (
		<>
			<div className="mb-4">
				<UserInfo user={user} currentUserId={userId} />
			</div>
			<div className="grid gap-4">
				{posts.length > 0 ? (
					posts.map(
						(post: {
							_id: string;
							postId: string;
							text: string;
							image?: string;
							createdAt: string;
							likes: string[];
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
								liked={post.likes.includes(userId)}
								isSelf={user._id === userId}
							/>
						)
					)
				) : (
					<div className="flex flex-col items-center justify-center gap-2">
						<div className="font-bold text-[2vw]">No Posts!</div>
					</div>
				)}
			</div>
		</>
	);
};

export default Page;
