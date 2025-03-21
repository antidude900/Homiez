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
		if (user.following.includes(params.followingId)) {
			await User.findByIdAndUpdate(
				params.userId,
				{ $pull: { following: params.followingId } },
				{ new: true }
			);

			await User.findByIdAndUpdate(
				params.followingId,
				{ $pull: { followers: params.userId } },
				{ new: true }
			);
		}

		//follow
		else {
			await User.updateOne(
				//adding the person to folllowing
				{ userId: params.userId },
				{ $push: { following: params.followingId } }
			);

			await User.updateOne(
				//adding us to the person followers
				{ userId: params.followingId },
				{ $push: { followers: params.userId } }
			);
		}
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
		const userId = await User.findOne({ clerkId }).select("_id");

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
