import SearchUserOrPost from "@/components/LeftSideBar/SearchUserOrPost";
import { IUser } from "@/database/user.model";
import { getPostsSearchResults } from "@/lib/actions/post.action";
import { getUserId, getUserSearchResults } from "@/lib/actions/user.action";
import React from "react";

const page = async ({
	searchParams,
}: {
	searchParams: Promise<{
		query?: string;
	}>;
}) => {
	const query = ((await searchParams).query ?? "").trim() || null;
	const userId = await getUserId().then((e) => JSON.parse(e));

	if (query === null) {
		return <div>Search for something...</div>;
	}

	const userSearchResults: Array<{
		_id: string;
		username: string;
		name: string;
		picture: string;
		followed: boolean;
	}> = await getUserSearchResults(query).then((e) => JSON.parse(e));

	const postSearchResults: Array<{
		author: Partial<IUser>;
		postId: string;
		_id: string;
		text: string;
		image?: string;
		createdAt: string;
		likes: [];
		comments: [];
	}> = await getPostsSearchResults(query).then((e) => JSON.parse(e));

	return (
		<>
			<div className="text-2xl font-bold mb-7">
				Search Results for &quot;{query}&quot;
			</div>
			<SearchUserOrPost
				userSearchResults={userSearchResults}
				postSearchResults={postSearchResults}
				userId={userId}
			/>
		</>
	);
};

export default page;
