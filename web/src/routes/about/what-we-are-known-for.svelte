<script lang="ts">
	import type { WhyChooseUsI } from "$lib/interfaces";

	const { whatWeAreKnownForData }: { whatWeAreKnownForData: WhyChooseUsI } = $props();
</script>

<section class="g-mt-pt grid grid-cols-10 flex-col gap-6 g-px">
	<div class="col-span-10 flex flex-col gap-8 lg:col-span-6">
		<div class="flex flex-col gap-6">
			<h4 class="text-section-head">{whatWeAreKnownForData.title}</h4>
			<p>{whatWeAreKnownForData.description}</p>
		</div>

		<div class="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-6">
			{#each whatWeAreKnownForData.reasons as achievement (achievement.title)}
				<div class="flex flex-col gap-6 md:gap-4">
					<div class="flex h-16 w-16 items-center justify-center rounded-lg bg-primary-foreground">
						<img src={`${achievement.icon.url}`} alt={achievement.title} />
					</div>
					<span class="text-md font-semibold">{achievement.title}</span>
					<p>{achievement.description}</p>
				</div>
			{/each}
		</div>
	</div>
	<img
		alt="wardrobe"
		class="lg:max-h-auto col-span-10 max-h-[20rem] w-full rounded-lg object-cover transition-all duration-500 ease-linear md:max-h-[35rem] lg:col-span-4"
		src={`${whatWeAreKnownForData.image.url}`}
	/>
</section>
