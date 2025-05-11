"use client";

import { getFollowing } from "@/lib/actions/user.action";
import { createContext, useContext, useState, ReactNode } from "react";

type User = {
	_id: string;
	name: string;
	username: string;
	picture: string;
	followed: boolean;
};

type FollowingContextType = {
	followings: User[];
	setFollowings: (ids: User[]) => void;
	refreshFollowers: () => Promise<[]>;
};

const FollowingContext = createContext<FollowingContextType | null>(null);

export const useFollowingContext = () => {
	const context = useContext(FollowingContext);
	if (!context) {
		throw new Error("useFollowers must be used within FollowersProvider");
	}
	return context;
};

export const FollowingProvider = ({ children }: { children: ReactNode }) => {
	const [followings, setFollowings] = useState<User[]>([]);

	const refreshFollowers = async () => {
		const result = await getFollowing("self").then((e) => JSON.parse(e));
		setFollowings(result);
		return result;
	};

	return (
		<FollowingContext.Provider
			value={{
				followings,
				setFollowings,
				refreshFollowers,
			}}
		>
			{children}
		</FollowingContext.Provider>
	);
};
