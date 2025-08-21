"use client";

import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import io from "socket.io-client";
import { useUser } from "./UserContext";

interface ISocketContext {
	socket: ReturnType<typeof io> | null;
}

const SocketContext = createContext<ISocketContext>({
	socket: null,
});

export const useSocket = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const { user } = useUser();
	const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);

	useEffect(() => {
		if (!user?._id) {
			console.log("No user ID, skipping socket connection");
			return;
		}
		const socket = io({
			query: {
				userId: user?._id,
			},
		});

		setSocket(socket);

		return () => {
			socket.close();
		};
	}, [user?._id]);

	return (
		<SocketContext.Provider value={{ socket }}>
			{children}
		</SocketContext.Provider>
	);
};
