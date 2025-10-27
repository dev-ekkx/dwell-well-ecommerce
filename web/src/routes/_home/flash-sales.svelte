<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import type { FlashSaleI } from "$lib/interfaces";

	const { flashSalesData } = $props();
	const flashSales = flashSalesData as FlashSaleI;

	const imageUrl = flashSales.product.images[0].url ?? "";
	const imageAlt = flashSales.product.images[0].alternativeText ?? "";
</script>

<section class="g-mt grid grid-cols-1 overflow-hidden rounded-lg md:max-h-[28rem] md:grid-cols-2">
	<img alt={imageAlt} class=" h-full object-cover" src={imageUrl} />

	<div
		class="flex flex-col gap-10 bg-muted-foreground px-6 py-10 **:text-white lg:items-start lg:justify-center"
	>
		<div class="flex flex-col gap-2">
			<span class="text-2xl font-bold">{flashSales.title}</span>
			<p class="font-medium">{flashSales.description}</p>
		</div>
		<Button class="cursor-pointer font-bold">{flashSales.cta.text}</Button>
	</div>
</section>
