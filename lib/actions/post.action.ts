"use server";

import Post from "@/database/post.model";
import { connectToDatabase } from "../mongoose";
import { CreatePostParams } from "./shared.type";
import User, { IUser } from "@/database/user.model";
import { v2 as cloudinary } from "cloudinary";
import Comment from "@/database/comment.model";
import { getUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function createPost(params: CreatePostParams) {
	const { text, image } = params;
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});

	let imgUrl = "";

	try {
		if (image) {
			const uploadResponse = await cloudinary.uploader.upload(image, {
				folder: "social_media_images",
			});
			imgUrl = uploadResponse.secure_url;
		}
	} catch (error) {
		console.log("error from cloudinary", error);
		throw error;
	}

	await connectToDatabase();
	const author = await getUserId().then((e) => JSON.parse(e));

	try {
		await Post.create({
			text,
			image: imgUrl,
			author,
		});
	} catch (error) {
		console.log("error from post create", error);
		throw error;
	}
}

export async function getPost(params: { postId: string }) {
	try {
		await connectToDatabase();
		const posts = await Post.findById(params.postId).populate([
			{
				path: "comments",
				select: "text likes createdAt",
				options: { sort: { createdAt: -1 } },
				populate: [{ path: "author", select: "name username picture" }],
			},
		]);

		if (!posts) {
			throw new Error("Post not found");
		}
		return JSON.stringify(posts);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getAllPost({ userId }: { userId: string }) {
	try {
		await connectToDatabase();
		const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });

		return JSON.stringify(posts);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export const deletePost = async (postId: string, pathname: string) => {
	try {
		await connectToDatabase();

		const post = await Post.findById(postId);
		if (!post) throw new Error("Post not found");

		await Comment.deleteMany({ _id: { $in: post.comments } });
		await Post.findByIdAndDelete(postId);
		revalidatePath(pathname);
	} catch (error) {
		console.error("Failed to delete post:", error);
		throw error;
	}
};

export async function likeUnlikePost(postId: string, path: string) {
	try {
		await connectToDatabase();
		const userId = await getUserId().then((e) => JSON.parse(e));

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const updatedPost =
			(await Post.findOneAndUpdate(
				{ _id: postId, likes: userId },
				{ $pull: { likes: userId } },
				{ new: true }
			)) ||
			(await Post.findOneAndUpdate(
				{ _id: postId },
				{ $addToSet: { likes: userId } },
				{ new: true }
			));

		revalidatePath(path);
	} catch (e) {
		console.log(e);
	}
}

export async function getFeedPost(userId: string) {
	try {
		const user: IUser | null = await User.findById(userId);
		if (!user) {
			throw new Error("User not found");
		}

		const following = user.following;
		const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

		const followingPosts = await Post.find({ author: { $in: following } })
			.sort({ createdAt: -1 })
			.populate("author", "name username picture");

		const userRecentPosts = await Post.find({
			author: user._id,
			createdAt: { $gte: oneDayAgo },
		})
			.sort({ createdAt: -1 })
			.populate("author", "name username picture");

		const feedPosts = [...userRecentPosts, ...followingPosts];

		return JSON.stringify(feedPosts);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getPostsSearchResults(query: string) {
	try {
		await connectToDatabase();
		const posts = await Post.find({
			text: { $regex: query, $options: "i" },
		})
			.sort({ createdAt: -1 })
			.populate("author", "name username picture");

		const queryLower = query.toLowerCase();

		const sortedPosts = posts.sort((a, b) => {
			const aIndex = a.text.toLowerCase().indexOf(queryLower);
			const bIndex = b.text.toLowerCase().indexOf(queryLower);

			return aIndex - bIndex;
		});

		return JSON.stringify(sortedPosts);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function updatePost(postId: string, text: string, image: string) {
	try {
		await connectToDatabase();
		const post = await Post.findById(postId);
		let imgUrl = "";

		if (image !== post.image) {
			cloudinary.config({
				cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
				api_key: process.env.CLOUDINARY_API_KEY,
				api_secret: process.env.CLOUDINARY_API_SECRET,
			});

			try {
				if (image) {
					const uploadResponse = await cloudinary.uploader.upload(image, {
						folder: "social_media_images",
					});
					imgUrl = uploadResponse.secure_url;
				}
			} catch (error) {
				console.log("error from cloudinary", error);
				throw error;
			}
		} else {
			imgUrl = image;
		}

		await Post.findByIdAndUpdate(postId, { text, image: imgUrl });
	} catch (error) {
		console.error("Error updating post:", error);
		throw error;
	}
}
