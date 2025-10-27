<script lang="ts">
	import { Label } from "$lib/components/ui/label";
	import { Input } from "$lib/components/ui/input";
	import { z } from "zod";
	import { getContext } from "svelte";

	const { data } = $props();

	const authState = getContext<{
		form: Record<string, string>;
		errors: Record<string, string>;
	}>("authState");

	function handleBlur(field: string) {
		try {
			const fieldSchema = z.object({ [field]: data.schema.shape[field] });
			fieldSchema.parse({ [field]: authState.form[field] });
			authState.errors[field] = "";
		} catch (e) {
			if (e instanceof z.ZodError && e.issues.length > 0) {
				authState.errors[field] = e.issues[0].message;
			} else {
				authState.errors[field] = "Invalid value";
			}
		}
	}
</script>

<div class="mt-4 flex w-full flex-col gap-4">
	{#each data.formInputs as input (input)}
		<div class="flex w-full flex-col gap-1">
			<Label for={input.name}>{input.label}</Label>
			<Input
				id={input.name}
				type={input.type}
				placeholder={input.placeholder}
				bind:value={authState.form[input.name]}
				onblur={() => handleBlur(input.name)}
				oninput={() => handleBlur(input.name)}
			/>
			{#if authState.errors[input.name]}
				<p class="text-sm text-red-500">{authState.errors[input.name]}</p>
			{/if}
		</div>
	{/each}
</div>
