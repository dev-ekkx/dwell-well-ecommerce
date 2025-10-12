<script lang="ts">
	import { useSearchAndFilter } from '$lib/store/search-and-filter.svelte';

	const { getSearchTerm } = useSearchAndFilter();
</script>


<section class="g-px">
	fdf
	{getSearchTerm()}
</section>

