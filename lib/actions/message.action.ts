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
			console.log("New conversation created:", conversation);
		} else {
			console.log("Existing conversation found:", conversation);
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

		return JSON.stringify(newMessage);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getMessages(otherUserId: string) {
	const senderId = await getUserId().then((e) => JSON.parse(e));

	try {
		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, otherUserId] },
		});
		if (!conversation) {
			return JSON.stringify([]);
		}

		const messages = await Message.find({
			conversationId: conversation._id,
		}).sort({ createdAt: 1 });

		return JSON.stringify(messages);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getConversations() {
	const senderId = await getUserId().then((e) => JSON.parse(e));

	try {
		const conversations = await Conversation.find({
			participants: senderId,
		}).populate({
			path: "participants",
			select: "name username picture",
		});

		conversations.forEach((conversation) => {
			conversation.participants = conversation.participants.filter(
				(participant: { _id: string }) =>
					participant._id.toString() !== senderId.toString()
			);
		});
		return JSON.stringify(conversations);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getConversationId(otherUserId: string) {
	const senderId = await getUserId().then((e) => JSON.parse(e));

	try {
		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, otherUserId] },
		});

		if (!conversation) {
			return null;
		}

		return conversation._id.toString();
	} catch (error) {
		console.log(error);
		throw error;
	}
}
