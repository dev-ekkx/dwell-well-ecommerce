<script lang="ts">
    import {X} from "@lucide/svelte/icons";
    import GooglePartnerLogo from "$lib/assets/google_partner.svg";
    import {Button} from "$lib/components/ui/button";
</script>

<div
	class="**pointer-events-none** fixed inset-0 top-0 left-0 z-20 h-screen w-full overflow-hidden"
>
	<!-- Banner content -->
	<div
		class="pointer-events-auto relative mt-[7.5vh] flex h-max w-full flex-col gap-6 bg-muted g-px py-7 shadow-lg"
	>
		<button class="absolute right-0 g-mx cursor-pointer">
			<X class="scale-125 transform" />
		</button>

		<div class="flex flex-col gap-6 md:flex-row">
			<img alt="google partner" class="aspect-square w-[5.6rem]" src={GooglePartnerLogo} />

			<!-- Text and buttons section -->
			<section class="flex flex-col gap-6">
				<!-- Heading and paragraph -->
				<div class="flex flex-col gap-4">
					<h6 class="text-section-head font-bold">We value your privacy</h6>
					<p class="text-section-p p-0">
						This website uses cookies to personalize content, provide social media features, and
						analyse our traffic. You can customize your preferences or reject all.
					</p>
				</div>

				<!-- Action buttons -->
				<div class="flex flex-col gap-4 md:flex-row">
					<Button class="cursor-pointer">Customize settings</Button>
					<Button
						class="cursor-pointer text-primary hover:bg-white hover:text-primary hover:opacity-80"
						variant="outline">Reject all</Button
					>
				</div>
			</section>
		</div>
	</div>
</div>
