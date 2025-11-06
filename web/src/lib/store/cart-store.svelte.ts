import { SvelteMap } from "svelte/reactivity";
import type { CartItemI, CartStoreI, ProductI } from "$lib/interfaces";

export const useCartStore = (): CartStoreI => {
	let store = new SvelteMap<string, CartItemI>();

	const cartItems = $derived(() => Array.from(store.values()))();

	const totalItems = $derived(() =>
		Array.from(store.values()).reduce((acc, item) => acc + item.quantity, 0)
	)();

	const totalPrice = $derived(() =>
		Array.from(store.values()).reduce((acc, item) => acc + item.price * item.quantity, 0)
	)();

	function addToCart(product: ProductI, quantity: number) {
		const existingItem = store.get(product.SKU);

		if (existingItem) {
			store.set(product.SKU, {
				...existingItem,
				quantity: existingItem.quantity + quantity
			});
		} else {
			// Create a full new cart item
			store.set(product.SKU, {
				name: product.name,
				price: product.price,
				quantity: quantity
			});
		}
	}

	function increaseQuantity(sku: string) {
		const existingItem = store.get(sku);

		if (existingItem) {
			store.set(sku, {
				...existingItem,
				quantity: existingItem.quantity + 1
			});
		}
	}

	function reduceQuantity(sku: string) {
		const existingItem = store.get(sku);

		if (existingItem) {
			if (existingItem.quantity > 1) {
				store.set(sku, {
					...existingItem,
					quantity: existingItem.quantity - 1
				});
			} else {
				removeFromCart(sku);
			}
		}
	}

	function removeFromCart(sku: string) {
		store.delete(sku);
	}

	function clearCart() {
		store.clear();
	}

	return {
		cartItems,
		totalPrice,
		totalItems,
		addToCart,
		removeFromCart,
		increaseQuantity,
		reduceQuantity,
		clearCart
	};
};
