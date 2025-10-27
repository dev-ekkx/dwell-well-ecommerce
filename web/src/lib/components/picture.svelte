<script lang="ts">
	const { src, source, alt, ...rest } = $props();
</script>

<picture>
	<source srcset={source} type="image/webp" />
	<img {...rest} {alt} {src} />
</picture>
