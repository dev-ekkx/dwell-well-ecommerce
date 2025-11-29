<script lang="ts">
	import Header from "./header.svelte";
	import Sidebar from "./sidebar.svelte";
	const { children } = $props();
</script>

<div class="flex gap-4 bg-muted">
	<Sidebar />
	<div class="flex flex-col w-full">
        <Header />
		<main>
			{@render children()}
		</main>
	</div>
</div>
