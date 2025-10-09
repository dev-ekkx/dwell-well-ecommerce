<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Picture from '$lib/components/picture.svelte';
	import type { PageProps } from './$types';
	import type { FlashSaleI } from '$lib/interfaces';

	const { flashSalesData }: PageProps = $props();
	const flashSales = flashSalesData as FlashSaleI;
	const cmsBaseUrl = import.meta.env.VITE_CMS_URL;

	const imageUrl = cmsBaseUrl + flashSales.product.images[0].url;


</script>

<section class="grid grid-cols-1 md:grid-cols-2 md:max-h-[28rem] g-mt rounded-lg overflow-hidden">
	<Picture alt="flash sales" class="object-cover w-full max-h-[19rem] lg:max-h-auto" source={imageUrl}
					 src={imageUrl} />
	<div class="bg-muted-foreground px-6 py-10 flex flex-col gap-10 lg:items-start lg:justify-center **:text-white">
		<div class="flex flex-col gap-2">
			<span class="font-bold text-2xl">{flashSales.title}</span>
			<p class="font-medium">{flashSales.description}</p>
		</div>
		<Button class="font-bold cursor-pointer">{flashSales.cta.text}</Button>
	</div>
</section>