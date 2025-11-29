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
import type { UserAuthI } from '$lib/interfaces';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			// CRITICAL: Define the structure of your session data
            // It should be your full user object or null/undefined if not authenticated.
			user: UserAuthI["user"] | null; 
            
            // If you store the full session data as well
            session: UserAuthI["auth"] | null; 
            
            // If you track a simple isAuthenticated boolean
            isAuthenticated: boolean;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export { };
