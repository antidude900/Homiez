import Post from "@/database/post.model";
import { connectToDatabase } from "../mongoose";
import { CreatePostParams, LikeUnlikePost } from "./shared.type";
import User from "@/database/user.model";

export async function createPost(params: CreatePostParams) {
	try {
		await connectToDatabase();
		await Post.create(params);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getPost(params: { postId: string }) {
	try {
		await connectToDatabase();
		const posts = await Post.findById(params.postId);

		if (!posts) {
			throw new Error("Post not found");
		}
		return posts;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getAllPost(params: { userId: string }) {
	try {
		await connectToDatabase();
		const posts = await Post.find({ author: params.userId }).sort({
			createdAt: -1,
		});
		return posts;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function deletePost(params: { postId: string }) {
	try {
		await connectToDatabase();
		await Post.deleteOne({ _id: params.postId });
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function likeUnlikePost(params: LikeUnlikePost) {
	try {
		await connectToDatabase();
		const post = await Post.findById(params.postId);
		if (post.likes.includes(params.userId)) {
			await Post.updateOne(
				{ _id: params.postId },
				{ $pull: { likes: params.userId } }
			);
		} else {
			await Post.updateOne(
				{ _id: params.postId },
				{ $push: { likes: params.userId } }
			);
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getFeedPost(params: { userId: string }) {
	try {
		const user = await User.findOne({ userId: params.userId });

		const following = user.following;

		const feedPosts = await Post.find({ author: { $in: following } }).sort({
			createdAt: -1,
		});

		return feedPosts;
	} catch (error) {
		console.log(error);
		throw error;
	}
}
