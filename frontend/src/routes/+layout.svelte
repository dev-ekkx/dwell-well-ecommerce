<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import HeaderComponent from '$lib/components/header.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link href={favicon} rel="icon" />
</svelte:head>

<div class="flex flex-col pt-[8rem]">
	<HeaderComponent />
	{@render children?.()}
</div>
