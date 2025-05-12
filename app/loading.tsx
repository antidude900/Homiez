import Image from "next/image";
import React from "react";

export default function Loading() {
	return (
		<div className="flex flex-col items-center justify-center h-[90vh]">
			<Image
				src="/icons/handshake_square.png"
				alt="logo"
				width={200}
				height={200}
			/>
			<p className="text-[50px] font-bold mb-4">Homiez</p>

			<div className="relative w-[250px] h-1 bg-gray-200 overflow-hidden rounded">
				<div className="absolute top-0 left-0 h-full w-full bg-blue-500 animate-loading-bar" />
			</div>
		</div>
	);
}
