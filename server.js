import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = dev ? "localhost" : "0.0.0.0";
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
console.log("hey");

const OnlineUsersMap = {};

app.prepare().then(() => {
	const httpServer = createServer(handler);
	const io = new Server(httpServer);

	io.on("connection", (socket) => {
		console.log("connected with id:", socket.id);

		const userId = socket.handshake.query.userId;
		if (userId) OnlineUsersMap[userId] = socket.id;

		io.emit("getOnlineUsers", Object.keys(OnlineUsersMap));

		socket.on("sendMessage", ({ newMessage, receiverId, senderId }) => {
			console.log("message received from socket:", newMessage);
			const receiverSocketId = OnlineUsersMap[receiverId];
			if (receiverSocketId) {
				console.log("sending message by:", senderId);
				io.to(receiverSocketId).emit("receiveMessage", {
					newMessage,
					senderId,
				});
			}
		});

		socket.on("messageSeen", ({ conversationId, receiverId }) => {
			console.log("message seen:", conversationId, receiverId);
			const receiverSocketId = OnlineUsersMap[receiverId];
			if (receiverSocketId) {
				io.to(receiverSocketId).emit("messageSeen", conversationId);
			}
		});

		socket.on(
			"newConversation",
			({ conversationCopy: conversation, receiverId }) => {
				console.log("new conversation:", conversation);
				const receiverSocketId = OnlineUsersMap[receiverId];
				if (receiverSocketId) {
					io.to(receiverSocketId).emit("newConversation", conversation);
				}
			}
		);

		socket.on("disconnect", () => {
			console.log("user disconnected");
			delete OnlineUsersMap[userId];
			io.emit("getOnlineUsers", Object.keys(OnlineUsersMap));
		});
	});

	httpServer
		.once("error", (err) => {
			console.error(err);
			process.exit(1);
		})
		.listen(port, () => {
			console.log(`> Ready on http://${hostname}:${port}`);
		});
});
