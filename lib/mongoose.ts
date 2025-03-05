import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
	mongoose.set("strictQuery", true);

	if (!process.env.MONGODB_URL) {
		return console.log("Missing MONGODB URL!");
	}

	if (isConnected) {
		return console.log("MONGODB already connected");
	}

	try {
		await mongoose.connect(process.env.MONGODB_URL, {
			dbName: "BugOverFlow",
		});
		isConnected = true;
		console.log("MONGODB is connected");
	} catch (error) {
		console.log("Error connecting to MONGODB", error);
	}
};
