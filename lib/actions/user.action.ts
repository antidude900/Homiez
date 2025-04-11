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

		const userId = await getUserId().then((e) => JSON.parse(e));
		const currentUser = await User.findById(userId).select("following");

		const users = await User.find(
			{ _id: { $in: likedUsers } },
			"name username picture"
		);

		const result = users.map((user) => ({
			_id: user._id,
			name: user.name,
			username: user.username,
			picture: user.picture,
			followed: currentUser.following.includes(user._id),
		}));

		return JSON.stringify(result);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getSuggestedUsers() {
	try {
		await connectToDatabase();
		const userId = await getUserId().then((e) => JSON.parse(e));

		const { following: followingList } = await User.findById(
			userId,
			"following"
		);

		const users = await User.find({}, "name username picture followers");

		const sortedUsers = users
			.filter(
				(user) =>
					user._id.toString() !== userId && !followingList.includes(user._id)
			)
			.sort((a, b) => b.followers.length - a.followers.length);

		return JSON.stringify(sortedUsers);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getFollowers(user: string) {
	try {
		await connectToDatabase();

		const userId = await getUserId().then((e) => JSON.parse(e));
		const currentUser = await User.findById(userId).select("following");

		const users = await User.findById(user, "followers").populate([
			{
				path: "followers",
				select: "name username picture",
				options: { sort: { createdAt: 1 } },
			},
		]);

		const result = users.followers.map((user) => ({
			_id: user._id,
			name: user.name,
			username: user.username,
			picture: user.picture,
			followed: currentUser.following.includes(user._id),
		}));

		return JSON.stringify(result);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getFollowing(user: string) {
	try {
		await connectToDatabase();

		const userId = await getUserId().then((e) => JSON.parse(e));
		const currentUser = await User.findById(userId).select("following");

		const users = await User.findById(user, "following").populate([
			{
				path: "following",
				select: "name username picture",
				options: { sort: { createdAt: 1 } },
			},
		]);

		const result = users.following.map((user) => ({
			_id: user._id,
			name: user.name,
			username: user.username,
			picture: user.picture,
			followed: currentUser.following.includes(user._id),
		}));

		return JSON.stringify(result);
	} catch (error) {
		console.log(error);
		throw error;
	}
}
