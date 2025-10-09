<script lang="ts">
	import { useIsMobile } from '$lib/hooks/useIsMobile.svelte';
	import Picture from '$lib/components/picture.svelte';
	import type { PageProps } from './$types';

	const { whyChooseUsData }: PageProps = $props();
	const reasons = whyChooseUsData?.reasons;

	const isMobile = useIsMobile();
	const cmsBaseUrl = import.meta.env.VITE_CMS_URL;

</script>
<div class="g-mt flex flex-col gap-12 lg:flex-row">
	<section class=" flex flex-col gap-10">
		<div class="flex flex-col gap-4">
			<span class="font-semibold capitalize text-2xl">{whyChooseUsData.title}</span>
			<p class="w-full max-w-[35rem]">{whyChooseUsData.description}</p>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each reasons as wcu (wcu.title)}
				<div class="flex flex-col gap-3 lg:gap-4">
					<div class="flex items-center justify-center bg-primary-foreground h-14 w-14 rounded-lg">
						<img loading="lazy" src={`${cmsBaseUrl}${wcu.icon.url}`} alt={wcu.title}>
					</div>
					<span class="text-xl font-semibold capitalize">{wcu.title}</span>
					<p>{wcu.description}</p>
				</div>
			{/each}
		</div>
	</section>
	{#if !isMobile()}
		<Picture alt="product"
						 class="object-cover max-h-[38rem] max-w-[40vw] rounded-2xl"
						 src={`${cmsBaseUrl}${whyChooseUsData.image.url}`}
						 source={`${cmsBaseUrl}${whyChooseUsData.image.url}`}
		/>
	{/if}
</div>
