<script lang="ts">
	import type { PageProps } from './$types';

	const { leadershipTeamData }: PageProps = $props();
	const cmsBaseUrl = import.meta.env.VITE_CMS_URL;
</script>

<section class="g-px g-mt-pt flex flex-col gap-6">
	<h4 class="text-section-head text-center">{leadershipTeamData.title}</h4>

	<p class="text-section-p text-center">{leadershipTeamData.description}</p>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
		{#each leadershipTeamData.team as manager (manager.name)}
			<div class="h-[28rem] lg:h-[23rem] relative rounded-lg overflow-hidden">
				<img alt={manager.name} src={`${cmsBaseUrl}${manager.profilePicture.url}`}
						 class="h-full w-full object-cover object-top" />
				<div
					class="absolute flex flex-col **:text-white justify-end px-4 py-3 gap-1 bg-gradient-to-b from-transparent to-black/90 bottom-0 left-0 w-full h-3/12">
					<span class="font-semibold">{manager.name}</span>
					<span class="text-xs font-light">{manager.role}</span>
				</div>
			</div>
		{/each}
	</div>
</section>