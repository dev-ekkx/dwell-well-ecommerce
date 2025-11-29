<script lang="ts">
	import { browser } from "$app/environment";
	import Button from "$lib/components/ui/button/button.svelte";
	import {
		Empty as CommandEmpty,
		Group as CommandGroup,
		Input as CommandInput,
		Item as CommandItem,
		List as CommandList,
		Root as CommandRoot
	} from "$lib/components/ui/command";
	import { Input } from "$lib/components/ui/input";
	import {
		InputOTP,
		InputOTPGroup,
		InputOTPSeparator,
		InputOTPSlot
	} from "$lib/components/ui/input-otp";
	import { Label } from "$lib/components/ui/label";
	import {
		Content as PopoverContent,
		Root as PopoverRoot,
		Trigger as PopoverTrigger
	} from "$lib/components/ui/popover";
	import type { CountryAndFlagI, UserCountryI } from "$lib/interfaces";
	import { userStore } from "$lib/store/user-store.svelte";
	import { cn } from "$lib/utils";
	import { CheckIcon, ChevronsUpDownIcon, Eye, EyeOff } from "@lucide/svelte/icons";
	import { REGEXP_ONLY_DIGITS_AND_CHARS } from "bits-ui";
	import { getContext, onMount, tick } from "svelte";
	import { z } from "zod";

	const { data } = $props();

	const authState = getContext<{
		form: Record<string, string>;
		errors: Record<string, string>;
	}>("authState");

	const userCountry = $derived(userStore.countryData as UserCountryI);

	let viewPassword = $state<Record<string, boolean>>({});
	let countries = $state<CountryAndFlagI[]>([]);
	let openCountryDropdown = $state(false);
	let countryValue = $derived(userCountry?.name ?? "");
	let triggerRef = $state<HTMLButtonElement>(null!);
	let email = $state("");
	const selectedCountry = $derived(countries.find((f) => f.name === countryValue));
	const formInputs = $derived(data.formInputs);

	$effect(() => {
		if (selectedCountry?.code) {
			authState.form.country = selectedCountry?.code;
		}
	});

	function handleBlur(field: string) {
		try {
			data.schema.parse(authState.form);
			authState.errors[field] = "";
		} catch (e) {
			if (e instanceof z.ZodError) {
				authState.errors[field] = "";

				const fieldIssues = e.issues.filter((i) => i.path[0] === field);

				if (fieldIssues.length > 0) {
					authState.errors[field] = fieldIssues[0].message;
				}
			} else {
				authState.errors[field] = "Invalid value";
			}
		}
	}

	function togglePassword(name: string) {
		viewPassword[name] = !viewPassword[name];
	}

	async function fetchCountries() {
		const res = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,cca2,idd");
		const data = (await res.json()) as {
			name: { common: string };
			cca2: string;
			flags: {
				alt: string;
				png: string;
				svg: string;
			};
			idd: {
				root: string;
				suffixes: string[];
			};
		}[];
		countries = data.map((country) => {
			const root = country.idd?.root || "";
			const suffixes = country.idd?.suffixes || [];

			let callingCode = "";

			// Handle calling code for North America
			if (root === "+1" && suffixes.length > 0) {
				const complexCodes = suffixes.map((suffix) => root + suffix);

				callingCode = complexCodes[0];
			} else if (root && suffixes.length === 1 && root !== "+1") {
				callingCode = root + suffixes[0];
			} else {
				callingCode = root;
			}

			return {
				name: country.name.common,
				code: country.cca2,
				flags: country.flags,
				callingCode: callingCode
			};
		});
	}

	function closeAndFocusTrigger() {
		openCountryDropdown = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}

	onMount(() => {
		if (data["route"] === "signup" && browser) {
			fetchCountries();
		}
		if (data["route"] === "otp" && browser) {
			const el = localStorage.getItem("email") ?? "";
			console.log(el);
		}
	});
	$inspect(authState.form);
</script>

<div class="mt-4 flex w-full flex-col gap-4">
	{#each formInputs as input (input)}
		<div class="relative flex w-full flex-col gap-1.5">
			<Label
				hidden={["country", "otp"].includes(input.name)}
				class={input.type === "tel" ? "-mt-4" : ""}
				for={input.name}>{input.label}</Label
			>
			{#if input.name === "country"}
				<Input
					hidden
					name={input.name}
					id={input.name}
					type={input.type}
					placeholder={input.placeholder}
					bind:value={authState.form[input.name]}
					onblur={() => handleBlur(input.name)}
					oninput={() => handleBlur(input.name)}
				/>
			{:else if input.type === "tel"}
				<div class="relative flex items-center gap-3">
					<PopoverRoot bind:open={openCountryDropdown}>
						<PopoverTrigger bind:ref={triggerRef}>
							{#snippet child({ props })}
								<Button
									{...props}
									variant="outline"
									class="w-max cursor-pointer justify-between"
									role="combobox"
									aria-expanded={openCountryDropdown}
								>
									<div class="flex items-center gap-2">
										<img
											class="h-6 w-7"
											src={selectedCountry?.flags.svg}
											alt={selectedCountry?.name}
										/>
										<span>{selectedCountry?.callingCode}</span>
									</div>
									<ChevronsUpDownIcon class="opacity-50" />
								</Button>
							{/snippet}
						</PopoverTrigger>
						<PopoverContent class="w-[200px] p-0">
							<CommandRoot>
								<CommandInput placeholder="Search..." />
								<CommandList>
									<CommandEmpty>No country found.</CommandEmpty>
									<CommandGroup>
										{#each countries as country (country.code)}
											<CommandItem
												class="cursor-pointer"
												value={country.name}
												onSelect={() => {
													countryValue = country.name;
													closeAndFocusTrigger();
												}}
											>
												<CheckIcon
													class={cn(countryValue !== country.name && "text-transparent")}
												/>
												<div class="flex items-center gap-2">
													<img class="h-6 w-7" src={country?.flags.svg} alt={country?.name} />
													<span>{country?.name}</span>
												</div>
											</CommandItem>
										{/each}
									</CommandGroup>
								</CommandList>
							</CommandRoot>
						</PopoverContent>
					</PopoverRoot>
					<Input
						name={input.name}
						id={input.name}
						type={input.type}
						placeholder={input.placeholder}
						bind:value={authState.form[input.name]}
						onblur={() => handleBlur(input.name)}
						oninput={() => handleBlur(input.name)}
					/>
				</div>
			{:else if input.name === "otp" && authState.form[input.name] !== undefined}
				<input hidden type="text" value={email} name="email" id="email" />
				<InputOTP
				bind:value={authState.form[input.name]}
				name={input.name}
				id={input.name}
					maxlength={6}
					pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
					onblur={() => handleBlur(input.name)}
					oninput={() => handleBlur(input.name)}
					class="flex justify-center"
				>
					{#snippet children({ cells })}
						<InputOTPGroup>
							{#each cells.slice(0, 3) as cell (cell)}
								<InputOTPSlot {cell} />
							{/each}
						</InputOTPGroup>
						<InputOTPSeparator />
						<InputOTPGroup>
							{#each cells.slice(3, 6) as cell (cell)}
								<InputOTPSlot {cell} />
							{/each}
						</InputOTPGroup>
					{/snippet}
				</InputOTP>
			{:else}
				<Input
					name={input.name}
					id={input.name}
					type={input.type === "password" && !viewPassword[input.name] ? "password" : "text"}
					placeholder={input.placeholder}
					bind:value={authState.form[input.name]}
					onblur={() => handleBlur(input.name)}
					oninput={() => handleBlur(input.name)}
				/>
			{/if}

			<!-- Show toggle buttons -->
			{#if input.type === "password"}
				<button
					onclick={() => togglePassword(input.name)}
					type="button"
					class="absolute top-3.5 right-1 translate-y-1/2 cursor-pointer text-muted-foreground"
				>
					{#if viewPassword[input.name]}
						<EyeOff />
					{:else}
						<Eye />
					{/if}
				</button>
			{/if}

			{#if authState.errors[input.name]}
				<p class="text-sm text-red-500">{authState.errors[input.name]}</p>
			{/if}
		</div>
	{/each}
</div>
