<script lang="ts">
	import type { HeroI } from "$lib/interfaces";

	const { heroData }: { heroData: HeroI } = $props();
</script>

<section class="relative flex h-[29rem] items-end justify-center bg-black/70">
	<img
		alt="about hero:- furniture"
		class="absolute top-0 left-0 -z-10 h-full w-full object-cover"
		src={`${heroData.images[0].url}`}
	/>
	<div class="mx-auto flex w-11/12 max-w-3xl flex-col gap-5 py-10 text-center **:text-white">
		<h2 class="text-3xl md:text-4xl lg:text-5xl">{heroData.title}</h2>
		<p>{heroData.subTitle}</p>
	</div>
</section>
