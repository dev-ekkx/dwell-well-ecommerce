<script lang="ts">
	import MapComponent from "$lib/components/map.svelte";
	import type { GlobalPresenceI } from "$lib/interfaces";

	const { globalPresenceData }: { globalPresenceData: GlobalPresenceI } = $props();
</script>

<section class="g-mt-pt flex flex-col gap-6">
	<h4 class="text-center text-section-head">{globalPresenceData.title}</h4>
	<p class="text-section-p text-center">{globalPresenceData.description}</p>
	<MapComponent />
</section>
