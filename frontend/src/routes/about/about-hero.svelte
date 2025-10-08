<script lang="ts">
	import type { PageProps } from './$types';

	const { heroData }: PageProps = $props();
	const cmsBaseUrl = import.meta.env.VITE_CMS_URL;
</script>

<section class="h-[29rem] relative flex items-end justify-center bg-black/70">
	<img alt="about hero:- furniture" class="absolute top-0 left-0 h-full w-full object-cover -z-10"
			 src={`${cmsBaseUrl}${heroData.images[0].url}`} />
	<div class="flex flex-col gap-5 text-center **:text-white w-11/12 mx-auto max-w-3xl py-10">
		<h2 class="text-3xl md:text-4xl lg:text-5xl">{heroData.title}</h2>
		<p>{heroData.subTitle}</p>
	</div>
</section>