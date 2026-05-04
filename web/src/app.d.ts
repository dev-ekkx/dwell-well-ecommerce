// Import your user interface (adjust path as needed)
import type { UserAuthI } from "$lib/interfaces";

declare global {
	namespace App {
		interface Locals {
			user: UserAuthI["user"] | null;
			auth: UserAuthI["auth"] | null;
			isAuthenticated: boolean;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
