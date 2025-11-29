<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import AuthBackground from "$lib/assets/images/auth-bg.webp";
	import Logo from "$lib/components/logo.svelte";
	import {
		Description as AlertDescription,
		Root as AlertRoot,
		Title as AlertTitle
	} from "$lib/components/ui/alert";
	import { Button } from "$lib/components/ui/button";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Label } from "$lib/components/ui/label";
	import { Spinner } from "$lib/components/ui/spinner";
	import type { AmplifyAuthResponseI } from "$lib/interfaces";
	import type { AuthType } from "$lib/types";
	import { cn } from "$lib/utils";
	import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";
	import type { ConfirmSignInOutput, ConfirmSignUpOutput, SignUpOutput } from "aws-amplify/auth";
	import { onMount, setContext } from "svelte";
	import { MediaQuery } from "svelte/reactivity";
	import type { LayoutProps } from "./$types";

	type Props = LayoutProps & {
		form: AmplifyAuthResponseI;
	};
	const { children, data, form }: Props = $props();

	const titleMap: Record<string, AuthType> = {
		Login: "login",
		"Reset Password": "reset_password",
		"Create an Account": "signup",
		"Verify OTP": "verify_otp"
	};

	const descriptionMap: Record<string, AuthType> = {
		"Welcome back! Please enter your details to continue.": "login",
		"Please enter your new password.": "reset_password",
		"Join us to enjoy personalized features.": "signup"
		// "Please enter the code sent to your email": "otp"
	};

	const route = $derived(data.route || "");
	const title = $derived(Object.entries(titleMap).find(([_, r]) => r === route)?.[0] || "Login");

	let otpResponseEmail = $state("");
	const description = $derived(() => {
		if (route === "verify_otp") {
			return `Please enter the one-time password (OTP) sent to ${otpResponseEmail}`;
		}
		const customDesc = Object.entries(descriptionMap).find(([_, r]) => r === route)?.[0];
		return customDesc || "Welcome back! Please enter your details to continue.";
	});

	const mediaQuery = new MediaQuery("max-width: 63.9rem");
	const isMobile = $derived(mediaQuery.current);

	// Form states
	let isLoading = $state(false);
	let isError = $state(false);
	let errorMessage = $state("");
	let oldPassword = $state("");
	let agreeToTermsAndConditions = $state(false);
	const authState = $state({
		form: Object.fromEntries(data.formInputs.map((f) => [f.name, ""])),
		errors: {} as Record<string, string>
	});
	setContext("authState", authState);

	// Handle form data
	$effect(() => {
		authState.form = Object.fromEntries(
			data.formInputs.map((f) => {
				if (route === "reset_password" && f.name === "oldPassword") {
					return [f.name, oldPassword];
				}
				return [f.name, ""];
			})
		);
		authState.errors = {};
	});

	// Check form validity
	const isFormValid = $derived(() => {
		const baseIsValid =
			Object.values(authState.form).every((item) => !!item) &&
			Object.values(authState.errors).every((item) => item.length < 1);

		if (route !== "signup") {
			return baseIsValid;
		}
		return baseIsValid && agreeToTermsAndConditions;
	});

	$effect(() => {
		// Handle form errors
		if (form?.error) {
			handleError();
		}

		if (route === "login") {
			handleLoginSteps();
		}
		if (route === "signup") {
			if (authState.form.email) {
				sessionStorage.setItem("email", authState.form.email);
			}
			handleSignUpSteps();
		}

		if (route === "reset_password") {
			if (!form?.authResponse) return;
			const { authResponse, userAuth } = form;
			const res = authResponse as ConfirmSignInOutput;
			if (res.nextStep.signInStep === "DONE") {
				if (userAuth?.user?.role === "customer") {
					goto("/");
				} else {
					goto("/admin");
				}
			}
		}

		if (route === "verify_otp") {
			if (!form?.authResponse) return;
			const { authResponse } = form;
			const res = authResponse as ConfirmSignUpOutput;
			if (res.nextStep.signUpStep === "DONE") {
				goto("/login");
			}
		}
	});

	const handleLoginSteps = () => {
		if (!form?.authResponse) return;
		const { oldPassword: password, authResponse } = form;
		const loginRes = authResponse as ConfirmSignInOutput;
		const signUpRes = authResponse as ConfirmSignUpOutput;
		if (loginRes.nextStep?.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
			oldPassword = password ?? "";
			cookieStore.set("oldPassword", oldPassword);
			goto("/reset_password");
		}

		if (loginRes.nextStep.signInStep === "DONE" || signUpRes.nextStep.signUpStep === "DONE") {
			// if (userAuth && userAuth.auth.tokenExpiry > 0) {
			// 	userStore.updateUserStore(userAuth);
			// 	isLoading = true;
			// 	goto("/").then(() => (isLoading = false));
			// }
			handleNavigate();
		}
	};

	const handleSignUpSteps = async () => {
		if (!form?.authResponse) return;
		const { authResponse } = form;
		console.log(authResponse);
		const res = authResponse as SignUpOutput;
		if (res.nextStep.signUpStep === "CONFIRM_SIGN_UP") {
			otpResponseEmail = res.nextStep.codeDeliveryDetails.destination ?? "";
			await cookieStore.set("otpEmail", otpResponseEmail);
			goto("/verify_otp");
		}

		if (res.nextStep.signUpStep === "DONE") {
			handleNavigate();
		}
	};

	const handleNavigate = () => {
		if (!form?.userAuth) return;
		const { userAuth } = form;
		// userStore.updateUserStore(userAuth);
		isLoading = true;

		const redirecTo = page.url.searchParams.get("redirectTo") ?? (userAuth?.user?.role === "customer" ? "/" : "/products");


		goto(redirecTo).then(() => (isLoading = false));
		// if (userAuth?.user?.role === "customer") {
		// 	goto(redirecTo).then(() => (isLoading = false));
		// } else {
		// 	goto("/admin").then(() => (isLoading = false));
		// }
	};

	const handleError = () => {
		isError = true;
		errorMessage = form.error ?? "";

		const timer = setTimeout(() => {
			isError = false;
		}, 5000);

		return () => clearTimeout(timer);
	};

	onMount(async () => {
		if (route === "reset_password") {
			const oldP = await cookieStore.get("oldPassword");
			oldPassword = oldP?.value ?? "";
		}

		if (route === "verify_otp") {
			const otpEmail = await cookieStore.get("otpEmail");
			otpResponseEmail = otpEmail?.value ?? "";
		}
	});
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
			use:enhance={() => {
				isLoading = true;
				return async ({ update }) => {
					await update();
					isLoading = false;
				};
			}}
		>
			<Logo />
			<h2 class="mt-1 auth-heading">{title}</h2>
			<p>{description()}</p>

			<!-- Alert component -->
			{#if isError}
				<AlertRoot variant="destructive">
					<CheckCircle2Icon class="size-4" />
					<AlertTitle class="font-semibold capitalize">{title} Error</AlertTitle>
					<AlertDescription>{errorMessage}</AlertDescription>
				</AlertRoot>
			{/if}

			<!-- Form content -->
			{@render children()}

			<!-- Forgot password, terms & conditions, and privacy policy -->
			{#if route === "login"}
				<a class="flex self-start text-primary underline" href="/login">Forgot password</a>
			{/if}
			{#if route === "signup"}
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
			<Button
				class="mt-8 w-full cursor-pointer"
				disabled={!isFormValid() || isLoading}
				type="submit"
			>
				{#if isLoading}
					<Spinner />
				{/if}
				{title}
			</Button>

			{#if route === "login"}
				<Label
					>Don’t have an account yet?<a class="text-primary underline" href="/signup"
						>Create an account</a
					></Label
				>
			{/if}
			{#if ["signup", "reset_password", "verify_otp"].includes(route)}
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
