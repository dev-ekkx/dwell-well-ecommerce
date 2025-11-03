<script lang="ts">
    import {Input} from "$lib/components/ui/input/index.js";
    import {Button} from "$lib/components/ui/button";
    import {resolve} from "$app/paths";
    import type {RouteId} from "$app/types";
    import type {FooterI} from "$lib/interfaces";
    import {onMount} from "svelte";
    import {marked} from "marked";
    import DOMPurify from "dompurify";

    const { footer } = $props();
	const footerData = footer as FooterI;
	const socials = footerData.socialLinks;
	const columnLinks = footerData.linkColumns;

	let newsletterDisclaimer = $state("");
	const isExternal = (link: string) =>
		link.startsWith("http") || link.startsWith("mailto:") || link.startsWith("tel:");

	const routeLink = (link: string) => link as RouteId;

	onMount(() => {
		const rawHtml = marked(footerData.newsletterDisclaimer).toString();
		newsletterDisclaimer = DOMPurify.sanitize(rawHtml);
	});
</script>

<footer class="flex flex-col gap-8 bg-muted-foreground g-px g-pt pb-6 font-medium **:text-white">
	<!--	Newsletter and footer links section-->
	<section class="flex flex-col">
		<div
			class="flex flex-col gap-2 text-center md:text-left lg:flex-row lg:items-center lg:justify-between"
		>
			<div class="flex flex-col gap-4">
				<span class="text-lg font-semibold">{footerData.newsletterTitle}</span>
				<p class="max-w-lg">{footerData.newsletterDescription}</p>
			</div>

			<div class="flex flex-col gap-2">
				<div class="flex flex-col gap-2 lg:flex-row lg:items-center">
					<Input
						autofocus={false}
						class="border-border bg-transparent placeholder:text-white md:w-xs"
                        name="subscribe"
						placeholder="Enter your email"
					/>
					<Button
						aria-label="subscribe"
						class="w-full cursor-pointer bg-white font-semibold text-black! hover:bg-white md:w-xs lg:w-max"
					>
						Subscribe
					</Button>
				</div>
				<p class="text-sm">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html newsletterDisclaimer}
				</p>
			</div>
		</div>

		<!--		Footer links-->
		<div
			class="mt-8 grid grid-cols-1 gap-8 **:items-center sm:grid-cols-2 md:grid-cols-4 md:**:items-start"
		>
			{#each columnLinks as item (item.title)}
				<div class="flex flex-col gap-3">
					<span class="font-semibold capitalize">{item.title}</span>
					<div class="flex flex-col">
						{#each item.links as link (link.label)}
							{#if isExternal(link.url)}
								<a target="_blank" rel="noopener noreferrer" href={link.url}>
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
	<section class="flex flex-col items-center justify-center gap-4 lg:flex-row lg:justify-between">
		<span>&copy; {new Date().getFullYear()} {footerData.copyrightText}</span>
		<div class="flex items-center gap-4">
			{#each socials as social (social)}
				<img class="h-5 w-5" src={`${social.icon.url}`} alt={social.icon.alternativeText} />
			{/each}
		</div>
	</section>
</footer>
