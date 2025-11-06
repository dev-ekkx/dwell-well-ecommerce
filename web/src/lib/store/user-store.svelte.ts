import type { AuthI, UserI, UserStoreI } from "$lib/interfaces";

export const useUserStore = (): UserStoreI => {
	let user = $state<UserI>({
		id: "dfsdfsfdef4342f",
		name: "John Doe",
		email: "john.doe.dwellwell.com",
		image: "https://github.com/shadcn.png"
	});
	let auth = $state<AuthI>({
		isAuthenticated: true,
		token: "abcdef123456",
		tokenExpiry: 3,
		role: "admin"
	});

	function updateUser(data: UserI) {
		user = data;
	}

	function updateUserAuth(data: AuthI) {
		auth = data;
	}

	return { user, auth, updateUser, updateUserAuth };
};
