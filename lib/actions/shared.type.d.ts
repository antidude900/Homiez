import { IUser } from "@/database/user.model";
import { Schema } from "mongoose";

export interface CreateUserParams {
	clerkId: string;
	name: string;
	username: string;
	email: string;
	bio: string;
	picture: string;
	following: string[];
}

export interface FollowUnfollowUserParams {
	userId: string;
	followingId: string;
	path: string;
}

export interface UpdateUserParams {
	userId: string;
	updateData: Partial<IUser>;
	path: string;
}

export interface CreatePostParams {
	text: string;
	image: string;
}

export interface LikeUnlikePost {
	postId: Schema.Types.ObjectId;
	userId: Schema.Types.ObjectId;
}

export interface CreateCommentParams {
	text: string;
	author: string;
	postId: string;
}

export interface LikeUnlikeReply {
	CommentId: Schema.Types.ObjectId;
	userId: Schema.Types.ObjectId;
}
