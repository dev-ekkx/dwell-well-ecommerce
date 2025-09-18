<script lang="ts">
	import Facebook from '$lib/assets/facebook.svg';
	import Instagram from '$lib/assets/instagram.svg';
	import Twitter from '$lib/assets/x.svg';
	import Linkedin from '$lib/assets/linkedin.svg';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button';
	import { footerLinks } from '$lib/constants';
	import { resolve } from '$app/paths';
	import type { RouteId } from '$app/types';

	const socials = [Facebook, Instagram, Twitter, Linkedin];

	const isExternal = (link: string) =>
		link.startsWith('http') ||
		link.startsWith('mailto:') ||
		link.startsWith('tel:');

	const routeLink = (link: string) => link as RouteId;
</script>

<footer class="flex flex-col bg-muted-foreground **:text-white pb-6 g-pt g-px g-mt gap-8 font-medium">

	<!--	Newsletter and footer links section-->
	<section class="flex flex-col">
		<div class="flex flex-col text-center md:text-left gap-2 lg:flex-row lg:justify-between lg:items-center">
			<div class="flex flex-col gap-4">
				<span class="font-semibold text-lg">Join our newsletter</span>
				<p class="max-w-lg">
					Sign up for exclusive deals, latest arrivals, and stylish home inspiration. Be the first to know about
					special
					offers and new collections
				</p>
			</div>

			<div class="flex flex-col gap-2">
				<div class="flex flex-col lg:flex-row gap-2 lg:items-center">
					<Input class="bg-transparent placeholder:text-white md:w-xs" placeholder="Enter your email" />
					<Button aria-label="subscribe"
									class="w-full bg-white text-black! hover:bg-white font-semibold cursor-pointer md:w-xs lg:w-max">
						Subscribe
					</Button>
				</div>
				<p class="text-sm">By subscribing you agree to with our <span class="underline">Privacy Policy</span></p>
			</div>
		</div>

		<!--		Footer links-->
		<div class="grid grid-cols-1 **:items-center sm:grid-cols-2 md:grid-cols-4 md:**:items-start mt-8 gap-8">
			{#each footerLinks as item (item.title)}
				<div class="flex flex-col gap-3">
					<span class="capitalize font-semibold">{item.title}</span>
					<div class="flex flex-col">
						{#each item.links as link (link.label)}
							{#if isExternal(link.link)}
								<a
									target="_blank"
									rel="noopener noreferrer"
									href={link.link}
								>
									{link.label}
								</a>
							{:else}
								<a class="py-2" href={resolve(routeLink(link.link))}>
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
		<span>&copy; {new Date().getFullYear()} DwellWell. All rights reserved</span>
		<div class="flex items-center gap-4">
			{#each socials as social (social)}
				<img class="w-5 h-5" src={social} alt={social}>
			{/each}
		</div>
	</section>
</footer>