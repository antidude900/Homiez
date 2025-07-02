"use client";

import Image from "next/image";
import { Message } from "./Message";

export const ChatContainer = () => {
	const showSkeleton = false; // Replace with actual loading state

	return (
		<div className="flex flex-col bg-gray-200 dark:bg-gray-800 rounded-md p-2 h-[95vh]">
			<div className="flex items-center gap-2 w-full h-[10%] p-2">
				<Image
					src="/avatar.png"
					alt="Avatar"
					width={32}
					height={32}
					className="rounded-full"
				/>
				<div className="flex items-center text-black dark:text-white">XYZ</div>
			</div>

			<hr className="border-t border-gray-300 dark:border-gray-700" />

			<div className="flex flex-col gap-4 p-4 h-[80%] overflow-y-auto">
				{showSkeleton && (
					<>
						{[...Array(5)].map((_, i) => (
							<div
								key={i}
								className={`flex items-center gap-2 p-1 rounded-md self-${
									i % 2 === 0 ? "start" : "end"
								}`}
							>
								{i % 2 === 0 && (
									<div className="w-7 h-7 rounded-full bg-gray-300 animate-pulse" />
								)}
								<div className="flex flex-col gap-2">
									<div className="w-[250px] h-2 bg-gray-300 animate-pulse rounded" />
									<div className="w-[250px] h-2 bg-gray-300 animate-pulse rounded" />
									<div className="w-[250px] h-2 bg-gray-300 animate-pulse rounded" />
								</div>
								{i % 2 !== 0 && (
									<div className="w-7 h-7 rounded-full bg-gray-300 animate-pulse" />
								)}
							</div>
						))}
					</>
				)}

				<Message ownMessage={true} />
				<Message ownMessage={false} />
				<Message ownMessage={true} />
				<Message ownMessage={true} />
				<Message ownMessage={false} />
				<Message ownMessage={false} />
				<Message ownMessage={true} />
			</div>

			<hr className="border-t border-gray-300 dark:border-gray-700" />

			<div className="flex items-center p-2 h-[10%]">
				<div className="flex-1">
					<input
						type="text"
						placeholder="Type a message..."
						className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<button className="ml-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
					Send
				</button>
			</div>
		</div>
	);
};
