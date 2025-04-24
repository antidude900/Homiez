import UserPost from "@/components/userProfile/UserPost";
import { IUser } from "@/database/user.model";
import { getFeedPost } from "@/lib/actions/post.action";
import { getUserId } from "@/lib/actions/user.action";
import { SearchX } from "lucide-react";

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
				{posts.length > 0 ? (
					posts.map(
						(post: {
							author: Partial<IUser>;
							postId: string;
							_id: string;
							text: string;
							image?: string;
							createdAt: string;
							likes: string[];
							comments: [];
						}) => (
							<UserPost
								key={post._id}
								author={post.author}
								postId={post._id}
								postText={post.text}
								postImg={post?.image || ""}
								postedAt={post.createdAt}
								likes={post.likes}
								repliesCount={post.comments.length}
								liked={post.likes.includes(userId)}
								isSelf={post.author._id === userId}
							/>
						)
					)
				) : (
					<div className="flex flex-col items-center justify-center h-[80vh] gap-2">
						<div className="font-bold text-[2vw]">
							Your feed is feeling a little lonely right now.
						</div>
						<div className="font-bold text-muted-foreground text-[1.5vw]">
							Follow some interesting people to bring it to life!
						</div>
					</div>
				)}
			</div>
		</>
	);	
};

export default page;
