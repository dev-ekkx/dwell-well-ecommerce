<script lang="ts">
    import type {ProductI} from "$lib/interfaces";
    import ProductCard from "../product-card.svelte";

    const relatedProducts: ProductI[] = $props();

    $inspect(relatedProducts)
</script>

<div class="flex flex-col gap-10">
	<span class="text-2xl leading-8 font-semibold">Related products</span>

	<section class="flex flex-col gap-4 md:flex-row md:gap-6 xl:gap-10 w-full  overflow-x-auto">
		{#each relatedProducts as product (product.SKU)}
			<ProductCard {...product} />
		{/each}
	</section>
</div>
