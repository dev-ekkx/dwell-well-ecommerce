<script lang="ts">
	import ProductCard from "./product-card.svelte";
	import { recentlyViewedStore } from "$lib/store/recently-viewed-store.svelte";
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { cn } from "$lib/utils";

	const { className }: { className?: string } = $props();
	const recentlyViewedProducts = $derived(recentlyViewedStore.recentlyViewedProducts);
	const viewProduct = (slug: string) => {
		goto(resolve(`/shop/${slug}`));
	};
</script>

<div class={cn("flex flex-col gap-6", className)}>
	<span class="text-2xl leading-8 font-semibold">Recently Viewed</span>

	<section class="flex w-full flex-col gap-4 overflow-x-auto md:flex-row md:gap-6 xl:gap-10">
		{#each recentlyViewedProducts as product (product.SKU)}
			<ProductCard {product} trigger={() => viewProduct(product.slug)} />
		{/each}
	</section>
</div>
