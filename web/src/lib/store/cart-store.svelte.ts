import { SvelteMap } from "svelte/reactivity";
import type { CartItemI, CartStoreI, ProductI } from "$lib/interfaces";

// Top-level reactive store
const store = new SvelteMap<string, CartItemI>();

// Derived reactive values
const cartItems = $derived(() => Array.from(store.values()));

const totalItems = $derived(() =>
	Array.from(store.values()).reduce((acc, item) => acc + item.quantity, 0)
);

const totalPrice = $derived(() =>
	Array.from(store.values()).reduce((acc, item) => acc + item.price * item.quantity, 0)
);

// Actions
function addToCart(product: ProductI) {
	const existing = store.get(product.SKU);

	if (existing) {
		store.set(product.SKU, { ...existing, quantity: existing.quantity + 1 });
	} else {
		store.set(product.SKU, {
			name: product.name,
			price: product.price,
			image: product.images[0],
			SKU: product.SKU,
			quantity: 1
		});
	}

	console.log(store.values());
}

function increaseQuantity(sku: string) {
	const existing = store.get(sku);
	if (existing) {
		store.set(sku, { ...existing, quantity: existing.quantity + 1 });
	}
}

function reduceQuantity(sku: string) {
	const existing = store.get(sku);
	if (!existing) return;

	if (existing.quantity > 1) {
		store.set(sku, { ...existing, quantity: existing.quantity - 1 });
	} else {
		removeFromCart(sku);
	}
}

function removeFromCart(sku: string) {
	store.delete(sku);
}

function clearCart() {
	store.clear();
}

// Export as a single namespace
export const cartStore = {
	cartItems,
	totalItems,
	totalPrice,
	addToCart,
	increaseQuantity,
	reduceQuantity,
	removeFromCart,
	clearCart
} satisfies CartStoreI;
