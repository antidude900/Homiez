import ConversationList from "@/components/message/ConversationList";
import { ChatProvider } from "@/context/ChatContext";
import { UserProvider } from "@/context/UserContext";
import { getUserId } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
	const userId = await getUserId().then((e) => JSON.parse(e));

	if (userId === null) {
		redirect("/sign-in");
	}

	return (
		<ChatProvider>
			<div className="flex min-h-screen">
				<div className="w-[25%] flex-none sticky top-0 h-screen">
					<ConversationList />
				</div>

				<div className="flex-1 p-2 px-4 relative" id="main">
					<UserProvider>{children}</UserProvider>
				</div>
			</div>
		</ChatProvider>
	);
};

export default Layout;
