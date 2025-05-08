"use client";

import { Fullscreen, Search, X } from "lucide-react";
import { useState } from "react";

const RightSideBarHeader = () => {
	const [showSearch, setShowSearch] = useState(false);
	return (
		<div className="bg-background rounded-xl border border-border relative mb-4 h-[40px] flex items-center justify-between px-4 box-content overflow-hidden">
			{!showSearch && (
				<>
					<div className="font-bold text-lg">Chat</div>
					<div className="flex items-center gap-4">
						<Search
							size={20}
							className="text-muted-foreground cursor-pointer"
							onClick={() => setShowSearch(true)}
						/>
						<Fullscreen size={20} className="text-muted-foreground" />
					</div>
				</>
			)}

			<div
				className={`
            absolute top-0 left-0 w-full h-full px-2 flex items-center justify-between bg-background transition-all duration-300 ease-in-out
            ${
							showSearch
								? "opacity-100 scale-100"
								: "opacity-0 scale-95 pointer-events-none"
						}
        `}
			>
				<form method="GET" action="/search" className="flex w-full relative">
					<span className="absolute inset-y-0 flex items-center text-muted-foreground">
						<Search className="h-4 w-4" />
					</span>
					<input
						placeholder="Search"
						type="text"
						name="query"
						className="bg-background p-2 rounded-xl flex-1 outline-none focus:ring-0 pl-7"
					/>
				</form>
				<X
					size={20}
					className="text-muted-foreground cursor-pointer"
					onClick={() => setShowSearch(false)}
				/>
			</div>
		</div>
	);
};

export default RightSideBarHeader;
