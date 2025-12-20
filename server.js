import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createServer as createHttpServer } from "node:http";
import { createServer as createHttpsServer } from "node:https";
import { readFileSync } from "node:fs";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
console.log("hey");

const OnlineUsersMap = {};

app.prepare().then(async () => {
	let httpServer;

	if (dev) {
		const key = readFileSync("cert.key");
		const cert = readFileSync("cert.crt");
		httpServer = createHttpsServer({ key, cert }, handler);
		console.log("HTTPS enabled for development");
	} else {
		httpServer = createHttpServer(handler);
	}

	const io = new Server(httpServer, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		},
	});

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

		// WebRTC signaling events
		socket.on(
			"call:initiate",
			({ receiverId, callType, callerId, callerName }) => {
				console.log("Call initiated:", { receiverId, callType });
				const receiverSocketId = OnlineUsersMap[receiverId];
				if (receiverSocketId) {
					io.to(receiverSocketId).emit("call:incoming", {
						callerId,
						callerName,
						callType,
					});
				}
			}
		);

		socket.on("call:offer", ({ receiverId, offer }) => {
			console.log("Received offer for:", receiverId);
			const receiverSocketId = OnlineUsersMap[receiverId];
			if (receiverSocketId) {
				io.to(receiverSocketId).emit("call:offer", { offer });
			}
		});

		socket.on("call:answer", ({ receiverId, answer }) => {
			console.log("Received answer for:", receiverId);
			const receiverSocketId = OnlineUsersMap[receiverId];
			if (receiverSocketId) {
				io.to(receiverSocketId).emit("call:answer", { answer });
			}
		});

		socket.on("call:ice-candidate", ({ receiverId, candidate }) => {
			const receiverSocketId = OnlineUsersMap[receiverId];
			if (receiverSocketId) {
				io.to(receiverSocketId).emit("call:ice-candidate", { candidate });
			}
		});

		socket.on("call:reject", ({ receiverId }) => {
			console.log("Call rejected by:", userId);
			const receiverSocketId = OnlineUsersMap[receiverId];
			if (receiverSocketId) {
				io.to(receiverSocketId).emit("call:rejected");
			}
		});

		socket.on("call:end", ({ receiverId }) => {
			console.log("Call ended by:", userId);
			const receiverSocketId = OnlineUsersMap[receiverId];
			if (receiverSocketId) {
				io.to(receiverSocketId).emit("call:ended");
			}
		});

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
		.listen(port, hostname, () => {
			const protocol = dev ? "https" : "http";
			console.log(`> Ready on ${protocol}://${hostname}:${port}`);
			console.log(`> Also accessible via your local IP address`);
		});
});
