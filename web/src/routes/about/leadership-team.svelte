<script lang="ts">
	import type { LeadershipTeamI } from "$lib/interfaces";

	const { leadershipTeamData }: { leadershipTeamData: LeadershipTeamI } = $props();
</script>

<section class="g-mt-pt flex flex-col gap-6 g-px">
	<h4 class="text-center text-section-head">{leadershipTeamData.title}</h4>

	<p class="text-section-p text-center">{leadershipTeamData.description}</p>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
		{#each leadershipTeamData.team as manager (manager.name)}
			<div class="relative h-[28rem] overflow-hidden rounded-lg lg:h-[23rem]">
				<img
					alt={manager.name}
					src={`${manager.profilePicture.url}`}
					class="h-full w-full object-cover object-top"
				/>
				<div
					class="absolute bottom-0 left-0 flex h-3/12 w-full flex-col justify-end gap-1 bg-gradient-to-b from-transparent to-black/90 px-4 py-3 **:text-white"
				>
					<span class="font-semibold">{manager.name}</span>
					<span class="text-xs font-light">{manager.role}</span>
				</div>
			</div>
		{/each}
	</div>
</section>
