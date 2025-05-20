"use server";

import Conversation from "@/database/conversation.model";
import { connectToDatabase } from "../mongoose";
import Message from "@/database/message.model";
import { getUserId } from "./user.action";

export async function sendMessage(receiverId: string, message: string) {
	try {
		await connectToDatabase();
		const senderId = await getUserId().then((e) => JSON.parse(e));

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = new Conversation({
				participants: [senderId, receiverId],
				lastMessage: {
					text: message,
					sender: senderId,
				},
			});
			await conversation.save();
		}

		const newMessage = new Message({
			conversationId: conversation._id,
			sender: senderId,
			text: message,
		});

		await Promise.all([
			newMessage.save(),
			conversation.updateOne({
				lastMessage: {
					text: message,
					sender: senderId,
				},
			}),
		]);
	} catch (error) {
		console.log(error);
		throw error;
	}
}
