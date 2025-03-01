import ThemeToogle from "@/components/ThemeToogle";
import { Button } from "@/components/ui/button";

const page = () => {
	return (
		<>

			<div className="absolute right-4 top-0">
				<ThemeToogle />
				<Button>Click me</Button>
				<div className="bg-card">Yo</div>
			</div>
		</>
	);
};

export default page;
