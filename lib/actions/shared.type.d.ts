import { IUser } from "@/database/user.model";
import { Schema } from "mongoose";

export interface CreateUserParams {
	userId: string;
	name: string;
	username: string;
	email: string;
	bio:string
	picture: string;
}

export interface FollowUnfollowUserParams {
	userId: string;
	followingId: Schema.Types.ObjectId;
}

export interface UpdateUserParams {
	userId: string;
	updateData: Partial<IUser>;
	path: string;
}

export interface CreatePostParams {
	text: string;
	image: string;
	author: Schema.Types.ObjectId;
}

export interface LikeUnlikePost {
	postId: Schema.Types.ObjectId;
	userId: Schema.Types.ObjectId;
}

export interface CreateReplyParams {
	text: string;
	author: Schema.Types.ObjectId;
	postId: Schema.Types.ObjectId;
}

export interface LikeUnlikeReply {
	replyId: Schema.Types.ObjectId;
	userId: Schema.Types.ObjectId;
}
