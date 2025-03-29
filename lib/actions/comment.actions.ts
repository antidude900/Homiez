"use server";

import Comment from "@/database/comment.model";
import { connectToDatabase } from "../mongoose";
import { CreateCommentParams } from "./shared.type";
import Post from "@/database/post.model";

export async function createComment(params: CreateCommentParams) {
	try {
		await connectToDatabase();
		const newComment = await Comment.create(params);
		await Post.findByIdAndUpdate(
			params.postId,
			{ $push: { comments: newComment._id } },
			{ new: true }
		);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

// export async function likeUnlikeReply(params: LikeUnlikeReply) {
// 	try {
// 		await connectToDatabase();
// 		const reply = await Reply.findById(params.replyId);
// 		if (reply.likes.includes(params.userId)) {
// 			await Reply.updateOne(
// 				{ _id: params.replyId },
// 				{ $pull: { likes: params.userId } }
// 			);
// 		} else {
// 			await Reply.updateOne(
// 				{ _id: params.replyId },
// 				{ $push: { likes: params.userId } }
// 			);
// 		}
// 	} catch (error) {
// 		console.log(error);
// 		throw error;
// 	}
// }

// export async function deletePost(params: { replyId: string }) {
// 	try {
// 		await connectToDatabase();
// 		await Reply.deleteOne({ _id: params.replyId });
// 	} catch (error) {
// 		console.log(error);
// 		throw error;
// 	}
// }
