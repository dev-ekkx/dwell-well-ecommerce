// // See https://svelte.dev/docs/kit/types#app.d.ts
// // for information about these interfaces
// declare global {
// 	// Make the Google Maps JS API available to TypeScript as a global.
// 	// We load the script programmatically in components.
// 	const google: any;

// 	namespace App {
// 		// interface Error {}
// 		// interface Locals {}
// 		// interface PageData {}
// 		// interface PageState {}
// 		// interface Platform {}
// 	}
// }

// export {};

// src/app.d.ts

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
