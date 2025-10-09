<script lang="ts">
	import type { LayoutProps } from './$types';
	import AuthBackground from '$lib/assets/images/auth-bg.webp';
	import { page } from '$app/state';
	import { useIsMobile } from '$lib/hooks/useIsMobile.svelte';
	import { cn } from '$lib/utils';
	import Logo from '$lib/components/logo.svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';

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


<div class={cn('grid h-screen overflow-y-clip', {
	'grid-cols-1 md:grid-cols-2': !isMobile(),
})}>
	<div class="flex items-center justify-center bg-white h-full">
		<section class="flex flex-col gap-4 w-full items-center justify-center px-6 sm:max-w-xl">
			<!--	Form logo, title, and description-->
			<Logo />
			<h2 class="auth-heading mt-1">{title}</h2>
			<p>{description}</p>

			<!-- Form content -->
			{@render children()}

			<!-- Forgot password, terms & conditions, and privacy policy -->
			{#if route === "login"}
				<a class="underline text-primary flex self-start" href="forgot-password">Forgot password</a>
			{:else}
				<div class="flex item-center gap-1 self-start">
					<Checkbox id="terms" />
					<Label class="cursor-pointer line-clamp-3" for="terms">
						I have read and agree to the <a class="text-primary underline" href="/terms-and-conditions">Terms &
						Conditions</a> and <a class="text-primary underline" href="/privacy-policy">Privacy Policy</a>
					</Label>
				</div>
			{/if}

			<!-- Login or create an account -->
			<Button class="w-full mt-10">{route === "login" ? "Login" : "Create an account"}</Button>
			{#if route === "login"}
				<Label>Don’t have an account yet?<a class="underline text-primary" href="/signup">Create an account</a></Label>
			{:else}
				<Label>Already have an account?<a class="underline text-primary" href="/login">Login</a></Label>
			{/if}
		</section>
	</div>
	<div class="h-full">
		<img alt="authentication"
				 class={cn("object-cover object-bottom", {
		"w-full h-screen": !isMobile(),
		"w-0 h-0": isMobile(),
	})}
				 src={AuthBackground} />
	</div>
</div>