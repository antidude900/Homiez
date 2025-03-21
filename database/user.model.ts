import { Schema, models, model, Document } from "mongoose";

export interface IUser extends Document {
	clerkId: string;
	name: string;
	username: string;
	email: string;
	bio?: string;
	picture: string;
	location?: string;
	joinedAt: Date;
	followers: Schema.Types.ObjectId[];
	following: Schema.Types.ObjectId[];
}

const UserSchema = new Schema({
	clerkId: { type: String, required: true },
	name: { type: String, required: true },
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	bio: { type: String },
	picture: { type: String, required: true },
	location: { type: String },
	followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
	following: [{ type: Schema.Types.ObjectId, ref: "User" }],
	joinedAt: { type: Date, default: Date.now },
});

const User = models.User || model("User", UserSchema);

export default User;
