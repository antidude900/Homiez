import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ToolTipWrapper({
	children,
	description,
	side = "bottom",
}: {
	children: React.ReactNode;
	description: string;
	side?: "bottom" | "top" | "right" | "left" | undefined;
}) {
	return description ? (
		<Tooltip delayDuration={0}>
			<TooltipTrigger asChild>{children}</TooltipTrigger>
			<TooltipContent side={side} className="z-[70]">
				<p>{description}</p>
			</TooltipContent>
		</Tooltip>
	) : (
		children
	);
}
