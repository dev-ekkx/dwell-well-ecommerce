<script lang="ts">
	import Picture from "$lib/components/picture.svelte";
	import { MediaQuery } from "svelte/reactivity";

	const { whyChooseUsData } = $props();
	const reasons = $derived(whyChooseUsData?.reasons);

	const mediaQuery = new MediaQuery("max-width: 63.9rem");
	const isMobile = $derived(mediaQuery.current);
</script>

<div class="g-mt flex flex-col gap-12 lg:flex-row">
	<section class=" flex flex-col gap-10">
		<div class="flex flex-col gap-4">
			<span class="text-2xl font-semibold capitalize">{whyChooseUsData?.title}</span>
			<p class="w-full max-w-[35rem]">{whyChooseUsData?.description}</p>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each reasons as wcu (wcu.title)}
				<div class="flex flex-col gap-3 lg:gap-4">
					<div class="flex h-14 w-14 items-center justify-center rounded-lg bg-primary-foreground">
						<img src={`${wcu.icon.url}`} alt={wcu.title} />
					</div>
					<span class="text-xl font-semibold capitalize">{wcu.title}</span>
					<p>{wcu.description}</p>
				</div>
			{/each}
		</div>
	</section>
	{#if !isMobile}
		<Picture
			alt="product"
			class="max-h-[38rem] max-w-[40vw] rounded-2xl object-cover"
			src={`${whyChooseUsData?.image.url}`}
			source={`${whyChooseUsData?.image.url}`}
		/>
	{/if}
</div>
