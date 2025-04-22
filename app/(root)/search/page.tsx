import SearchUserOrPost from "@/components/shared/SearchUserOrPost";
import UserCard from "@/components/shared/UserCard";
import { getUserSearchResults } from "@/lib/actions/user.action";
import React from "react";


const page = async ({
	searchParams,
}: {
	searchParams: {
		query?: string;
	};
}) => {
	const query = (searchParams.query ?? "").trim() || null;
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

	return (
		<div className="bg-background w-full p-2 rounded-xl h-full border border-border flex flex-col">
			<div className="text-2xl font-bold mb-4">
				Search Results for &quot;{query}&quot;
			</div>
			<SearchUserOrPost userSearchResults={userSearchResults} />

		</div>
	);
};

export default page;
