<script lang="ts">
	import type { LayoutProps } from './$types';
	import AuthBackground from '$lib/assets/images/auth-bg.webp';
	import { page } from '$app/state';
	import { useIsMobile } from '$lib/hooks/useIsMobile.svelte';
	import { cn } from '$lib/utils';
	import Logo from '$lib/components/logo.svelte';

	const { children }: LayoutProps = $props();
	const route = $derived(page.url.href.split('/').pop()) as 'login' | 'signup';
	const title = $derived(route === 'login' ? 'Login' : 'Create an Account');
	const description = $derived(route === 'login' ? 'Welcome back! Please enter your details to continue.' : 'Join us to enjoy personalized features.');
	const isMobile = useIsMobile();

</script>

<svelte:head>
	<title>DwellWell - {title}</title>
	<meta content={`DwellWell ${route} page` } />
</svelte:head>


<div class={cn('grid h-dvh', {
	'grid-cols-1 md:grid-cols-2': !isMobile(),
})}>
	<div class="flex items-center justify-center bg-white">
		<section class="flex flex-col gap-4 w-full border-4 items-center justify-center border-red-500 px-6 sm:max-w-xl">
			<Logo />
			<h2 class="auth-heading mt-1">{title}</h2>
			<p>{description}</p>
			{@render children()}
		</section>
	</div>
	<img alt="authentication" class={cn("object-cover", {
		"w-full h-full": !isMobile(),
		"w-0 h-0": isMobile(),
	})} src={AuthBackground}>
</div>