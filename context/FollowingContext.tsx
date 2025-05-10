"use client";

import { getFollowing } from "@/lib/actions/user.action";
import {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from "react";

type User = {
	_id: string;
	name: string;
	username: string;
	picture: string;
	followed: boolean;
};

type FollowingContextType = {
	followingIds: User[];
	setFollowingIds: (ids: User[]) => void;
	refreshFollowers: () => Promise<void>;
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
	const [followingIds, setFollowingIds] = useState<User[]>([]);

	const refreshFollowers = async () => {
		const result = await getFollowing("self").then((e) => JSON.parse(e));
		setFollowingIds(result);
	};

	useEffect(() => {
		refreshFollowers();
	}, []);

	return (
		<FollowingContext.Provider
			value={{
				followingIds,
				setFollowingIds,
				refreshFollowers,
			}}
		>
			{children}
		</FollowingContext.Provider>
	);
};
