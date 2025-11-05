<script lang="ts">
    import type {ProductI} from "$lib/interfaces";
    import {Button} from "$lib/components/ui/button";
    import {onMount} from "svelte";
    import {useCarousel} from "$lib/helpers/carousel.svelte";
    import ProductCard from "./product-card.svelte";
    import {cn} from "$lib/utils";
    import {MediaQuery} from "svelte/reactivity";
    import ArrowButton from "$lib/components/arrow-button.svelte";
    // import Picture from "$lib/components/picture.svelte";

    const {
		title,
		products,
		description = "Shop now for exclusive discounts on stylish furniture—before the deals are gone"
	}: {
		title: string;
		products: ProductI[];
		description?: string;
	} = $props();

    const carousel = useCarousel({ items: products });
    const mediaQuery = new MediaQuery("max-width: 63.9rem");
    const isMobile = $derived(mediaQuery.current);

	const viewProductDetails = (product: ProductI) => {
		console.log(product);
	};

	onMount(() => {
        carousel.collectItems();
	});



</script>

<section
        bind:this={carousel.carouselState.container}
        class={cn("relative flex flex-col gap-4 max-w-full overflow-x-clip", {
            'max-w-[67vw] xl:max-w-[71vw]': !isMobile
        })}>
	<div class="flex items-center justify-between gap-4">
		<!-- Title and Description -->
		<div class="flex flex-col gap-2">
			<span class="text-2xl leading-8 font-semibold lg:text-3xl lg:leading-10">{title}</span>
			<p class="text-muted-foreground">{description}</p>
		</div>

		<!-- View all button -->
		<Button class="cursor-pointer text-primary hover:text-primary" variant="ghost">View all</Button>
	</div>

    <!-- Arrow Buttons -->
    <div class="w-full flex absolute left-0 z-10  top-2/4 -translate-y-1/2 items-center justify-between">
        <ArrowButton direction="left" onclick={carousel.prev} />
        <ArrowButton direction="right" onclick={carousel.next} />
    </div>

<!-- Image carousel -->
	<div
		bind:this={carousel.carouselState.track}
		class="flex items-center gap-4 w-max"
	>
        {#each carousel.displayedItems as product, idx(idx)}
            <button onclick={() => viewProductDetails(product)} class="cursor-pointer">
				<ProductCard {...product} />
			</button>
		{/each}
	</div>
</section>