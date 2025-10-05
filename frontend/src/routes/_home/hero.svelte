<script lang="ts">
	import HeroCarousel from './hero-carousel.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { PageProps } from './$types';
	import { cn } from '$lib/utils';

	const { heroData }: PageProps = $props();
	const ctaButtons = heroData.ctaButtons;
	

</script>
<div class="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-14">
	<!--	Product summary section-->
	<section class="flex flex-col gap-10 2xl:max-w-[70%]">
		<div class="flex flex-col gap-6">
			<h1
				class="font-semibold text-2xl capitalize md:text-4xl lg:text-5xl leading-8 md:leading-12 lg:leading-16">{heroData.title}</h1>
			<p>{heroData.subTitle}</p>
		</div>
		<div class="flex flex-col gap-2 sm:flex-row sm:gap-5 md:gap-6">
			{#each ctaButtons as cta (cta.id)}
				<Button
					aria-label={cta.text}
					variant={cta.text === "learn more" ? "outline" : "default"}
					class={cn("cursor-pointer font-semibold capitalize", {
					"border-primary text-primary cursor-pointer hover:text-primary": cta.text === "learn more"
				})}>{cta.text}</Button>
			{/each}
		</div>

	</section>

	<!--	Carousel section-->
	<HeroCarousel />
</div>
