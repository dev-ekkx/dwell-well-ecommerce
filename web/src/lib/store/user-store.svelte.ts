import type { UserAuthI } from "$lib/interfaces";

export const initialState = {
	user: {
		email: "",
		image: "",
		name: "",
		userId: "",
		role: "customer",
		phone: ""
	},
	auth: {
		tokenExpiry: 0,
		accessToken: "",
		idToken: ""
	}
} as UserAuthI;

class UserStore {
	private authenticated = $state(false);
	public isAuthenticated = $derived(this.authenticated);
	private store = $state<UserAuthI>(initialState);
	public userData = $derived(this.store.user);
	public authData = $derived(this.store.auth);

	public async updateUserStore(userAuth: UserAuthI) {
		await cookieStore.set("userAuth", JSON.stringify(userAuth));
		this.store = userAuth;
		this.authenticated = true;
	}

	public async logout() {
		const tasks: Promise<void>[] = [];
		const keys = ["oldPassword", "authUser"];
		for (const key of keys) {
			tasks.push(cookieStore.delete(key));
		}
		this.store = initialState;
		console.log(tasks);
		this.authenticated = false;
		return Promise.all(tasks);
	}
}

export const userStore = new UserStore();
