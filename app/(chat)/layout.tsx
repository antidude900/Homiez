import ChatContainerMini from "@/components/message/ChatContainterMini";
import ConversationList from "@/components/message/ConversationList";
import ChatSearchHeader from "@/components/shared/ChatSearchHeader";
import { getUserId } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
	const userId = await getUserId().then((e) => JSON.parse(e));

	if (userId === null) {
		redirect("/sign-in");
	}

	return (
		<div className="flex h-screen">
			<div className="w-full md:max-w-[33%] flex-none sticky top-0 h-screen border-r border-border overflow-y-auto">
				<div className="pt-4 px-2">
					<ChatSearchHeader />
				</div>

				<ConversationList />
			</div>

			<div className="flex-1 relative min-w-0 hidden md:block" id="main">
				{children}
			</div>

			<ChatContainerMini />
		</div>
	);
};

export default Layout;
