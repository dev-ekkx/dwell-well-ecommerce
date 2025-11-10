import { browser } from "$app/environment";
import type { ProductSummaryI } from "$lib/interfaces";

class RecentlyViewedStore {
	private items = $state<ProductSummaryI[]>([]);
	public recentlyViewedProducts = $derived(this.items);
	private readonly STORAGE_KEY = "recently-viewed";
	private readonly MAX_ITEMS = 5;
	private syncTimeout: NodeJS.Timeout | null = null;

	constructor() {
		if (browser) {
			this.loadFromStorage();
			// this.syncWithBackend(); // Initial sync
		}
	}

	public addProduct(product: ProductSummaryI) {
		if (this.items[0]?.SKU === product.SKU) return;

		this.items = [product, ...this.items.filter((item) => item.SKU !== product.SKU)].slice(
			0,
			this.MAX_ITEMS
		);

		this.saveToStorage();
		// this.scheduleBackendSync();
	}

	public removeProduct(sku: string) {
		this.items = this.items.filter((item) => item.SKU !== sku);
		this.saveToStorage();
		// this.scheduleBackendSync();
	}

	public clear() {
		this.items = [];
		this.saveToStorage();
		// this.scheduleBackendSync();
	}

	// Check if product was recently viewed
	public hasProduct(sku: string): boolean {
		return this.items.some((item) => item.SKU === sku);
	}

	// Get viewing frequency for a product
	public getViewCount(sku: string): number {
		return this.items.filter((item) => item.SKU === sku).length;
	}

	private loadFromStorage() {
		try {
			const stored = localStorage.getItem(this.STORAGE_KEY);
			if (stored) {
				this.items = JSON.parse(stored);
			}
		} catch (error) {
			console.error("Failed to load recently viewed:", error);
		}
	}

	private saveToStorage() {
		if (!browser) return;
		try {
			localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
		} catch (error) {
			console.error("Failed to save recently viewed:", error);
		}
	}

	private scheduleBackendSync() {
		if (this.syncTimeout) clearTimeout(this.syncTimeout);
		this.syncTimeout = setTimeout(() => this.syncWithBackend(), 2000);
	}

	private async syncWithBackend() {
		if (!browser) return;

		try {
			// Send to backend for analytics/personalization
			await fetch("/api/recently-viewed", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					products: this.items.map((p) => p.SKU),
					timestamp: new Date().toISOString()
				})
			});
		} catch (error) {
			console.error("Failed to sync recently viewed:", error);
		}
	}
}

export const recentlyViewedStore = new RecentlyViewedStore();
