"use client";

import { getFollowersAndFollowingIds } from "@/lib/actions/user.action";
import {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from "react";

type FollowingContextType = {
	followingIds: string[];
	setFollowingIds: (ids: string[]) => void;
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
	const [followingIds, setFollowingIds] = useState<string[]>([]);

	const refreshFollowers = async () => {
		const { following } = await getFollowersAndFollowingIds().then((e) =>
			JSON.parse(e)
		);

		setFollowingIds(following);
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
