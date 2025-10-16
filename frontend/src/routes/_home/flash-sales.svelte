<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { FlashSaleI } from '$lib/interfaces';

	const { flashSalesData } = $props();
	const flashSales = flashSalesData as FlashSaleI;
	const cmsBaseUrl = import.meta.env.VITE_CMS_URL;

	const imageUrl = cmsBaseUrl + (flashSales.product.images[0].url ?? '');
	const imageAlt = flashSales.product.images[0].alternativeText ?? '';


</script>

<section class="grid grid-cols-1 md:grid-cols-2 md:max-h-[28rem] g-mt rounded-lg overflow-hidden">
	<img alt={imageAlt} class=" object-cover h-full" src={imageUrl}>

	<div class="bg-muted-foreground px-6 py-10 flex flex-col gap-10 lg:items-start lg:justify-center **:text-white">
		<div class="flex flex-col gap-2">
			<span class="font-bold text-2xl">{flashSales.title}</span>
			<p class="font-medium">{flashSales.description}</p>
		</div>
		<Button class="font-bold cursor-pointer">{flashSales.cta.text}</Button>
	</div>
</section>