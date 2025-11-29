<script lang="ts">
	import Sidebar from "./sidebar.svelte";
	const { children } = $props();
</script>

<div class="flex gap-4 bg-muted">
	<Sidebar />
	<div class="flex flex-col">
		<main>
			{@render children()}
		</main>
	</div>
</div>
