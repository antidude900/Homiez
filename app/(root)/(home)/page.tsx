import UserPost from "@/components/userProfile/UserPost";
import { IUser } from "@/database/user.model";
import { getFeedPost } from "@/lib/actions/post.action";
import { getUserId } from "@/lib/actions/user.action";

const page = async () => {
	const userId: string = await getUserId().then((e) => JSON.parse(e));

	const posts = await getFeedPost(userId).then((e) => JSON.parse(e));
	return (
		<>
			<div className="bg-background rounded-xl border border-border relative mb-4">
				<div className="text-center p-2">For You</div>
				<hr className="border-t-4 rounded border-[#7BD8B9] dark:border-[#21CB99] w-[100px] absolute right-1/2 translate-x-1/2 bottom-0" />
			</div>

			<div className="grid gap-4">
				{posts.map(
					(post: {
						author: Partial<IUser>;
						_id: string;
						text: string;
						image?: string;
						createdAt: string;
						likes: [];
						replies: [];
					}) => (
						<UserPost
							key={post._id}
							author={post.author}
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

export default page;
