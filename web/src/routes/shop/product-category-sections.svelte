<script lang="ts">
	import type { ProductI } from "$lib/interfaces";
	import { Button } from "$lib/components/ui/button";
	import ProductCard from "./product-card.svelte";
	import { CarouselController } from "$lib/utils";
	import { onMount } from "svelte";

	const {
		title,
		products,
		description = "Shop now for exclusive discounts on stylish furniture—before the deals are gone"
	}: {
		title: string;
		products: ProductI[];
		description?: string;
	} = $props();

	let trackEl: HTMLElement;
	let carousel: CarouselController;

	const viewProductDetails = (product: ProductI) => {
		// Navigate to product details page
		console.log(product);
	};

	onMount(() => {
		carousel = new CarouselController(trackEl);

		// Example usage
		carousel.handleNext();

		return () => {
			carousel.destroy(); // clean up resize listener
		};
	});

	function prev() {
		carousel.handlePrev();
	}

	function next() {
		carousel.handleNext();
	}
</script>

<section class="flex flex-col gap-4">
	<div class="flex items-center justify-between gap-4">
		<!-- Title and Description -->
		<div class="flex flex-col gap-2">
			<span class="text-2xl leading-8 font-semibold lg:text-3xl lg:leading-10">{title}</span>
			<p class="text-muted-foreground">{description}</p>
		</div>

		<!-- View all button -->
		<Button class="cursor-pointer text-primary hover:text-primary" variant="ghost">View all</Button>
	</div>

	<div
		bind:this={trackEl}
		class="flex items-center gap-4 transition-transform duration-300 lg:gap-6"
	>
		{#each products as product (product.SKU)}
			<button onclick={() => viewProductDetails(product)} class="cursor-pointer">
				<ProductCard {...product} />
			</button>
		{/each}
	</div>
</section>
