import mongoose from "mongoose";
import Message from "./message.model";

const conversationSchema = new mongoose.Schema(
	{
		participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		lastMessage: {
			text: String,
			sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
			seen: {
				type: Boolean,
				default: false,
			},
		},
	},
	{ timestamps: true }
);

conversationSchema.pre(
	"deleteOne",
	{ document: true, query: false },
	async function () {
		await Message.deleteMany({ conversationId: this._id });
	}
);

conversationSchema.pre("findOneAndDelete", async function () {
	const doc = await this.model.findOne(this.getFilter());
	if (doc) {
		await Message.deleteMany({ conversationId: doc._id });
	}
});

const Conversation =
	mongoose.models.Conversation ||
	mongoose.model("Conversation", conversationSchema);

export default Conversation;
