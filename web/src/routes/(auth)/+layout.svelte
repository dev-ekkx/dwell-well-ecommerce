<script lang="ts">
    import type {LayoutProps} from "./$types";
    import AuthBackground from "$lib/assets/images/auth-bg.webp";
    import {page} from "$app/state";
    import {cn} from "$lib/utils";
    import Logo from "$lib/components/logo.svelte";
    import {Checkbox} from "$lib/components/ui/checkbox";
    import {Label} from "$lib/components/ui/label";
    import {setContext} from "svelte";
    import {MediaQuery} from "svelte/reactivity";
    import {Button} from "$lib/components/ui/button";
    import {deserialize} from '$app/forms';


    const { children, data }: LayoutProps = $props();

    const route = $derived(page.url.pathname.endsWith('/login') ? 'login' : 'signup'
    );
    const title = $derived(route === "login" ? "Login" : "Create an Account");
	const description = $derived(
		route === "login"
			? "Welcome back! Please enter your details to continue."
			: "Join us to enjoy personalized features."
	);

	const mediaQuery = new MediaQuery("max-width: 63.9rem");
	const isMobile = $derived(mediaQuery.current);

	let agreeToTermsAndConditions = $state(false);

	const authState = $state({
		form: Object.fromEntries(data.formInputs.map((f) => [f.name, ""])),
		errors: {} as Record<string, string>
	});
	setContext("authState", authState);
    let isLoading = $state(false);
    let successMessage = '';
    let errorMessage = '';

	$effect(() => {
		authState.form = Object.fromEntries(data.formInputs.map((f) => [f.name, ""]));
		authState.errors = {};
	});

	const isFormValid = $derived(() => {
		const baseIsValid =
			Object.values(authState.form).every((item) => !!item) &&
			Object.values(authState.errors).every((item) => item.length < 1);

		if (route === "login") {
			return baseIsValid;
		}

		return baseIsValid && agreeToTermsAndConditions;
	});

    async function handleSubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement}) {
        event.preventDefault();
        const data = new FormData(event.currentTarget, event.submitter);


        const response = await fetch(event.currentTarget.action, {
            method: 'POST',
            body: data
        });

        console.log("response: ", response)

        const result: ActionResult = deserialize(await response.text());

        console.log("result: ", result);
        if (result.type === 'success') {
            // rerun all `load` functions, following the successful update
            // await invalidateAll();
            console.log("success: ", result);
        }

        // applyAction(result);
    }

</script>

<svelte:head>
	<title>DwellWell - {title}</title>
	<meta content={`DwellWell ${route} page`} />
</svelte:head>

<div
	class={cn("grid h-screen overflow-y-clip", {
		"grid-cols-1 md:grid-cols-2": !isMobile
	})}
>
	<div class="flex h-screen items-center justify-center bg-white">
		<form
                class="flex h-full w-full flex-col items-center justify-center gap-4 px-6 sm:max-w-xl"
			method="POST"
                onsubmit={handleSubmit}
        >
<!--                use:enhance={customEnhance}>-->
<!--			onsubmit={handleSubmit}-->
			<!--	Form logo, title, and description-->
			<Logo />
			<h2 class="mt-1 auth-heading">{title}</h2>
			<p>{description}</p>

			<!-- Form content -->
			{@render children()}

			<!-- Forgot password, terms & conditions, and privacy policy -->
			{#if route === "login"}
				<a class="flex self-start text-primary underline" href="/login">Forgot password</a>
			{:else}
				<div class="item-center flex gap-1 self-start">
					<Checkbox bind:checked={agreeToTermsAndConditions} class="cursor-pointer" id="terms" />
					<Label class="line-clamp-3 cursor-pointer" for="terms">
						I have read and agree to the <a
							class="text-primary underline"
							href="/terms-and-conditions">Terms & Conditions</a
						>
						and <a class="text-primary underline" href="/privacy-policy">Privacy Policy</a>
					</Label>
				</div>
			{/if}

			<!-- Login or create an account -->
			<Button class="mt-10 w-full cursor-pointer" disabled={!isFormValid()} type="submit"
				>{route === "login" ? "Login" : "Create an account"}</Button
			>

            {#if route === "login"}
				<Label
					>Don’t have an account yet?<a class="text-primary underline" href="/signup"
						>Create an account</a
					></Label
				>
			{:else}
				<Label
					>Already have an account?<a class="text-primary underline" href="/login">Login</a></Label
				>
			{/if}
		</form>
	</div>
	<div class="h-full">
		<img
			alt="authentication"
			class={cn("object-cover object-bottom", {
				"h-screen w-full": !isMobile,
				"h-0 w-0": isMobile
			})}
			src={AuthBackground}
		/>
	</div>
</div>
