"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil } from "lucide-react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import {
	checkUsernameUnique,
	getUserId,
	updateUser,
} from "@/lib/actions/user.action";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import PopUp from "./PopUp";

const Editable = ({
	children,
	className = "",
	type,
	isSelf = true,
}: {
	children: React.ReactNode;
	className?: string;
	type: string;
	isSelf?: boolean;
}) => {
	const originalValue = children?.toString() || "";
	const [isEditable, setIsEditable] = useState(false);
	const [value, setValue] = useState(originalValue);
	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const pathname = usePathname();
	const overlay_sections = ["main", "left-sidebar", "right-sidebar"];
	const router = useRouter();

	useEffect(() => {
		setValue(children?.toString() || "");
	}, [children]);
	// Auto-focus when edit mode is enabled
	useEffect(() => {
		if (isEditable && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isEditable]);

	// Function to remove consecutive spaces by checking from back
	function removeConsecutiveSpaces(str: string): string {
		console.log("Removing consecutive spaces from:", str);
		let result = "";
		for (let i = str.length - 1; i >= 0; i--) {
			// Check if current character is a space and the one below it (next in result) is also a space
			if (str[i] === " " && result.length > 0 && result[0] === " ") {
				// Skip this space (don't add it)
				continue;
			}
			// Add character to the beginning of result
			result = str[i] + result;
		}
		return result;
	}

	async function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Escape") {
			setIsEditable(false);
			setValue(originalValue);
		} else if (e.key === "Enter") {
			if (inputRef.current && !inputRef.current.validity.valid) {
				// Let the browser show its native validation message
				return;
			}
			setValue(value.trim());
			await handleValidation(e);
		}
	}

	async function handleValidation(e: React.FormEvent) {
		e.preventDefault();

		if (value === originalValue) {
			setIsEditable(false);

			return;
		}

		// If username, we need to check uniqueness which can't be done with HTML5 validation
		if (type === "username") {
			const isUnique = await checkUsernameUnique(value);
			if (!isUnique) {
				if (inputRef.current) {
					inputRef.current.setCustomValidity("Username is already taken");
					inputRef.current.reportValidity();
				}
				return;
			}
		}

		// Validate with browser's native validation
		if (inputRef.current && !inputRef.current.validity.valid) {
			inputRef.current.reportValidity();
			return;
		}

		setOpen(true);
	}

	async function handleSubmit() {
		let updateData = {};
		if (type === "name") updateData = { name: value };
		if (type === "username") updateData = { username: value };
		if (type === "bio") updateData = { bio: value };

		const userId = await getUserId().then((e) => JSON.parse(e));

		if (userId) {
			await updateUser({ userId, updateData, path: pathname });
			toast.success("Updated successfully", { autoClose: 750 });
			setIsEditable(false);
			if (type === "username") {
				router.push(`/${value}`);
			}
		} else toast.error("I hate my life");
	}

	function getValidationProps(): object {
		// Clear any previous custom validity message
		if (inputRef.current) {
			inputRef.current.setCustomValidity("");
		}

		// Return the appropriate validation attributes based on the field type
		switch (type) {
			case "name":
				return {
					required: true,
					minLength: 3,
					maxLength: 25,
					pattern: "[a-zA-Z\\s]+",
					title: "Name must contain only alphabetic characters and spaces",
				};
			case "username":
				return {
					required: true,
					minLength: 3,
					maxLength: 15,
					pattern: "[a-zA-Z0-9_]+",
					title:
						"Username must contain only alphanumeric characters and underscores",
				};
			case "bio":
				return {
					maxLength: 60,
					title: "Bio must be less than 60 characters",
				};
			default:
				return {};
		}
	}

	return (
		<div className="relative group w-full cursor-pointer flex justify-center">
			{isEditable && isSelf ? (
				<>
					{overlay_sections.map((section) => {
						return createPortal(
							<div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>,
							document.getElementById(section) as HTMLElement
						);
					})}

					<form
						onSubmit={handleSubmit}
						noValidate={false}
						className="relative z-20 w-fit"
					>
						<input
							ref={inputRef}
							type="text"
							placeholder=". . . ."
							value={value}
							className={`w-[95%] outline-none bg-background transition-all rounded border border-blue-400 ${className} ring-2 ring-blue-100 px-2 ${
								type === "bio" && "h-[50px]"
							}`}
							size={Math.min(value.length + 2, 37)}
							onChange={(e) =>
								setValue(removeConsecutiveSpaces(e.target.value))
							}
							onBlur={async (e) => {
								setValue(value.trim());
								await handleValidation(e);
							}}
							onKeyDown={handleKeyDown}
							{...getValidationProps()}
						/>
						<div className="absolute -top-3 translate-x-full -translate-y-1/4 right-2 text-sm font-bold z-30 text-primary">
							{value.length}
						</div>
					</form>
				</>
			) : (
				<>
					<div
						className={`${className} border border-transparent ${
							type === "bio" && "h-[50px]"
						} max-w-fit break-all flex justify-center items-center relative mx-4`}
						onClick={() => {
							setIsEditable(true);
							if (inputRef.current) {
								inputRef.current.focus();
							}
						}}
						onTouchEnd={() => {
							setIsEditable(true);
							if (inputRef.current) {
								inputRef.current.focus();
							}
						}}
					>
						{type === "username" && (
							<span className="text-muted-foreground">@</span>
						)}
						{originalValue}

						{isSelf && (
							<Pencil
								className={`absolute top-0 translate-x-full ${
									type === "bio"
										? "translate-y-1/4 right-0"
										: "-translate-y-1/4 -right-1"
								} w-4 h-4 opacity-0 group-hover:opacity-100 cursor-pointer text-gray-500 hover:text-gray-700 transition-opacity`}
							/>
						)}
					</div>
				</>
			)}

			<PopUp
				open={open}
				type={type}
				onDiscard={() => {
					setOpen(false);
					setValue(originalValue);
					setIsEditable(false);
				}}
				onConfirm={() => {
					setOpen(false);
					setIsEditable(false);
					handleSubmit();
				}}
			/>
		</div>
	);
};

export default Editable;
