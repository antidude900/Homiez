import { deletePost } from "@/lib/actions/post.action";
import {
	Menubar,
	MenubarMenu,
	MenubarTrigger,
	MenubarContent,
	MenubarItem,
} from "../ui/menubar";

import { EllipsisVertical, Trash } from "lucide-react";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";
import UpdatePostForm from "./UpdatePostForm";

const EditDeletePost = ({
	postId,
	txt,
	img,
}: {
	postId: string;
	txt: string;
	img: string;
}) => {
	const pathname = usePathname();
	return (
		<Menubar className="relative border-none bg-transparent shadow-none">
			<MenubarMenu>
				<MenubarTrigger className="cursor-pointer">
					<EllipsisVertical />
				</MenubarTrigger>
				<MenubarContent
					className="my-3 min-w-[60px] rounded border space-y-1"
					align="center"
				>
					<MenubarItem
						onSelect={(e) => {
							e.preventDefault();
						}}
					>
						<UpdatePostForm postId={postId} txt={txt} img={img} />
					</MenubarItem>
					<MenubarItem
						className={"flex items-center gap-2"}
						onClick={async () => {
							await deletePost(postId, pathname);
							toast.success("Post deleted successfully", {
								autoClose: 750,
							});
						}}
					>
						<Trash className="w-4 h-4" />
						<span className="body-semibold">Delete</span>
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	);
};

export default EditDeletePost;
