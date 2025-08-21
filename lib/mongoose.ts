import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
	mongoose.set("strictQuery", true);

	if (!process.env.MONGODB_URL) {
		return console.log("Missing MONGODB URL!");
	}

	if (isConnected) {
		return;
	}

	try {
		await mongoose.connect(process.env.MONGODB_URL, {
			dbName: "SocialMediaApp",
		});
		isConnected = true;
		console.log("MONGODB is connected");
	} catch (error) {
		isConnected = false;
		console.log("Error connecting to MONGODB", error);
		console.log("Trying again...");
		await connectToDatabase();
	}
};
