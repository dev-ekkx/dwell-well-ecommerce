import { SvelteMap } from "svelte/reactivity";
import type { CartItemI, CartStoreI, ProductI } from "$lib/interfaces";

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
				quantity: 1
			});
		}

		console.log(this.store.values());
	}

	public increaseQuantity(sku: string) {
		const existing = this.store.get(sku);
		if (existing) {
			this.store.set(sku, { ...existing, quantity: existing.quantity + 1 });
		}
	}

	public reduceQuantity(sku: string) {
		const existing = this.store.get(sku);
		if (!existing) return;

		if (existing.quantity > 1) {
			this.store.set(sku, { ...existing, quantity: existing.quantity - 1 });
		} else {
			this.removeFromCart(sku);
		}
	}

	public removeFromCart(sku: string) {
		this.store.delete(sku);
	}

	public clearCart() {
		this.store.clear();
	}
}

export const cartStore = new CartStore();
