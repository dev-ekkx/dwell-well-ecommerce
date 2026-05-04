<script lang="ts">
	import { browser } from "$app/environment";
	import {
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		Root as CardRoot,
		CardTitle
	} from "$lib/components/ui/card";
	import { Skeleton } from "$lib/components/ui/skeleton";
</script>

{#if browser}
	<section class="grid grid-cols-4 gap-4">
		{#each Array(4) as _}
			<CardRoot>
				<CardHeader>
					<CardTitle>
						<Skeleton class="h-5 w-32 rounded bg-gray-300"></Skeleton>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Skeleton class="h-8 w-10 rounded bg-gray-300"></Skeleton>
				</CardContent>
				<CardFooter>
					<CardDescription>
						<Skeleton class="h-3 w-40 rounded bg-gray-300"></Skeleton>
					</CardDescription>
				</CardFooter>
			</CardRoot>
		{/each}
	</section>
{/if}
