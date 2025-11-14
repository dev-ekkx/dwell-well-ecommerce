<script lang="ts">
    import type {PageData} from "./$types";
    import AuthForm from "../auth-form.svelte";

    const { data }: { data: PageData } = $props();
</script>

<AuthForm {data} />
