"use client";

import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import { getUserInfo } from "@/lib/actions/user.action";
import { IUser } from "@/database/user.model";
import { useAuth } from "@clerk/nextjs";

interface UserContextProps {
	user: IUser | null;
}

const UserContext = createContext<UserContextProps>({
	user: null,
});

export const useUser = () => useContext(UserContext);

interface Props {
	children: ReactNode;
}

export const UserProvider = ({ children }: Props) => {
	const [user, setUser] = useState<IUser | null>(null);
	const { isSignedIn } = useAuth();

	useEffect(() => {
		if (!isSignedIn) return;

		let loading = true;

		const fetchUser = async () => {
			try {
				let userData: IUser | undefined;

				while (!userData && loading) {
					const res = await getUserInfo();
					userData = res ? JSON.parse(res) : undefined;

					if (!userData) {
						console.log("User not ready yet, retrying...");
						await new Promise((resolve) => setTimeout(resolve, 500)); 
					}
				}

				if (userData && loading) {
					setUser(userData);
				}
			} catch (error) {
				console.error("Error fetching user:", error);
			}
		};

		fetchUser();

		return () => {
			loading = false;
		};
	}, [isSignedIn]);

	return (
		<UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
	);
};
