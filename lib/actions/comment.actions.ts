"use server";

import Comment from "@/database/comment.model";
import { connectToDatabase } from "../mongoose";
import { CreateCommentParams } from "./shared.type";
import Post from "@/database/post.model";
import { getUserId } from "./user.action";
import { revalidatePath } from "next/cache";

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

export async function likeUnlikeReply(commentId: string, pathname: string) {
	const userId = await getUserId().then((e) => JSON.parse(e));
	try {
		await connectToDatabase();
		const comment = await Comment.findById(commentId);
		if (comment.likes.includes(userId)) {
			await Comment.updateOne({ _id: commentId }, { $pull: { likes: userId } });
		} else {
			await Comment.updateOne({ _id: commentId }, { $push: { likes: userId } });
		}
		revalidatePath(pathname);
	} catch (error) {
		console.log(error);
		throw error;
	}
}
