<script lang="ts">
    import {X} from "@lucide/svelte/icons";
    import GooglePartnerLogo from "$lib/assets/google_partner.svg";
    import {Button} from "$lib/components/ui/button";
    import {Checkbox} from "$lib/components/ui/checkbox";
    import {Label} from "$lib/components/ui/label";
    import {browser} from "$app/environment";

    let {displayCookieBanner = $bindable(false)} = $props()

    const cookies: {
		value: string;
		label: string;
	}[] = [
		{
			label: "Test Strict",
			value: "test"
		},
		{
			label: "Performance",
			value: "performance"
		},
		{
			label: "Targeting",
			value: "targeting"
		},
		{
			label: "Functionality",
			value: "functionality"
		},
		{
			label: "Unclassified",
			value: "unclassified"
		}
	];

    let showCookies = $state(false)
    const localStoredCookieTypes = browser ? JSON.parse(localStorage.getItem("cookieTypes") as string) as string[] : undefined
    let selectedCookies = $state( localStoredCookieTypes ?? ["test"])


    const handleCookies = () => {
        if (showCookies) {
            displayCookieBanner = false
        }
            showCookies = !showCookies;
    }

    const handleCheckboxChange = (value: string) => {
        let newSelected: string[];
        const isChecked = selectedCookies.includes(value);
        if (isChecked) {
            newSelected = selectedCookies.filter((s) => s !== value);
        } else {
            newSelected = [...selectedCookies, value];
        }
        selectedCookies = newSelected;
    }

    const rejectCookies = () => {
        displayCookieBanner = false
        localStorage.setItem("cookieTypes", JSON.stringify(["test"]));
    }
</script>

<div
	class="group fixed top-0 left-0 z-[60] h-screen w-full overflow-hidden"
>
    <div class="h-[7.5vh] w-full"></div>

	<!-- Banner content -->
	<div
		class="relative flex h-max w-full flex-col gap-6 bg-muted g-px py-7 shadow-lg"
	>
		<button
                class="absolute right-0 g-mx cursor-pointer"
                onclick={() => displayCookieBanner = false}
        >
			<X class="scale-125 transform" />
		</button>

		<div class="flex flex-col gap-6 md:flex-row md:items-start">
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

				<!-- Cookie types -->
                {#if showCookies}
                <div class="flex flex-col gap-4">
                    {#each cookies as cookie(cookie.value)}
                        {@const checked = selectedCookies.includes(cookie.value)}
                            <Label for={cookie.value}  class="flex items-start gap-2 cursor-pointer disabled:cursor-default">
                            <Checkbox
                                    disabled={cookie.value === "test"}
                                    {checked}
                                    id={cookie.value}
                                    value={cookie.value}
                                    onCheckedChange={() => handleCheckboxChange(cookie.value)}
                            />
                            <span>
                                {cookie.label}
                            </span>
                            </Label>
                        {/each}
                </div>
                {/if}

				<!-- Action buttons -->
				<div class="flex flex-col gap-4 md:flex-row **:pointer-events-">
					<Button class="cursor-pointer" onclick={handleCookies}> {showCookies ? "Save and Close" : "Customize settings"}</Button>
					<Button
						class="cursor-pointer text-primary hover:bg-white hover:text-primary hover:opacity-80"
						onclick={rejectCookies}
                        variant="outline"
                    >Reject all</Button
					>
				</div>
			</section>
		</div>
	</div>
</div>
