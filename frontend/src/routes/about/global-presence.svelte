<script lang="ts">
	import MapComponent from '$lib/components/map.svelte';
	import type { PageProps } from './$types';

	const { globalPresenceData }: PageProps = $props();
</script>

<section class="g-mt-pt flex flex-col gap-6">
	<h4 class="text-section-head text-center">{globalPresenceData.title}</h4>
	<p class="text-section-p text-center">{globalPresenceData.description}</p>
	<MapComponent />
</section>