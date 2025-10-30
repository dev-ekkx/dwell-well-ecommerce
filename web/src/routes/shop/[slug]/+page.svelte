<script lang="ts">
    import type {PageProps} from "./$types";
    import {Item, Link, List, Page, Root, Separator} from "$lib/components/ui/breadcrumb/index.js";
    import {type ConfigI, StarRating} from "@dev-ekkx/svelte-star-rating";
    import {marked} from "marked";
    import DOMPurify from "dompurify";
    import {onMount} from "svelte";
    import {Button} from "$lib/components/ui/button";
    import {MediaQuery} from "svelte/reactivity";

    let {data}: PageProps = $props();
    const product = $derived(data.product);
    let productDescription = $state("");
    let productQuantity = $state(1);
    const mediaQuery = new MediaQuery("max-width: 63.9rem");
    const isMobile = $derived(mediaQuery.current);
    const buttonQuantityClass = "cursor-pointer disabled:opacity-50 disabled:pointer-events-none";
    $inspect(product);

    function increaseQuantity() {
        if (productQuantity < product.inventory) {
            productQuantity += 1;
        }
    }

    function decreaseQuantity() {
        if (productQuantity > 1) {
            productQuantity -= 1;
        }
    }


    const config = $derived<ConfigI>({
        readonly: true,
        maxVal: 5,
        minVal: 0,
        step: 0.1,
        numOfStars: 5,
        starConfig: {
            size: isMobile ? 11 : 14,
            filledColor: "#F98416",
            unfilledColor: "#5D5D5D"
        },
        styles: {
            containerStyles: "width: max-content; pointer-events: none;",
            starStyles: "gap: 0.1rem"
        }
    });


    onMount(() => {
        const rawHtml = marked(product.description).toString();
        productDescription = DOMPurify.sanitize(rawHtml);
    });
</script>

<div class="flex flex-col gap-4 g-px">
    <Root>
        <List>
            <Item>
                <Link href="/shop">Shop</Link>
            </Item>
            <Separator/>
            <Item>
                <Page class="font-bold">{product.name}</Page>
            </Item>
        </List>
    </Root>
    <div class="g-py">
        <!-- Product Details -->
        <section class="grid gap-10 xl:grid-cols-2">
            <!-- images -->
            <div class="grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-10 xl:gap-8">
                <img
                        alt={product.images[0].alternativeText}
                        class="aspect-square max-w-full rounded-lg object-cover md:col-span-4"
                        src={product.images[0].url}
                />
                <div class="flex flex-row gap-6 md:flex-col">
                    {#each product.images.slice(1, 4) as image}
                        <img
                                alt={image.alternativeText}
                                class="aspect-square h-auto w-[4.5rem] rounded-lg object-cover md:w-[5.8rem]"
                                src={image.url}
                        />
                    {/each}
                </div>
            </div>

            <!-- Details -->
            <section class="flex flex-col gap-4">
                <div
                        class="line-clamp-1 flex flex-col gap-4 text-2xl leading-8 font-semibold sm:text-3xl sm:leading-10 xl:text-4xl xl:leading-12"
                >
                    <h3>{product.name}</h3>
                    <span>$ {Number(product.price).toFixed(2)}</span>
                </div>

                <!-- Rating and reviews -->
                <div class="flex items-center gap-4">
                    <StarRating {config} value={product.averageRating}/>
                    <div class="flex items-center gap-1 text-xs text-muted-foreground md:text-sm">
                        <span>({product.averageRating} stars)</span>
                        <span class="h-1.5 w-1.5 rounded-full bg-muted-foreground"></span>
                        <span>{product.reviewCount} reviews</span>
                    </div>
                </div>
                <span class="font-semibold">{product.inventory} available products</span>
                <p class="text-sm text-muted-foreground md:text-base">{@html productDescription}</p>
                <!-- Colors -->
                <div class="flex flex-col">
                    <span class="font-semibold">Available colors</span>
                    <div class="flex items-center gap-4"></div>
                </div>
                <!-- Quantity -->
                <div class="flex flex-col gap-2">
                    <span class="font-semibold">Quantity</span>
                    <div
                            class="flex w-max items-center gap-2 rounded-md border **:px-3 **:py-1 **:text-center **:text-lg **:font-semibold"
                    >
                        <button class={buttonQuantityClass} disabled={productQuantity <= 1} onclick={decreaseQuantity}>
                            -
                        </button>
                        <span class="w-10">{productQuantity}</span>
                        <button class={buttonQuantityClass} disabled={productQuantity >= product.inventory}
                                onclick={increaseQuantity}>+
                        </button>
                    </div>
                </div>

                <!-- Order or add to cart -->
                <div class="flex flex-col gap-2 md:flex-row mt-6 md:gap-6">
                    <Button>Order now</Button>
                    <Button class="text-primary border-primary" variant="outline">Add to cart</Button>
                </div>
            </section>
        </section>
    </div>
</div>
