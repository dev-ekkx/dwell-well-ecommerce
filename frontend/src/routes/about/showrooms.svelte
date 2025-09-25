<script lang="ts">
	import { Content, List, Root, Trigger } from '$lib/components/ui/tabs/index';
</script>

<section class="g-px g-mt-pt flex flex-col gap-6">
	<h4 class="text-center text-section-head">visit our showrooms</h4>
	<p class="text-section-p text-center">Experience the AmaliHomes difference firsthand at one of our global showrooms.
		Discover
		premium furniture, expert
		design advice, and stylish inspirations to transform your space. Step in today</p>

	<Root class="w-[400px]" value="account">
		<List>
			<Trigger value="account">Account</Trigger>
			<Trigger value="password">Password</Trigger>
		</List>
		<Content value="account">
			Make changes to your account here.
		</Content>
		<Content value="password">Change your password here.</Content>
	</Root>
</section>