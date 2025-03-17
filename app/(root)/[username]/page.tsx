import UserInfo from "@/components/userProfile/UserInfo";
import UserPost from "@/components/userProfile/UserPost";
import { getAllPost } from "@/lib/actions/post.action";
import { getUserByUserName } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
	const { username } = await params;
	const user = await getUserByUserName(username);
	const result = await getAllPost({ userId: user._id });
	console.log(result);
	console.log(result.posts[0].author);
	if (!user) {
		redirect("/sign-in");
	}

	return (
		<>
			<div className="mb-4">
				<UserInfo />
			</div>
			<div className="grid gap-4">
				{result.posts.map((post) => (
					<UserPost
						key={post._id}
						author={JSON.parse(JSON.stringify(post.author))}
						postText={post.text}
						postImg={post.image}
						postedAt={post.createdAt}
						likesCount={post.likes.length}
						repliesCount={post.replies.length}
					/>
				))}
			</div>
		</>
	);
};

export default Page;
