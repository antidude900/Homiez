import ConversationList from "@/components/message/ConversationList";
import { SelectedChatProvider } from "@/context/SelectChatContext";
import { getUserId } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
	const userId = await getUserId().then((e) => JSON.parse(e));

	if (userId === null) {
		redirect("/sign-in");
	}

	return (
		<SelectedChatProvider>
			<div className="flex min-h-screen">
				<div className="w-[25%] flex-none sticky top-0 h-screen">
					<ConversationList />
				</div>

				<div className="flex-1 p-2 px-4 relative" id="main">
					{children}
				</div>
			</div>
		</SelectedChatProvider>
	);
};

export default Layout;
