"use server";

import Reply from "@/database/reply.model";
import { connectToDatabase } from "../mongoose";
import { CreateReplyParams, LikeUnlikeReply } from "./shared.type";

export async function createReply(params: CreateReplyParams) {
	try {
		await connectToDatabase();
		await Reply.create(params);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function likeUnlikeReply(params: LikeUnlikeReply) {
	try {
		await connectToDatabase();
		const reply = await Reply.findById(params.replyId);
		if (reply.likes.includes(params.userId)) {
			await Reply.updateOne(
				{ _id: params.replyId },
				{ $pull: { likes: params.userId } }
			);
		} else {
			await Reply.updateOne(
				{ _id: params.replyId },
				{ $push: { likes: params.userId } }
			);
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function deletePost(params: { replyId: string }) {
	try {
		await connectToDatabase();
		await Reply.deleteOne({ _id: params.replyId });
	} catch (error) {
		console.log(error);
		throw error;
	}
}
