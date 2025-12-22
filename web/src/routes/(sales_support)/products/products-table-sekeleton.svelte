<script lang="ts">
	import {
		CardContent,
		CardHeader,
		Root as CardRoot,
		CardTitle
	} from "$lib/components/ui/card";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import {
		Body as TableBody,
		Cell as TableCell,
		Head as TableHead,
		Header as TableHeader,
		Root as TableRoot,
		Row as TableRow
	} from "$lib/components/ui/table";

	export let columnCount = 8;
	export let rowCount = 6;
</script>

<CardRoot>
    <CardHeader>
        <CardTitle>
            <Skeleton class="bg-gray-300 h-6 w-32" />
        </CardTitle>
    </CardHeader>
    <CardContent>
        <TableRoot>
            <TableHeader>
                <TableRow>
                    {#each Array(columnCount) as _}
                        <TableHead>
                            <Skeleton class="bg-gray-300 h-4 w-20" />
                        </TableHead>
                    {/each}
                </TableRow>
            </TableHeader>
            <TableBody>
                {#each Array(rowCount) as _}
                    <TableRow>
                        {#each Array(columnCount) as _, i}
                            <TableCell>
                                {#if i === 0} 
                                    <Skeleton class="bg-gray-300 h-16 w-20 rounded" />
                                {:else if i === columnCount - 1}
                                    <Skeleton class="bg-gray-300 h-9 w-9 rounded-full" />
                                {:else}
                                    <Skeleton class="bg-gray-300 h-4 w-full" />
                                {/if}
                            </TableCell>
                        {/each}
                    </TableRow>
                {/each}
            </TableBody>
        </TableRoot>
    </CardContent>
</CardRoot>