import { SvelteMap } from "svelte/reactivity";
import type { CartItemI, CartStoreI, ProductI } from "$lib/interfaces";
import { browser } from "$app/environment";

class CartStore implements CartStoreI {
	// Top-level reactive store
	private readonly store = new SvelteMap<string, CartItemI>();
	// Derived reactive values
	public cartItems = $derived(() => Array.from(this.store.values()));
	public totalItems = $derived(() =>
		Array.from(this.store.values()).reduce((acc, item) => acc + item.quantity, 0)
	);
	public totalPrice = $derived(() =>
		Array.from(this.store.values()).reduce((acc, item) => acc + item.price * item.quantity, 0)
	);
	private readonly STORAGE_KEY = "cart";
	private readonly DEBOUNCE_DELAY = 1500;
	private syncTimeout: NodeJS.Timeout | null = null;

	constructor() {
		this.initializeFromStorage();
	}

	// Actions
	public addToCart(product: ProductI) {
		const existing = this.store.get(product.SKU);

		if (existing) {
			this.store.set(product.SKU, { ...existing, quantity: existing.quantity + 1 });
		} else {
			this.store.set(product.SKU, {
				name: product.name,
				price: product.price,
				image: product.images[0],
				SKU: product.SKU,
				inventory: product.inventory,
				slug: product.slug,
				quantity: 1
			});
		}

		// Persistence
		this.saveToLocalStorage();
		// this.scheduleBackendSync();
	}

	public increaseQuantity(sku: string) {
		const existing = this.store.get(sku);
		if (existing) {
			this.store.set(sku, { ...existing, quantity: existing.quantity + 1 });
			this.saveToLocalStorage();
			// this.scheduleBackendSync();
		}
	}

	public reduceQuantity(sku: string) {
		const existing = this.store.get(sku);
		if (!existing) return;

		if (existing.quantity > 1) {
			this.store.set(sku, { ...existing, quantity: existing.quantity - 1 });
			this.saveToLocalStorage();
			// this.scheduleBackendSync();
		}
		// else {
		// 	this.removeFromCart(sku);
		// }
	}

	public removeFromCart(sku: string) {
		this.store.delete(sku);
		this.saveToLocalStorage();
		// this.scheduleBackendSync();
	}

	public clearCart() {
		this.store.clear();
		this.saveToLocalStorage();
		// this.scheduleBackendSync()
	}

	private async syncWithBackend() {
		try {
			// GET current cart from backend
			const response = await fetch("/api/cart", {
				credentials: "include"
			});

			if (response.ok) {
				const backendCart = (await response.json()) as CartItemI[];

				// Merge strategies: you might want to prefer backend or client data
				// This example prefers backend data for consistency
				this.store.clear();
				for (const item of backendCart) {
					this.store.set(item.SKU, item);
				}

				// Update localStorage with merged data
				this.saveToLocalStorage();
			}
		} catch (error) {
			console.error("Failed to sync with backend:", error);
			// Continue with local data if backend sync fails
		}
	}

	private scheduleBackendSync() {
		// Clear existing timeout
		if (this.syncTimeout) {
			clearTimeout(this.syncTimeout);
		}

		// Schedule new sync
		this.syncTimeout = setTimeout(async () => {
			await this.updateBackendCart();
		}, this.DEBOUNCE_DELAY);
	}

	private async updateBackendCart() {
		try {
			await fetch("/api/cart", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				credentials: "include",
				body: JSON.stringify({
					items: this.cartItems
				})
			});

			// Optional: Handle response, show notification, etc.
		} catch (error) {
			console.error("Failed to update backend cart:", error);
			// You might want to implement retry logic or offline queue here
		}
	}

	private initializeFromStorage() {
		if (!browser) return;

		this.loadFromLocalStorage();

		// Then sync with backend (for data consistency)
		// await this.syncWithBackend();
	}

	private loadFromLocalStorage() {
		try {
			const stored = localStorage.getItem(this.STORAGE_KEY);
			if (stored && stored !== "undefined") {
				const items = JSON.parse(stored) as CartItemI[];
				this.store.clear();
				for (const item of items) {
					this.store.set(item.SKU, item);
				}
			}
		} catch (error) {
			console.error("Failed to load cart from localStorage:", error);
		}
	}

	private saveToLocalStorage() {
		if (!browser) return;
		try {
			localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems()));
		} catch (error) {
			console.error("Failed to save cart to localStorage:", error);
		}
	}
}

export const cartStore = new CartStore();
