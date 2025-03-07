import { Schema, models, model, Document } from "mongoose";

export interface IReply extends Document {
	text: string;
	author: Schema.Types.ObjectId;
	postId: Schema.Types.ObjectId;
	likes: Schema.Types.ObjectId[];
	createdAt: Date;
}

const ReplySchema = new Schema({
	text: { type: String, required: true },
	author: { type: Schema.Types.ObjectId, ref: "User", required: true },
	postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
	likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
	createdAt: { type: Date, default: Date.now },
});

const Reply = models.Reply || model("Reply", ReplySchema);

export default Reply;
