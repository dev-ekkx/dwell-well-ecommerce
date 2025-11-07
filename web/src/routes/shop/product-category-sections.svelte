<script lang="ts">
    import type {ProductI} from "$lib/interfaces";
    import {Button} from "$lib/components/ui/button";
    import {onMount} from "svelte";
    import {useCarousel} from "$lib/helpers/carousel.svelte";
    import ProductCard from "$lib/components/product-card.svelte";
    import {cn} from "$lib/utils";
    import {MediaQuery} from "svelte/reactivity";
    import ArrowButton from "$lib/components/arrow-button.svelte";
    import {goto} from "$app/navigation";
    // import Picture from "$lib/components/picture.svelte";

    const {
        title,
        products,
        description = "Shop now for exclusive discounts on stylish furniture—before the deals are gone",
        isDynamicWidth = true
    }: {
        title: string;
        products: ProductI[];
        description?: string;
        isDynamicWidth?: boolean;
    } = $props();

    const carousel = useCarousel({items: products});
    const mediaQuery = new MediaQuery("max-width: 63.9rem");
    const isMobile = $derived(mediaQuery.current);

    const viewCategory = () => {
        const categoryName = title.toLowerCase().split(" ").join("_");
        goto(`/shop?category=${categoryName}`);
    };

    const viewProductDetails = (product: ProductI) => {
        goto(`/shop/${product.slug}`);
    };

    onMount(() => {
        carousel.collectItems();
    });
</script>

<section
        bind:this={carousel.carouselState.container}
        class={cn("relative flex max-w-full flex-col gap-4 overflow-x-clip", {
		"max-w-[67vw] xl:max-w-[71vw]": isDynamicWidth && !isMobile
	})}
>
    <div class="flex items-center justify-between gap-4">
        <!-- Title and Description -->
        <div class="flex flex-col gap-2">
            <span class="text-2xl leading-8 font-semibold lg:text-3xl lg:leading-10">{title}</span>
            <p class="text-muted-foreground">{description}</p>
        </div>

        <!-- View all button -->
        <Button
                class="cursor-pointer text-primary hover:text-primary"
                onclick={viewCategory}
                variant="ghost">View all
        </Button
        >
    </div>

    <!-- Arrow Buttons -->
        <ArrowButton class="absolute top-2/4 left-0 z-10" direction="left" onclick={carousel.prev}/>
        <ArrowButton class="absolute top-2/4 right-0 z-10"  direction="right" onclick={carousel.next}/>

    <!-- Image carousel -->
    <div bind:this={carousel.carouselState.track} class="flex w-max items-center gap-4">
        {#each carousel.displayedItems as product, idx (idx)}
            <ProductCard {product} trigger={() => viewProductDetails(product)}/>
        {/each}
    </div>
</section>
