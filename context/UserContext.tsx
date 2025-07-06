"use client";

import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import { getUserInfo } from "@/lib/actions/user.action"; // Adjust the import path if needed
import { IUser } from "@/database/user.model";

interface UserContextProps {
	user: IUser | null;
	loading: boolean;
}

const UserContext = createContext<UserContextProps>({
	user: null,
	loading: true,
});

export const useUser = () => useContext(UserContext);

interface Props {
	children: ReactNode;
}

export const UserProvider = ({ children }: Props) => {
	const [user, setUser] = useState<IUser | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const data = await getUserInfo().then((res) => JSON.parse(res));
				setUser(data);
			} catch (error) {
				console.error("Error fetching user:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	return (
		<UserContext.Provider value={{ user, loading }}>
			{children}
		</UserContext.Provider>
	);
};
