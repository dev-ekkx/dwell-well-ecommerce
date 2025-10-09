<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { z } from 'zod';

	const { data } = $props();

	let form = $state(Object.fromEntries(data.formInputs.map((f) => [f.name, ''])));
	let errors = $state<Record<string, string>>({});

	function handleBlur(field: string) {
		try {
			const fieldSchema = z.object({ [field]: data.schema.shape[field] });
			fieldSchema.parse({ [field]: form[field] });
			errors[field] = '';
		} catch (e) {
			if (e instanceof z.ZodError && e.issues.length > 0) {
				errors[field] = e.issues[0].message;
			} else {
				errors[field] = 'Invalid value';
			}
		}
	}


	function validateForm() {
		try {
			data.schema.parse(form);
			errors = {};
			console.log('✅ Form valid:', form);
		} catch (e) {
			if (e instanceof z.ZodError) {
				errors = Object.fromEntries(e.errors.map((err) => [err.path[0], err.message]));
			}
		}
	}
</script>


<form class="w-full flex flex-col gap-4 mt-4" on:submit|preventDefault>
	{#each data.formInputs as input(input)}
		<div class="flex flex-col gap-1 w-full">
			<Label for={input.name}>{input.label}</Label>
			<Input
				id={input.name}
				type={input.type}
				placeholder={input.placeholder}
				bind:value={form[input.name]}
				onblur={() => handleBlur(input.name)}
				oninput={() => handleBlur(input.name)}
			/>
			{#if errors[input.name]}
				<p class="text-red-500 text-sm">{errors[input.name]}</p>
			{/if}
		</div>
	{/each}
</form>