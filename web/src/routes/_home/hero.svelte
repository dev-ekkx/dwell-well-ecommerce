<script lang="ts">
	import { goto } from "$app/navigation";
	import { Button } from "$lib/components/ui/button";
	import { cn } from "$lib/utils";
	import HeroCarousel from "./hero-carousel.svelte";

	const { heroData } = $props();
	const ctaButtons = $derived(heroData?.ctaButtons);

	const handleCta = (cta: "shop now" | "learn more") => {
		if (cta === "shop now") {
			goto("/shop");
		}
	};
</script>

<div class="grid grid-cols-1 gap-20 lg:grid-cols-2 lg:gap-14">
	<!--	Product summary section-->
	<section class="flex flex-col gap-10 2xl:max-w-[70%]">
		<div class="flex flex-col gap-6">
			<h1
				class="text-2xl leading-8 font-semibold capitalize md:text-4xl md:leading-12 lg:text-5xl lg:leading-16"
			>
				{heroData?.title}
			</h1>
			<p>{heroData?.subTitle}</p>
		</div>
		<div class="flex flex-col gap-2 sm:flex-row sm:gap-5 md:gap-6">
			{#each ctaButtons as cta (cta.id)}
				<Button
					onclick={() => handleCta(cta.text)}
					aria-label={cta.text}
					variant={cta.text === "learn more" ? "outline" : "default"}
					class={cn("cursor-pointer font-semibold capitalize", {
						"cursor-pointer border-primary text-primary hover:text-primary":
							cta.text === "learn more"
					})}>{cta.text}</Button
				>
			{/each}
		</div>
	</section>

	<!--	Carousel section-->
	<HeroCarousel heroImages={heroData?.images ?? []} />
</div>
