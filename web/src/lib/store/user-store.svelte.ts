import type { UserAuthI, UserCountryI } from "$lib/interfaces";

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
	public countryData = $derived(this.store.countryDetails);

	public async updateUserStore(userAuth: UserAuthI) {
		await cookieStore.set("userAuth", JSON.stringify(userAuth));
		this.store = userAuth;
		this.authenticated = true;
	}

	public updateCountryData(data: UserCountryI) {
		this.store = { ...this.store, countryDetails: data };
	}

	public async logout() {
		const tasks: Promise<void>[] = [];
		const keys = ["oldPassword", "userAuth"];
		for (const key of keys) {
			tasks.push(cookieStore.delete(key));
		}
		this.store = initialState;
		this.authenticated = false;
		await Promise.all(tasks);
	}
}

export const userStore = new UserStore();
