<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { recentlyViewedStore } from "$lib/store/recently-viewed-store.svelte";
	import { cn } from "$lib/utils";
	import ProductCard from "./product-card.svelte";

	const { className }: { className?: string } = $props();
	const recentlyViewedProducts = $derived(recentlyViewedStore.recentlyViewedProducts);
	const viewProduct = (slug: string) => {
		goto(resolve(`/shop/${slug}`));
	};
</script>

<div class={cn("flex flex-col gap-6", className)}>
	<span class="text-2xl leading-8 font-semibold">Recently Viewed</span>

	<section
		class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4 2xl:grid-cols-5"
	>
		{#each recentlyViewedProducts as product (product.SKU)}
			<ProductCard {product} trigger={() => viewProduct(product.slug)} />
		{/each}
	</section>
</div>
