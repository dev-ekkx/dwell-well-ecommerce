<script lang="ts">
	import { Content, List, Root, Trigger } from "$lib/components/ui/tabs/index";
	import type { ShowroomI } from "$lib/interfaces";
	import { SvelteMap } from "svelte/reactivity";

	const { showroomData } = $props();
	const showrooms: ShowroomI[] = showroomData.showrooms || [];

	const groupedShowrooms = $derived(() => {
		if (!showrooms || showrooms.length === 0) {
			return [];
		}

		// Use a Map to group showrooms by their continent name
		const groups = new SvelteMap<string, ShowroomI[]>();

		showrooms.forEach((showroom) => {
			const continent = showroom.country.region.name;
			if (!groups.has(continent)) {
				groups.set(continent, []);
			}
			groups.get(continent)?.push(showroom);
		});

		// Convert the Map into the array structure the UI needs
		return Array.from(groups.entries()).map(([continent, showrooms]) => ({
			continent,
			showrooms
		}));
	});
</script>

<section class="g-mt-pt flex flex-col gap-6 g-px">
	<h4 class="text-center text-section-head">{showroomData.title}</h4>
	<p class="text-section-p text-center">{showroomData.description}</p>

	<!--Showrooms tabs -->
	{#if groupedShowrooms().length > 0}
		<Root class="mt-4 w-full" value={groupedShowrooms()[0].continent}>
			<!--Showroom (tab) list and triggers-->
			<List
				class="flex h-max w-full max-w-2xl justify-baseline gap-4 overflow-x-auto scrollbar-hidden"
			>
				{#each groupedShowrooms() as group (group.continent)}
					<Trigger
						value={group.continent}
						class="rounded-md px-4 py-2 capitalize transition-colors hover:bg-gray-200 data-[state=active]:bg-gray-300"
					>
						{group.continent}
					</Trigger>
				{/each}
			</List>

			<!--Showroom (tab) content-->
			{#each groupedShowrooms() as group (group.continent)}
				<Content value={group.continent} class="py-4">
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
						{#each group.showrooms as showroom (showroom.country.name)}
							<div class="group relative h-[21.75rem] overflow-clip rounded-lg">
								<img
									src={`${showroom.image.url}`}
									alt={showroom.country.name}
									class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								/>
								<div
									class="absolute bottom-0 left-0 flex h-1/2 w-full flex-col justify-end gap-1 bg-gradient-to-t from-black/80 to-transparent px-4 py-3 font-semibold text-white"
								>
									<!-- Updated to display the country name as the showroom name -->
									<span class="text-lg">{showroom.country.name}</span>
								</div>
							</div>
						{/each}
					</div>
				</Content>
			{/each}
		</Root>
	{:else}
		<p class="text-center text-gray-500">No showrooms available at the moment</p>
	{/if}
</section>
