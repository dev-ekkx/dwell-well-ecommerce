<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import HeaderComponent from '$lib/components/header.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link href={favicon} rel="icon" />
</svelte:head>

<HeaderComponent />
<div class="flex flex-col pt-[6.5rem] md:pt-[7rem] xl:pt-[8rem] g-px">
	{@render children?.()}
</div>
