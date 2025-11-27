<script lang="ts">
    import {Label} from "$lib/components/ui/label";
    import {Input} from "$lib/components/ui/input";
    import {z} from "zod";
    import {getContext, onMount} from "svelte";
    import {Eye, EyeOff} from "@lucide/svelte/icons";
    import {userStore} from "$lib/store/user-store.svelte";
    import {browser} from "$app/environment";
    import type {CountryAndFlagI, UserCountryI} from "$lib/interfaces";

    const { data } = $props();

	const authState = getContext<{
		form: Record<string, string>;
		errors: Record<string, string>;
	}>("authState");

    const userCountry = $derived(userStore.countryData as UserCountryI)
    $inspect(userCountry);

	let viewPassword = $state<Record<string, boolean>>({});
    let countries = $state<CountryAndFlagI[]>([])

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

  async  function fetchCountries(){
       const res = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,cca2")
      const data = await res.json() as {
           name: {common: string},
           cca2: string,
          flags: {
               alt: string;
               png: string;
               svg: string
          }
      }[]
       countries = data.map((country) => {
            return {
                name: country.name.common,
                code: country.cca2,
                flags: country.flags
            }
       })


      console.log(countries)
      const userCountryData = countries.find(country => country.code === userCountry["country"])
      console.log(userCountryData)
    }


    onMount(() => {
        if (data["route"] === "signup" && browser) {
            fetchCountries()
        }
    })

</script>

<div class="mt-4 flex w-full flex-col gap-4">
	{#each data.formInputs as input (input)}
		<div class="relative flex w-full flex-col gap-1.5">
			<Label for={input.name}>{input.label}</Label>
            <div class="flex items-center gap-2">

            </div>
			<Input
				name={input.name}
				id={input.name}
				type={input.type === "password" && !viewPassword[input.name] ? "password" : "text"}
				placeholder={input.placeholder}
				bind:value={authState.form[input.name]}
				onblur={() => handleBlur(input.name)}
				oninput={() => handleBlur(input.name)}
			/>
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
