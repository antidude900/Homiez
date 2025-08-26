import ConversationList from "../message/ConversationList";
import ChatSearchHeader from "../shared/ChatSearchHeader";

const RightSideBar = () => {
	return (
		<div className="relative min-h-screen border-l border-l-border pt-2">
			<div className="px-2">
				<ChatSearchHeader />
			</div>
			<ConversationList />
		</div>
	);
};

export default RightSideBar;
