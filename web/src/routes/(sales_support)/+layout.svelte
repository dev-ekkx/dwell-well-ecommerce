<script lang="ts">
	import Header from "./header.svelte";
	import Sidebar from "./sidebar.svelte";
	const { children } = $props();
</script>

<div class="flex gap-4 bg-muted">
	<Sidebar />
	<div class="flex w-full flex-col">
		<Header />
		<main class="h-full overflow-y-auto border-2 border-red-600 p-4">
			{@render children()}
		</main>
	</div>
</div>
