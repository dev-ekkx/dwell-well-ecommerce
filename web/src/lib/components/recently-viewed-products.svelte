<script lang="ts">
    import ProductCard from "./product-card.svelte";
    import {recentlyViewedStore} from "$lib/store/recently-viewed-store.svelte";
    import {goto} from "$app/navigation";
    import {resolve} from "$app/paths";
    import {cn} from "$lib/utils";

    const { className }: { className?: string } = $props();
	const recentlyViewedProducts = $derived(recentlyViewedStore.recentlyViewedProducts);
	const viewProduct = (slug: string) => {
		goto(resolve(`/shop/${slug}`));
	};
</script>

<div class={cn("flex flex-col gap-6", className)}>
	<span class="text-2xl leading-8 font-semibold">Recently Viewed</span>

<!--	<section class="flex w-full flex-col gap-4 overflow-x-auto md:flex-row md:gap-6 xl:gap-10">-->
	<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
		{#each recentlyViewedProducts as product (product.SKU)}
			<ProductCard {product} trigger={() => viewProduct(product.slug)} />
		{/each}
	</section>
</div>
