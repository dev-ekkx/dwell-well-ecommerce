<script lang="ts">
	import ArrowButton from "$lib/components/arrow-button.svelte";
	import Picture from "$lib/components/picture.svelte";
	import { useCarousel } from "$lib/helpers/carousel.svelte";
	import type { CategoryI } from "$lib/interfaces";
	import { onMount } from "svelte";

	const { productCategoriesData } = $props();
	const productsCategories = $derived(productCategoriesData as CategoryI);
	const carousel = $derived(useCarousel({ items: productsCategories?.items ?? [] }));

	onMount(() => {
		carousel.collectItems();
	});
</script>

<section
	bind:this={carousel.carouselState.container}
	class="g-mt flex flex-col gap-6 overflow-x-clip"
>
	<!--	Category title and arrow buttons -->
	<div class="flex items-center justify-between gap-4 capitalize">
		<span
			class="text-2xl leading-8 font-semibold md:text-3xl md:leading-10 lg:text-4xl lg:leading-12"
			>product categories</span
		>

		<!-- Arrow buttons -->
		<div class="flex items-center gap-2">
			<ArrowButton direction="left" onclick={carousel.prev} />
			<ArrowButton direction="right" onclick={carousel.next} />
		</div>
	</div>

	<!--Images and labels-->
	<div bind:this={carousel.carouselState.track} class="flex w-max items-center gap-4 lg:gap-6">
		{#each carousel.displayedItems as product, idx (idx)}
			<div class="flex flex-col items-center gap-6">
				<Picture
					alt={product.title}
					class="h-[12.7rem] w-[12.7rem] rounded-lg object-cover transition-all duration-500 ease-linear md:h-[17.9rem] md:w-[17.9rem] lg:h-[22.6rem] lg:w-[22.6rem]"
					src={`${product.image.url}`}
					source={`${product.image.url}`}
				/>
				<span class="text-lg font-medium capitalize">{product.title}</span>
			</div>
		{/each}
	</div>
</section>
