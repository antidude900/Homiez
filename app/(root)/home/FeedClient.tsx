"use client";

import { useEffect, useState } from "react";
import UserPost from "@/components/UserPost/UserPost";
import { IUser } from "@/database/user.model";
import { getUserId } from "@/lib/actions/user.action";
import { getFeedPost } from "@/lib/actions/post.action";

type Post = {
	author: Partial<IUser>;
	postId: string;
	_id: string;
	text: string;
	image?: string;
	createdAt: string;
	likes: string[];
	comments: [];
};

const FeedClient = () => {
	const [posts, setPosts] = useState<Post[] | null>(null);
	const [userId, setUserId] = useState<string>("");

	useEffect(() => {
		const fetchFeed = async () => {
			try {
				const userId: string = await getUserId().then((e) => JSON.parse(e));
				const posts = await getFeedPost(userId).then((e) => JSON.parse(e));
				setPosts(posts);
				setUserId(userId);
			} catch (error) {
				console.error("Failed to fetch feed:", error);
			}
		};

		fetchFeed();
	}, []);

	if (posts === null) {
		return <div className="text-center">Loading feed...</div>;
	}

	if (posts.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-[80vh] gap-2">
				<div className="font-bold text-[2vw]">
					Your feed is feeling a little lonely right now...
				</div>
				<div className="font-bold text-muted-foreground text-[1.5vw]">
					Follow some interesting people to bring it to life!
				</div>
			</div>
		);
	}

	return (
		<div className="grid gap-4">
			{posts.map((post) => (
				<UserPost
					key={post._id}
					author={post.author}
					postId={post._id}
					postText={post.text}
					postImg={post.image || ""}
					postedAt={post.createdAt}
					likes={post.likes}
					repliesCount={post.comments.length}
					liked={post.likes.includes(userId)}
					isSelf={post.author._id === userId}
				/>
			))}
		</div>
	);
};

export default FeedClient;
