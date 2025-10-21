<script lang="ts">
	import { Content, List, Root, Trigger } from '$lib/components/ui/tabs/index';
	import type { ShowroomI } from '$lib/interfaces';
	import { SvelteMap } from 'svelte/reactivity';


	const { showroomData } = $props();
	const showrooms: ShowroomI[] = showroomData.showrooms || [];
	const cmsBaseUrl = import.meta.env.VITE_CMS_URL;


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

<section class="g-px g-mt-pt flex flex-col gap-6">
	<h4 class="text-center text-section-head">{showroomData.title}</h4>
	<p class="text-section-p text-center">{showroomData.description}</p>


	<!--Showrooms tabs -->
	{#if groupedShowrooms().length > 0}
		<Root class="w-full mt-4" value={groupedShowrooms()[0].continent}>
			<!--Showroom (tab) list and triggers-->
			<List
				class="flex w-full max-w-2xl overflow-x-auto gap-4 justify-baseline h-max scrollbar-hidden"
			>
				{#each groupedShowrooms() as group (group.continent)}
					<Trigger value={group.continent}
									 class="capitalize px-4 py-2 rounded-md hover:bg-gray-200 data-[state=active]:bg-gray-300 transition-colors">
						{group.continent}
					</Trigger>
				{/each}
			</List>

			<!--Showroom (tab) content-->
			{#each groupedShowrooms() as group (group.continent)}
				<Content value={group.continent} class="py-4">
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{#each group.showrooms as showroom (showroom.country.name)}
							<div class="rounded-lg h-[21.75rem] relative overflow-clip group">
								<img
									src={`${cmsBaseUrl}${showroom.image.url}`}
									alt={showroom.country.name}
									class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
								/>
								<div
									class="absolute flex flex-col font-semibold text-white justify-end px-4 py-3 gap-1 bg-gradient-to-t from-black/80 to-transparent bottom-0 left-0 w-full h-1/2"
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
		<p class="text-center text-gray-500">No showrooms available at the moment </p>
	{/if}
</section>