<script lang="ts">
	import { page } from "$app/state";
	import { AvatarFallback, AvatarImage, Root as AvatarRoot } from "$lib/components/ui/avatar";
	import { createInitial } from "$lib/utils";
	import { BellIcon } from "@lucide/svelte";

	const userData = $derived(page.data.user);

$inspect(userData);
</script>

<header class="flex items-center justify-end h-[4.5rem] bg-white p-4">
    <div class="flex items-center gap-4">
        <button class="cursor-pointer bg-primary-foreground p-2 rounded-full relative">
            <BellIcon />
            <span class="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
        </button>

        	<AvatarRoot class="size-10">
					<AvatarImage src={userData?.image} alt={userData?.name} />
					<AvatarFallback class="w-full">{createInitial(userData?.name)}</AvatarFallback>
				</AvatarRoot>
    </div>

</header>