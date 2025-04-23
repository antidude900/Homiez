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
}: {
	children: React.ReactNode;
	className?: string;
	type: string;
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

	async function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Escape") {
			setIsEditable(false);
			setValue(originalValue);
		} else if (e.key === "Enter") {
			if (inputRef.current && !inputRef.current.validity.valid) {
				// Let the browser show its native validation message
				return;
			}

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
		<div className="relative group inline-block w-fit cursor-pointer">
			{isEditable ? (
				<>
					{overlay_sections.map((section) => {
						return createPortal(
							<div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>,
							document.getElementById(section) as HTMLElement
						);
					})}

					<div className="absolute top-1 right-0 -translate-x-1 -translate-y-1 text-sm font-bold z-30 text-muted-foreground">
						{value.length}
					</div>
					<form
						onSubmit={handleSubmit}
						noValidate={false}
						className="relative z-20 w-fit border"
					>
						<input
							ref={inputRef}
							type="text"
							placeholder=". . . ."
							value={value}
							className={`outline-none bg-background transition-all rounded border border-blue-400 ${className} ring-2 ring-blue-100 px-2 ${
								type === "bio" && "h-[50px] w-full"
							}`}
							size={Math.min(value.length + 2, 37)}
							onChange={(e) => setValue(e.target.value)}
							onBlur={async (e) => {
								await handleValidation(e);
							}}
							onKeyDown={handleKeyDown}
							{...getValidationProps()}
						/>
					</form>
				</>
			) : (
				<>
					<div
						className={`${className} border border-transparent ${
							type === "bio" && "h-[50px]"
						} max-w-fit break-all flex justify-center items-center relative mx-4`}
					>
						{type === "username" && (
							<span className="text-muted-foreground">@</span>
						)}
						{originalValue}

						<Pencil
							onClick={() => {
								setIsEditable(true);
								if (inputRef.current) {
									inputRef.current.focus();
								}
							}}
							className={`absolute right-0 top-0 translate-x-full ${
								type === "bio" ? "translate-y-1/4" : "-translate-y-1/4 -right-1"
							} w-4 h-4 opacity-0 group-hover:opacity-100 cursor-pointer text-gray-500 hover:text-gray-700 transition-opacity`}
						/>
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
