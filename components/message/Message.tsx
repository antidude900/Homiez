import Image from "next/image";
import React from "react";

interface MessageProps {
	ownMessage: boolean;
}

export const Message = ({ ownMessage }: MessageProps) => {
	return (
		<>
			{ownMessage ? (
				<div className="flex gap-2 self-end">
					<div className="max-w-[350px] bg-blue-400 p-2 rounded-md text-white text-sm">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed
						adipisci pariatur rerum, esse sapiente perferendis incidunt autem
					</div>
					<Image
						src="/avatar.png"
						alt="Avatar"
						width={28}
						height={28}
						className="rounded-full"
					/>
				</div>
			) : (
				<div className="flex gap-2">
					<Image
						src="/avatar.png"
						alt="Avatar"
						width={28}
						height={28}
						className="rounded-full"
					/>
					<div className="max-w-[350px] bg-gray-400 p-2 rounded-md text-white text-sm">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed
						adipisci pariatur rerum, esse sapiente perferendis incidunt autem
						saepe voluptatibus ipsum assumenda soluta cupiditate sunt aut
						reprehenderit doloribus! Inventore laudantium fugit et, enim
					</div>
				</div>
			)}
		</>
	);
};
