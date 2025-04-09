"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
	CreateUserParams,
	FollowUnfollowUserParams,
	// FollowUnfollowUserParams,
	UpdateUserParams,
} from "./shared.type";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function createUser(params: CreateUserParams) {
	try {
		await connectToDatabase();

		const newUser = await User.create(params);

		return newUser;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function updateUser(params: UpdateUserParams) {
	try {
		await connectToDatabase();

		const { userId, updateData, path } = params;

		await User.findByIdAndUpdate(userId, updateData, { new: true });

		revalidatePath(path);
		return "success";
	} catch (error) {
		console.log(error);
		return "error";
	}
}

export async function followUnfollowUser(params: FollowUnfollowUserParams) {
	try {
		await connectToDatabase();

		const user = await User.findById(params.userId);

		//unfollow
		if (user.followers.includes(params.followingId)) {
			await User.findByIdAndUpdate(
				params.userId,
				{ $pull: { followers: params.followingId } },
				{ new: true }
			);

			await User.findByIdAndUpdate(
				params.followingId,
				{ $pull: { following: params.userId } },
				{ new: true }
			);
		}

		//follow
		else {
			await User.findByIdAndUpdate(params.userId, {
				$push: { followers: params.followingId },
			});

			await User.findByIdAndUpdate(params.followingId, {
				$push: { following: params.userId },
			});
		}

		console.log(updateUser);
		revalidatePath(params.path);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getUserByUserName(username: string) {
	try {
		await connectToDatabase();

		const user = await User.findOne({ username });
		return JSON.stringify(user);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getUserId() {
	try {
		await connectToDatabase();

		const { userId: clerkId } = await auth();
		const { _id: userId } = await User.findOne({ clerkId }).select("_id");

		return JSON.stringify(userId);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getUserInfo() {
	try {
		await connectToDatabase();

		const { userId: clerkId } = await auth();

		const user = await User.findOne({ clerkId });
		return JSON.parse(JSON.stringify(user));
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function checkUsernameUnique(username: string) {
	try {
		await connectToDatabase();

		const user = await User.findOne({ username });

		return !user;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getLikedUsers(likedUsers: string[]) {
	try {
		await connectToDatabase();
		const users = await User.find(
			{ _id: { $in: likedUsers } },
			"name username picture"
		);
		return JSON.stringify(users);
	} catch (error) {
		console.log(error);
		throw error;
	}
}
