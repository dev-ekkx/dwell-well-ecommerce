<script lang="ts">
	import type { PageProps } from './$types';

	const { whatWeAreKnownForData }: PageProps = $props();
	const cmsBaseUrl = import.meta.env.VITE_CMS_URL;
</script>

<section class="g-mt-pt flex-col gap-6 g-px grid grid-cols-10 ">
	<div class="flex flex-col gap-8 col-span-10 lg:col-span-6">
		<div class="flex flex-col gap-6">
			<h4 class="text-section-head">{whatWeAreKnownForData.title}</h4>
			<p>{whatWeAreKnownForData.description}</p>
		</div>

		<div class="grid grid-cols-1 gap-10 md:gap-6 md:grid-cols-2">
			{#each whatWeAreKnownForData.reasons as achievement (achievement.title)}
				<div class="flex flex-col gap-6 md:gap-4">
					<div class="h-16 w-16 rounded-lg bg-primary-foreground flex items-center justify-center">
						<img src={`${cmsBaseUrl}${achievement.icon.url}`} alt={achievement.title} />
					</div>
					<span class="font-semibold text-md">{achievement.title}</span>
					<p>{achievement.description}</p>
				</div>
			{/each}
		</div>
	</div>
	<img alt="wardrobe"
			 class="transition-all duration-500 ease-linear col-span-10 w-full max-h-[20rem] lg:col-span-4 md:max-h-[35rem] lg:max-h-auto rounded-lg object-cover"
			 src={`${cmsBaseUrl}${whatWeAreKnownForData.image.url}`} />
</section>