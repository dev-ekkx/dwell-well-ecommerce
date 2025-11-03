<script>
    import {Button} from "$lib/components/ui/button/index.ts";
    import Binoculars from "$lib/assets/binoculars.svg";
</script>

<div class="flex flex-col justify-between items-center gap-4">
    <img alt="binoculars" src={Binoculars}>
    <h3 class="text-2xl font-bold">
    We couldn't find any products matching your search.
    </h3>
    <ul class="flex flex-col gap-1 items-center text-muted-foreground">
        <li>
    - Check your spelling for typing errors
        </li>
        <li>
    - Try searching with short and simple keywords
        </li>
        <li>
    - Try searching more general terms - you can then filter the search results
        </li>
        <li> - Try adjusting your filters </li>
    </ul>
    <Button class="mt-6 cursor-pointer" href="/">Go to homepage</Button>
</div>