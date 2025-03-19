"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useRef } from "react";

const PopUp = ({
	open,
	type,
	onDiscard,
	onConfirm,
}: {
	open: boolean;
	type: string;
	onDiscard: () => void;
	onConfirm: () => void;
}) => {
	const buttonRef = useRef<HTMLButtonElement>(null);
	return (
		<Dialog open={open}>
			<DialogContent className="[&>button]:hidden border-border">
				<DialogHeader>
					<DialogTitle>
						Are you sure you want to change your {type}?
					</DialogTitle>
					<DialogDescription></DialogDescription>
				</DialogHeader>

				<DialogFooter className="flex justify-between">
					<Button
						onClick={onDiscard}
						className="bg-destructive"
						onMouseEnter={() => {
							if (buttonRef.current) buttonRef.current.blur();
						}}
					>
						Discard changes
					</Button>
					<Button
						autoFocus
						ref={buttonRef}
						onClick={onConfirm}
						className="focus:shadow-[0_8px_8px_var(--accent)]"
						onMouseEnter={() => {
							if (buttonRef.current) buttonRef.current.blur();
						}}
					>
						Save changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default PopUp;
