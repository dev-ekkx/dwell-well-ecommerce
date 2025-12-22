<script lang="ts">
	import {
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		Root as CardRoot,
		CardTitle
	} from "$lib/components/ui/card";
</script>
<section class="grid grid-cols-4 gap-4">

	{#each Array(4) as _}

			<CardRoot>
			<CardHeader>
				<CardTitle>
			<div class="h-5 w-32 rounded bg-gray-300 animate-pulse"></div>
			</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="h-8 w-10 rounded bg-gray-300 animate-pulse"></div>
				</CardContent>
			<CardFooter>
				<CardDescription>
					<div class="h-3 w-40 rounded bg-gray-300 animate-pulse"></div>
				</CardDescription>
			</CardFooter>
			</CardRoot>
	{/each}

</section>
