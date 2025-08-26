import ConversationList from "@/components/message/ConversationList";
import ChatSearchHeader from "@/components/shared/ChatSearchHeader";
import { UserProvider } from "@/context/UserContext";
import { getUserId } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
	const userId = await getUserId().then((e) => JSON.parse(e));

	if (userId === null) {
		redirect("/sign-in");
	}

	return (
		<div className="flex min-h-screen">
			<div className="w-[25%] flex-none sticky top-0 h-screen border-r border-border">
				<div className="pt-4 px-2">
					<ChatSearchHeader fullScreenOption={false} />
				</div>

				<ConversationList />
			</div>

			<div className="flex-1 p-2 px-4 relative" id="main">
				<UserProvider>{children}</UserProvider>
			</div>
		</div>
	);
};

export default Layout;
