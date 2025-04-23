"use client";

import { useState } from "react";
import UserCard from "./UserCard";
import { IUser } from "@/database/user.model";
import UserPost from "../userProfile/UserPost";

interface SearchUserOrPostProps {
	userSearchResults: Array<{
		_id: string;
		username: string;
		name: string;
		picture: string;
		followed: boolean;
	}>;
	postSearchResults: Array<{
		author: Partial<IUser>;
		postId: string;
		_id: string;
		text: string;
		image?: string;
		createdAt: string;
		likes: string[];
		comments: [];
	}>;
	userId: string;
}

const SearchUserOrPost = ({
	userSearchResults,
	postSearchResults,
	userId,
}: SearchUserOrPostProps) => {
	const [active, isActive] = useState("users");
	return (
		<div>
			<div className="bg-background rounded-xl border border-border relative mb-4 flex justify-around items-center">
				<div
					className="text-center p-2 relative cursor-pointer"
					onClick={() => isActive("users")}
				>
					Users
					{active === "users" && (
						<hr className="border-t-4 rounded border-[#7BD8B9] dark:border-[#21CB99] w-[100px] absolute right-1/2 translate-x-1/2 bottom-0" />
					)}
				</div>

				<div
					className="text-center p-2 relative cursor-pointer"
					onClick={() => isActive("posts")}
				>
					Posts
					{active === "posts" && (
						<hr className="border-t-4 rounded border-[#7BD8B9] dark:border-[#21CB99] w-[100px] absolute right-1/2 translate-x-1/2 bottom-0" />
					)}
				</div>
			</div>

			{active === "users" ? (
				<div className="bg-background p-4 rounded-xl space-y-6">
					{userSearchResults.length === 0 ? (
						<div className="text-center">No results found!</div>
					) : (
						userSearchResults.map((user) => (
							<UserCard
								key={user._id}
								id={user._id}
								username={user.username}
								name={user.name}
								picture={user.picture}
								followed={user.followed}
							/>
						))
					)}
				</div>
			) : (
				<div className="space-y-4">
					{postSearchResults.length === 0 ? (
						<div className="text-center">No results found!</div>
					) : (
						postSearchResults.map((post) => (
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
								isSelf={true}
							/>
						))
					)}
				</div>
			)}
		</div>
	);
};

export default SearchUserOrPost;
