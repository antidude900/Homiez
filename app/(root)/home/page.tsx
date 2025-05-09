import FeedClient from "./FeedClient";

// Static page (no user data yet)
export const revalidate = 60; // Revalidate static shell every 60 seconds


const Page = () => {
	return (
		<>
			<div className="bg-background rounded-xl border border-border relative mb-4 h-[40px] box-content">
				<div className="text-center p-2 font-bold text-lg">For You</div>
				<hr className="border-t-4 rounded border-[#7BD8B9] dark:border-[#21CB99] w-[100px] absolute right-1/2 translate-x-1/2 bottom-0" />
			</div>

			{/* Client-side user feed */}
			<FeedClient />
		</>
	);
};

export default Page;
