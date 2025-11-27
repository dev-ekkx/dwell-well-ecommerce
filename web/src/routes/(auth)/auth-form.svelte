<script lang="ts">
	import { Label } from "$lib/components/ui/label";
	import { Input } from "$lib/components/ui/input";
	import { z } from "zod";
	import { getContext, onMount, tick } from "svelte";
	import { CheckIcon, ChevronsUpDownIcon, Eye, EyeOff } from "@lucide/svelte/icons";
	import { userStore } from "$lib/store/user-store.svelte";
	import { browser } from "$app/environment";
	import type { CountryAndFlagI, UserCountryI } from "$lib/interfaces";
	import {
		Root as PopoverRoot,
		Trigger as PopoverTrigger,
		Content as PopoverContent
	} from "$lib/components/ui/popover";
	import {
		Root as CommandRoot,
		Input as CommandInput,
		List as CommandList,
		Group as CommandGroup,
		Item as CommandItem,
		Empty as CommandEmpty
	} from "$lib/components/ui/command";
	import Button from "$lib/components/ui/button/button.svelte";
	import { cn } from "$lib/utils";

	const { data } = $props();

	const authState = getContext<{
		form: Record<string, string>;
		errors: Record<string, string>;
	}>("authState");

	const userCountry = $derived(userStore.countryData as UserCountryI);
	$inspect(userCountry);

	let viewPassword = $state<Record<string, boolean>>({});
	let countries = $state<CountryAndFlagI[]>([]);
    	let openCountryDropdown = $state(false);
	let countryValue = $state(userCountry.name);
	let triggerRef = $state<HTMLButtonElement>(null!);

	const selectedCountry = $derived(countries.find((f) => f.name === countryValue));


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
	});


</script>

<div class="mt-4 flex w-full flex-col gap-4">
	{#each data.formInputs as input (input)}
		<div class="relative flex w-full flex-col gap-1.5">
			<Label for={input.name}>{input.label}</Label>
			{#if input.type === "tel"}
				<div class="relative flex items-center gap-2">
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
                <div class="flex gap-2 items-center">
                  <img class="w-7 h-6" src={selectedCountry?.flags.svg} alt={selectedCountry?.name} />
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
												<CheckIcon class={cn(countryValue !== country.code && "text-transparent")} />
                                        <div class="flex gap-2 items-center">
                  <img class="w-7 h-6" src={country?.flags.svg} alt={country?.name} />
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
