<script lang="ts">
    import {Input} from '$lib/components/ui/input/index.js';
    import {Button} from '$lib/components/ui/button';
    import type {RouteId} from '$app/types';
    // import {marked} from 'marked';
    // import DOMPurify from 'dompurify';
    import {renderRichText, storyblokEditable} from "@storyblok/svelte";
    import {resolve} from "$app/paths";

    const { blok } = $props();
	// const footerData = footer as FooterI;
	// const socials = footerData.socialLinks;
	// const columnLinks = footerData.linkColumns;

	// let newsletterDisclaimer = $state('');
	const isExternal = (link: string) =>
		link.startsWith('http') ||
		link.startsWith('mailto:') ||
		link.startsWith('tel:');

	const routeLink = (link: string) => link as RouteId;
    //
	// onMount(() => {
	// 	const rawHtml = marked(footerData.newsletterDisclaimer).toString();
	// 	// We no longer need the 'if (browser)' check because onMount guarantees it.
	// 	newsletterDisclaimer = DOMPurify.sanitize(rawHtml);
	// });

    const disclaimer = $derived(renderRichText(blok.content.privacy_policy))
    const socials = blok.content.social_media
const newsletter = blok.content.newsletter[0]
    const footerLinks = blok.content.footer_grid
    $inspect(blok.content)

</script>
{#key blok}
<footer class="flex flex-col bg-muted-foreground **:text-white pb-6 g-pt g-px gap-8 font-medium"  use:storyblokEditable={blok}>
	<!--	Newsletter and footer links section-->
	<section class="flex flex-col">
		<div class="flex flex-col text-center md:text-left gap-2 lg:flex-row lg:justify-between lg:items-center">
			<div class="flex flex-col gap-4">
				<span class="font-semibold text-lg">{newsletter.label}</span>
				<p class="max-w-lg">{newsletter.description}
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
					{@html disclaimer}</p>
			</div>
		</div>

		<!-- Footer links -->
		<div class="grid grid-cols-1 **:items-center sm:grid-cols-2 md:grid-cols-4 md:**:items-start mt-8 gap-8">
			{#each footerLinks as item (item.title)}
				<div class="flex flex-col gap-3">
					<span class="capitalize font-semibold">{item.title}</span>
					<div class="flex flex-col">
						{#each item.links as link (link.title)}
							{#if isExternal(link.route)}
								<a
									target="_blank"
									rel="noopener noreferrer"
									href={link.route}
								>
									{link.title}
								</a>
							{:else}
								<a class="py-2" href={resolve(routeLink(link.route))}>
									{link.title}
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
		<span>&copy; {new Date().getFullYear()} {blok.content.footer_copyright}</span>
		<div class="flex items-center gap-4">
			{#each socials as social (social)}
                <a href={social.link} target="_blank" rel="noopener noreferrer">
				<img class="w-5 h-5" src={`${social.icon.filename}`} alt={social.icon.alt}>
                </a>
			{/each}
		</div>
	</section>
</footer>
{/key}