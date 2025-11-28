<script lang="ts">
	import AuthForm from "../auth-form.svelte";
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();
</script>

<AuthForm {data} />
