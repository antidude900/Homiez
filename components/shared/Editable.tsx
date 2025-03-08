"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil } from "lucide-react";
import { toast } from "react-toastify";
import {
	checkUsernameUnique,
	getUserId,
	updateUser,
} from "@/lib/actions/user.action";
import { usePathname } from "next/navigation";

const Editable = ({
	children,
	className,
	type,
}: {
	children: React.ReactNode;
	className?: string;
	type: string;
}) => {
	const [isEditable, setIsEditable] = useState(false);
	const [value, setValue] = useState(children?.toString() || "");
	const inputRef = useRef<HTMLInputElement>(null);
	const originalValue = children?.toString() || "";
	const pathname = usePathname();

	// Auto-focus when edit mode is enabled
	useEffect(() => {
		if (isEditable && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isEditable]);

	async function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter" || e.key === "Escape") {
			setIsEditable(false);
			await handleUpdate();
		}
	}

	async function handleUpdate() {
		if (!(await validated())) {
			setValue(originalValue);
			return;
		}

		let updateData = {};
		if (type === "name") updateData = { name: value };
		if (type === "username") updateData = { username: value };
		if (type === "bio") updateData = { bio: value };
		else {
			const userId = await getUserId();

			if (userId) {
				await updateUser({ userId, updateData, path: pathname });
				toast.success("Updated successfully", { autoClose: 750 });
			} else toast.error("I hate my life");
		}
	}

	async function validated() {
		if (value === originalValue) return false;

		const toastOptions = { autoClose: 1500 };

		if (type === "name") {
			if (value.length < 3) {
				toast.error("Name must be at least 3 characters long", toastOptions);
				return false;
			}
			if (!/^[a-zA-Z\s]+$/.test(value)) {
				toast.error(
					"Name must contain only alphabetic characters and spaces",
					toastOptions
				);
				return false;
			}
		} else if (type === "username") {
			if (value.length < 3) {
				toast.error(
					"Username must be at least 3 characters long",
					toastOptions
				);
				return false;
			}
			if (!/^[a-zA-Z0-9_]+$/.test(value)) {
				toast.error(
					"Username must contain only alphanumeric characters and underscores",
					toastOptions
				);
				return false;
			}

			try {
				console.log("running uniqueness check!");
				const isUnique = await checkUsernameUnique(value);
				console.log("isUnique:", isUnique);
				if (!isUnique) {
					toast.error("Username is already taken", toastOptions);
					return false;
				}
			} catch (error) {
				console.log(error);
				toast.error("Error checking username uniqueness", toastOptions);
				return false;
			}
		} else if (type === "bio") {
			if (value.length > 100) {
				toast.error("Bio must be less than 100 characters", toastOptions);
				return false;
			}
		}

		return true;
	}

	return (
		<div className="relative group">
			<input
				ref={inputRef}
				type="text"
				placeholder=". . . ."
				value={value}
				readOnly={!isEditable}
				className={`outline-none ${className} bg-transparent text-center transition-all rounded border  
          ${
						isEditable
							? "border-solid border-blue-400 ring-2 ring-blue-100"
							: "border-transparent cursor-pointer"
					}
       }
        `}
				size={Math.max(value?.length || 10, 1) + 2}
				onChange={(e) => setValue(e.target.value)}
				onBlur={async () => {
					setIsEditable(false);
					await handleUpdate();
				}}
				onKeyDown={async (e) => {
					await handleKeyDown(e);
				}}
			/>

			{!isEditable && (
				<Pencil
					onClick={() => setIsEditable(true)}
					className="absolute right-0 bottom-1/2 w-4 h-4 opacity-0 group-hover:opacity-100 cursor-pointer text-gray-500 hover:text-gray-700 transition-opacity"
				/>
			)}
		</div>
	);
};

export default Editable;
