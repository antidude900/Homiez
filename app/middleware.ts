import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware() {
	const response = NextResponse.next();

	response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
	response.headers.set("Pragma", "no-cache");
	response.headers.set("Expires", "0");

	return response;
}

export const config = {
	matcher: "/(auth)/:path*",
};
