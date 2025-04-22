import SearchUserOrPost from "@/components/shared/SearchUserOrPost";
import { IUser } from "@/database/user.model";
import { getPostsSearchResults } from "@/lib/actions/post.action";
import { getUserSearchResults } from "@/lib/actions/user.action";
import React from "react";

const page = async ({
	searchParams,
}: {
	searchParams: Promise<{
		query?: string;
	}>;
}) => {
	const query = ((await searchParams).query ?? "").trim() || null;

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
		<div className="bg-background w-full p-2 rounded-xl h-full border border-border flex flex-col">
			<div className="text-2xl font-bold mb-4">
				Search Results for &quot;{query}&quot;
			</div>
			<SearchUserOrPost
				userSearchResults={userSearchResults}
				postSearchResults={postSearchResults}
			/>
		</div>
	);
};

export default page;
