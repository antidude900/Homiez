import { connectToDatabase } from "../mongoose";
import { CreateUserParams } from "./shared.type";

export async function createUser(userData: CreateUserParams) {
	try {
		await connectToDatabase();

		const newUser = await User.create(userData);

		return newUser;
	} catch (error) {
		console.log(error);
		throw error;
	}
}