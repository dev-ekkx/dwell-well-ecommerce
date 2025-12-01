<script lang="ts">
	import Header from "./header.svelte";
	import Sidebar from "./sidebar.svelte";
	const { children } = $props();
</script>

<div class="flex bg-muted">
	<Sidebar />
	<div class="flex w-full flex-col">
		<Header />
		<main class="h-full overflow-y-auto px-4 py-6">
			{@render children()}
		</main>
	</div>
</div>
