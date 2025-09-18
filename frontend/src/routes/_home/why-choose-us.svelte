<script lang="ts">
	import { whyChooseUs } from '$lib/constants';
	import ProductImageJp from '$lib/assets/images/category1.jpg';
	import ProductImageWp from '$lib/assets/images/category1.webp';
	import { useIsMobileSvelte } from '$lib/hooks/useIsMobile.svelte.js';
	import Picture from '$lib/components/picture.svelte';

	const isMobile = useIsMobileSvelte();
</script>
<div class="g-mt flex flex-col gap-12 lg:flex-row">
	<section class=" flex flex-col gap-10">
		<div class="flex flex-col gap-4">
			<span class="font-semibold capitalize text-2xl">{whyChooseUs.title.label}</span>
			<p class="w-full max-w-[35rem]">{whyChooseUs.title.description}</p>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each whyChooseUs.reasons as wcu (wcu.label)}
				<div class="flex flex-col gap-3 lg:gap-4">
					<div class="flex items-center justify-center bg-primary-foreground h-14 w-14 rounded-lg">
						<img loading="lazy" src={wcu.icon} alt={wcu.label}>
					</div>
					<span class="text-xl font-semibold capitalize">{wcu.label}</span>
					<p>{wcu.description}</p>
				</div>
			{/each}
		</div>
	</section>
	{#if !isMobile()}
		<Picture alt="product" class="object-cover max-h-[38rem] max-w-[40vw] rounded-2xl"
						 src={ProductImageJp}
						 source={ProductImageWp} />
	{/if}
</div>
