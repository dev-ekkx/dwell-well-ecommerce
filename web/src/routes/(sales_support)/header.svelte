<script lang="ts">
	import { page } from "$app/state";
	import { AvatarFallback, AvatarImage, Root as AvatarRoot } from "$lib/components/ui/avatar";
	import { createInitial } from "$lib/utils";
	import { BellIcon } from "@lucide/svelte";

	const userData = $derived(page.data.user);

	$inspect(userData);
</script>

<header class="flex h-[4.5rem] items-center justify-end bg-white p-4">
	<div class="flex items-center gap-4">
		<button class="relative cursor-pointer rounded-full bg-primary-foreground p-2">
			<BellIcon />
			<span class="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
		</button>

		<AvatarRoot class="size-10">
			<AvatarImage src={userData?.image} alt={userData?.name} />
			<AvatarFallback class="w-full">{createInitial(userData?.name)}</AvatarFallback>
		</AvatarRoot>
	</div>
</header>
