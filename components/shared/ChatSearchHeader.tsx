"use client";

import { useChat } from "@/context/ChatContext";
import { useUser } from "@/context/UserContext";
import { getConversationId } from "@/lib/actions/message.action";
import { getUserSearchResults } from "@/lib/actions/user.action";
import { Fullscreen, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ThemeToogle from "../ThemeToogle";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";

type UserSearchResult = {
	_id: string;
	username: string;
	name: string;
	picture: string;
	followed: boolean;
};

const ChatSearchHeader = ({
	fullScreenOption = true,
}: {
	fullScreenOption?: boolean;
}) => {
	const [showSearch, setShowSearch] = useState(false);
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<UserSearchResult[]>([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const [loading, setLoading] = useState(false);
	const { setSelectedConversation } = useChat();
	const { user: filterUser } = useUser();

	useEffect(() => {
		if (!query.trim()) {
			setResults([]);
			setShowDropdown(false);
			setLoading(false);
			return;
		}

		const searchUsers = async (query: string) => {
			try {
				setLoading(true);
				const userSearchResults: UserSearchResult[] =
					await getUserSearchResults(query).then((e) => JSON.parse(e));

				setResults(userSearchResults);
				setShowDropdown(true);
			} catch (err) {
				console.error(err);
				setResults([]);
				setShowDropdown(false);
			} finally {
				setLoading(false);
			}
		};

		if (query.length <= 1) {
			searchUsers(query);
			return;
		}

		const timeout = setTimeout(() => {
			searchUsers(query);
		}, 100); // debounce delay

		return () => clearTimeout(timeout);
	}, [query]);

	return (
		<div className="relative w-full mb-4">
			<div className="bg-background rounded-xl border border-border h-[45px] flex items-center justify-between px-2 box-content">
				{!showSearch ? (
					!filterUser ? (
						<>
							<div className="flex items-center gap-2">
								<Skeleton className="w-10 h-10 rounded-full bg-secondary" />
								<Skeleton className="w-20 h-4 rounded bg-secondary" />
							</div>

							<div className="flex items-center gap-4">
								<Skeleton className="w-5 h-5 rounded-full bg-secondary" />
								<Skeleton className="w-5 h-5 rounded-full bg-secondary" />
							</div>
						</>
					) : (
						<>
							<div className="flex items-center">
								{!fullScreenOption && (
									<Link href="/">
										<Image
											src="/icons/handshake_square.png"
											alt="logo"
											width={48}
											height={48}
											className="mr-2"
										/>
									</Link>
								)}
								<span className="font-bold text-lg text-center">Chats</span>
							</div>
							<div className="flex items-center gap-4">
								<Search
									size={20}
									className="text-muted-foreground cursor-pointer"
									onClick={() => setShowSearch(true)}
								/>
								{fullScreenOption ? (
									<Link href="/chat">
										<Fullscreen size={20} className="text-muted-foreground" />
									</Link>
								) : (
									<ThemeToogle color="text-muted-foreground" />
								)}
							</div>
						</>
					)
				) : (
					<div className="flex w-full h-full items-center relative">
						<span className="absolute left-2 text-muted-foreground">
							<Search className="h-4 w-4" />
						</span>
						<input
							placeholder="Search"
							type="text"
							className="bg-background w-full h-full p-2 rounded-xl outline-none focus:ring-0 pl-7"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
						<X
							size={20}
							className="text-muted-foreground cursor-pointer ml-2"
							onClick={() => {
								setShowSearch(false);
								setQuery("");
								setResults([]);
								setShowDropdown(false);
							}}
						/>
					</div>
				)}
			</div>

			{showDropdown && filterUser && (
				<div className="absolute top-[48px] left-0 w-full rounded-xl shadow z-50 bg-background border border-border">
					<ul className="max-h-60 overflow-y-auto">
						{loading ? (
							<li className="p-2 text-muted-foreground text-sm">
								Searching...
							</li>
						) : results.length === 0 ? (
							<li className="p-2 text-muted-foreground text-sm">
								No users found.
							</li>
						) : (
							results.map((user: UserSearchResult) =>
								user._id === filterUser._id ? null : (
									<li
										key={user._id}
										className="p-2 cursor-pointer border-b last:border-b-0 border-border overflow-hidden"
										onClick={async () => {
											const id = await getConversationId(user._id);
											setSelectedConversation({
												_id: id || "temp",
												name: user.name,
												userId: user._id,
												username: user.username,
												userProfilePic: user.picture,
											});

											setShowDropdown(false);
										}}
									>
										<div className="flex items-center gap-1">
											<Avatar>
												<AvatarImage src={user.picture} />
												<AvatarFallback>{user.name[0]}</AvatarFallback>
											</Avatar>
											<div>
												<p className="text-center">{user.name}</p>
												<p className="text-muted-foreground text-sm -mt-1">
													@{user.username}
												</p>
											</div>
										</div>
									</li>
								)
							)
						)}
					</ul>
				</div>
			)}
		</div>
	);
};

export default ChatSearchHeader;
