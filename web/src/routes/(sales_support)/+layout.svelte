<script lang="ts">
	import Header from "./header.svelte";
	import Sidebar from "./sidebar.svelte";
	const { children } = $props();
</script>

<div class="flex gap-4 bg-muted">
	<Sidebar />
	<div class="flex w-full flex-col">
		<Header />
		<main class="border-2 border-red-600 p-4 h-full overflow-y-auto">
			{@render children()}
		</main>
	</div>
</div>
