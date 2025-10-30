<script lang="ts">
    import type {PageProps} from "./$types";
    import {Item, Link, List, Page, Root, Separator} from "$lib/components/ui/breadcrumb/index.js";
    import {StarRating} from "@dev-ekkx/svelte-star-rating";
    import {config} from "$lib/constants/index.svelte";

    let { data }: PageProps = $props();
	const product = $derived(data.product);

	$inspect(product);
</script>

<div class="flex flex-col gap-4 g-px">
	<Root>
		<List>
			<Item>
				<Link href="/shop">Shop</Link>
			</Item>
			<Separator />
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
							class="aspect-square h-auto w-[3.7rem] rounded-lg object-cover md:w-[5.8rem]"
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
            <div class="flex items-center gap-4">
                <StarRating {config} value={product.averageRating} />
                <span>({product})</span>
            </div>
            </section>
		</section>
	</div>
</div>
