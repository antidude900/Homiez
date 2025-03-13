"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
	CreateUserParams,
	FollowUnfollowUserParams,
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

		await User.findOneAndUpdate({ userId }, updateData, { new: true });

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

		const user = await User.findOne({ userId: params.userId });

		//unfollow
		if (user.following.includes(params.followingId)) {
			await User.updateOne(
				//removing the person from folllowing
				{ userId: params.userId },
				{ $pull: { following: params.followingId } }
			);

			await User.updateOne(
				//removing us from the person followers
				{ userId: params.followingId },
				{ $pull: { followers: params.userId } }
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
		return JSON.parse(JSON.stringify(user));
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getUserId() {
	try {
		await connectToDatabase();

		const { userId } = await auth();

		return userId;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getUserInfo() {
	try {
		await connectToDatabase();

		const { userId } = await auth();

		const user = await User.findOne({ userId: userId });
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
