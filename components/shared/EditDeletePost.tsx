import { deletePost } from "@/lib/actions/post.action";
import {
	Menubar,
	MenubarMenu,
	MenubarTrigger,
	MenubarContent,
	MenubarItem,
} from "../ui/menubar";

import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";

const EditDeletePost = ({ postId }: { postId: string }) => {
	const pathname = usePathname();
	return (
		<Menubar className="relative border-none bg-transparent shadow-none">
			<MenubarMenu>
				<MenubarTrigger className="cursor-pointer">
					<EllipsisVertical />
				</MenubarTrigger>
				<MenubarContent
					className="mt-3 min-w-[60px] rounded border"
					align="center"
				>
					<MenubarItem className={"flex items-center gap-2 px-2.5 py-2"}>
						<Pencil className="w-4 h-4" />
						<span className="body-semibold">Edit</span>
					</MenubarItem>
					<MenubarItem
						className={"flex items-center gap-2 px-2.5 py-2"}
						onClick={async () => {
							await deletePost(postId,pathname);
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
