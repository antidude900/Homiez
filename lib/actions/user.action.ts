"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
	CreateUserParams,
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

		const { clerkId, updateData, path } = params;

		await User.findOneAndUpdate({ clerkId }, updateData, { new: true });

		revalidatePath(path);
		return "success";
	} catch (error) {
		console.log(error);
		return "error";
	}
}

// export async function followUnfollowUser(params: FollowUnfollowUserParams) {
// 	try {
// 		await connectToDatabase();

// 		const user = await User.findOne({ clerkId: params.clerkId });

// 		//unfollow
// 		if (user.following.includes(params.followingId)) {
// 			await User.updateOne(
// 				//removing the person from folllowing
// 				{ clerkId: params.clerkId },
// 				{ $pull: { following: params.followingId } }
// 			);

// 			await User.updateOne(
// 				//removing us from the person followers
// 				{ clerkId: params.followingId },
// 				{ $pull: { followers: params.clerkId } }
// 			);
// 		}

// 		//follow
// 		else {
// 			await User.updateOne(
// 				//adding the person to folllowing
// 				{ userId: params.userId },
// 				{ $push: { following: params.followingId } }
// 			);

// 			await User.updateOne(
// 				//adding us to the person followers
// 				{ userId: params.followingId },
// 				{ $push: { followers: params.userId } }
// 			);
// 		}
// 	} catch (error) {
// 		console.log(error);
// 		throw error;
// 	}
// }

export async function getUserByUserName(username: string) {
	try {
		await connectToDatabase();

		const user = await User.findOne({ username });
		return JSON.parse(JSON.stringify(user));
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getClerkId() {
	try {
		await connectToDatabase();

		const { userId: clerkId } = await auth();

		return clerkId;
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
		console.log("Checking uniqueness for:", username);
		await connectToDatabase();

		const user = await User.findOne({ username });
		console.log("uniqueness:", !user);
		return !user;
	} catch (error) {
		console.log(error);
		throw error;
	}
}
