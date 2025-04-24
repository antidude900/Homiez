import Comment from "@/components/userProfile/Comment";
import UserPost from "@/components/userProfile/UserPost";
import { IUser } from "@/database/user.model";
import { getPost } from "@/lib/actions/post.action";
import { getUserByUserName, getUserId } from "@/lib/actions/user.action";
import { SearchX } from "lucide-react";
import mongoose from "mongoose";

const Page = async ({
	params,
}: {
	params: Promise<{ username: string; postId: string }>;
}) => {
	const { username, postId } = await params;

	const user = await getUserByUserName(username).then((e) => JSON.parse(e));
	const userId: string = await getUserId().then((e) => JSON.parse(e));

	let post = null;
	if (mongoose.Types.ObjectId.isValid(postId)) {
		post = await getPost({ postId }).then((e) => JSON.parse(e));
	}

	if (!user) {
		return (
			<div className="flex flex-col items-center justify-center h-[90vh] gap-2">
				<SearchX className="w-[5vw] h-[5vw]" />
				<div className="font-bold text-[2vw]">No User Found!</div>
			</div>
		);
	}

	if (!post) {
		return (
			<div className="flex flex-col items-center justify-center h-[90vh] gap-2">
				<SearchX className="w-[5vw] h-[5vw]" />
				<div className="font-bold text-[2vw]">No Post Found!</div>
			</div>
		);
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
					likes={post.likes}
					repliesCount={post.comments.length}
					liked={post.likes.includes(userId)}
					isSelf={user._id === userId}
				/>
			</div>

			<div className="grid gap-2">
				{post.comments.length > 0 ? (
					post.comments.map(
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
					)
				) : (
					<div className="flex flex-col items-center justify-center gap-2">
						<div className="font-bold text-[2vw]">No Comments!</div>
					</div>
				)}
			</div>
		</>
	);
};

export default Page;
