<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import HeaderComponent from '$lib/components/header.svelte';
	import FooterComponent from '$lib/components/footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link href={favicon} rel="icon" />
</svelte:head>

<!--Header component-->
<HeaderComponent />

<!--Main content (pages)-->
<div class="flex flex-col pt-[6.5rem] md:pt-[7rem] xl:pt-[8rem] g-px">
	<!--{@render children?.()}-->
</div>

<!--Footer component-->
<FooterComponent />