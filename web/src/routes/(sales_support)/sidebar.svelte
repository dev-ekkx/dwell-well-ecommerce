<script lang="ts">
	import { enhance } from "$app/forms";
	import { invalidateAll } from "$app/navigation";
	import { page } from "$app/state";
	import ColapseIcon from "$lib/assets/collapse.svg";
	import Logo from "$lib/components/logo.svelte";
	import { cn } from "$lib/utils";
	import {
		BookA,
		Gift,
		LucideLogOut,
		LucideMessagesSquare,
		LucideSettings,
		Package,
		ShoppingBag,
		type IconProps
	} from "@lucide/svelte";
	import type { SubmitFunction } from "@sveltejs/kit";
	import type { Component } from "svelte";


    interface ListItemI {
        label: string;
        route: string;
        icon: Component<IconProps, {}, "">;
    }

	const sidebarItems: ListItemI[] = [
		{
			label: "Products",
			route: "/products",
			icon: Package
		},
		{
			label: "Orders",
			route: "/orders",
			icon: ShoppingBag
		},
		{
			label: "Promotions",
			route: "/promotions",
			icon: Gift
		},
		{
			label: "Messages",
			route: "/messages",
			icon: LucideMessagesSquare
		},
		{
			label: "Reports",
			route: "/reports",
			icon: BookA
		}
	];

	const settingsAndLogOut = [
		{
			label: "Settings",
			route: "/settings",
			icon: LucideSettings
		},
		{
			label: "Log out",
			route: "/logout",
			icon: LucideLogOut
		}
	];

	const isActive = (route: string) => {
		return page?.route?.id?.includes(route);
	};

    	const logoutEnhance: SubmitFunction = () => {
		return async ({ result, update }) => {
			await update();
			if (result.type === "redirect") {
				await invalidateAll();
			}
		};
	};

</script>

<aside class="border-border-red-600 flex h-screen w-[15rem] flex-col justify-between bg-white p-4">
	<div class="flex flex-col gap-10">
		<div class="flex items-center justify-between gap-4">
			<Logo />
			<button class="cursor-pointer">
				<img src={ColapseIcon} alt="colapse" />
			</button>
		</div>

		<div class="flex flex-col gap-2">
			{#each sidebarItems as item}
				{@render listItem(item)}
			{/each}
		</div>
	</div>

	<div class="flex flex-col gap-2">
		{#each settingsAndLogOut as item}
			{@render listItem(item)}
		{/each}
	</div>
</aside>

{#snippet listItem(item: ListItemI)}
{#if item.route === "/logout"}
	<form method="POST" use:enhance={logoutEnhance} action={item.route}>
		<button class="cursor-pointer   w-full flex items-center gap-3 rounded-md p-2 font-medium text-muted-foreground transition-all duration-200 ease-linear hover:bg-primary-foreground" type="submit">
            <item.icon />    
            {item.label}
        </button>
	</form>
{:else}
	<a
		href={item.route}
		class={cn(
			"flex items-center gap-3 rounded-md p-2 font-medium text-muted-foreground transition-all duration-200 ease-linear hover:bg-primary-foreground",
			{
				"bg-primary-foreground text-primary": isActive(item.route)
			}
		)}
	>
		<item.icon />
		{item.label}
	</a>
{/if}
{/snippet}
