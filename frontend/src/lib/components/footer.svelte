<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button';
	import { resolve } from '$app/paths';
	import type { RouteId } from '$app/types';
	import type { FooterI } from '$lib/interfaces';
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';

	const cmsBaseUrl = import.meta.env.VITE_CMS_URL;

	const { footer } = $props();
	const footerData = footer as FooterI;
	const socials = footerData.socialLinks;
	const columnLinks = footerData.linkColumns;

	let newsletterDisclaimer = $state('');
	const isExternal = (link: string) =>
		link.startsWith('http') ||
		link.startsWith('mailto:') ||
		link.startsWith('tel:');

	const routeLink = (link: string) => link as RouteId;

	onMount(() => {
		const rawHtml = marked(footerData.newsletterDisclaimer).toString();
		// We no longer need the 'if (browser)' check because onMount guarantees it.
		newsletterDisclaimer = DOMPurify.sanitize(rawHtml);
	});

</script>

<footer class="flex flex-col bg-muted-foreground **:text-white pb-6 g-pt g-px gap-8 font-medium">
	<!--	Newsletter and footer links section-->
	<section class="flex flex-col">
		<div class="flex flex-col text-center md:text-left gap-2 lg:flex-row lg:justify-between lg:items-center">
			<div class="flex flex-col gap-4">
				<span class="font-semibold text-lg">{footerData.newsletterTitle}</span>
				<p class="max-w-lg">{footerData.newsletterDescription}
				</p>
			</div>

			<div class="flex flex-col gap-2">
				<div class="flex flex-col lg:flex-row gap-2 lg:items-center">
					<Input class="bg-transparent border-border placeholder:text-white md:w-xs" name="subscribe"
								 placeholder="Enter your email" />
					<Button aria-label="subscribe"
									class="w-full bg-white text-black! hover:bg-white font-semibold cursor-pointer md:w-xs lg:w-max">
						Subscribe
					</Button>
				</div>
				<p class="text-sm">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html newsletterDisclaimer}</p>
			</div>
		</div>

		<!--		Footer links-->
		<div class="grid grid-cols-1 **:items-center sm:grid-cols-2 md:grid-cols-4 md:**:items-start mt-8 gap-8">
			{#each columnLinks as item (item.title)}
				<div class="flex flex-col gap-3">
					<span class="capitalize font-semibold">{item.title}</span>
					<div class="flex flex-col">
						{#each item.links as link (link.label)}
							{#if isExternal(link.url)}
								<a
									target="_blank"
									rel="noopener noreferrer"
									href={link.url}
								>
									{link.label}
								</a>
							{:else}
								<a class="py-2" href={resolve(routeLink(link.url))}>
									{link.label}
								</a>
							{/if}
						{/each}

					</div>
				</div>
			{/each}
		</div>
	</section>

	<hr />

	<!--	Copyright and socials section-->
	<section class="flex flex-col gap-4 items-center justify-center lg:flex-row lg:justify-between">
		<span>&copy; {new Date().getFullYear()} {footerData.copyrightText}</span>
		<div class="flex items-center gap-4">
			{#each socials as social (social)}
				<img class="w-5 h-5" src={`${cmsBaseUrl}${social.icon.url}`} alt={social.icon.alternativeText}>
			{/each}
		</div>
	</section>
</footer>