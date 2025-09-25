<script lang="ts">
	import ContactusBg from '$lib/assets/images/question.jpg';
	import Person1Img from '$lib/assets/images/person1.jpg';
	import PhoneIcon from '$lib/assets/phone.svg';
	import EmailIcon from '$lib/assets/email.svg';
	import { Button } from '$lib/components/ui/button/index';

	let contactForm = $state([]);
</script>

<section class="g-mt-pt relative">
	<img alt="contact us"
			 class="w-full absolute left-0 top-0 -z-10 h-full object-cover object-top"
			 src={ContactusBg} />

	<!--User card and contact form-->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 lg:gap-40 g-px pb-10">
		<!--	Description and user card-->
		<div class="flex flex-col gap-10">
			<!--Title and Description-->
			<div class="flex flex-col gap-1 text-white text-center">
				<span class="text-2xl leading-8 md:text-4xl md:leading-12 font-semibold">More Questions? Contact us</span>
				<p class="text-white text-sm font-light">Send us a message, and we’ll get back to you soon!</p>
			</div>
			<!-- User card -->
			<div class="bg-white rounded-lg p-6 flex flex-col gap-4">
				<!--Avatar and name-->
				<div class="flex items-center gap-4">
					<img alt="country rep" class="h-14 w-14 object-cover object-top rounded-full" src={Person1Img} />
					<div class="flex flex-col">
						<span class="font-semibold">Dela Rich</span>
						<span class="text-muted-foreground text-xs">Country rep</span>
					</div>
				</div>
				<!--Phone -->
				<div class="flex items-center gap-4">
					<div class="rounded-full w-12 h-12 flex items-center justify-center bg-muted">
						<img alt="" src={PhoneIcon}>
					</div>
					<a href="tel:+233206238380" rel="nofollow noopener noreferrer" target="_blank">+233206238380</a>
				</div>
				<!--Email-->
				<div class="flex items-center gap-4">
					<div class="rounded-full w-12 h-12 flex items-center justify-center bg-muted">
						<img alt="" src={EmailIcon}>
					</div>
					<a href="mailto:devekkx@gmail.com" rel="nofollow noopener noreferrer" target="_blank">devekkx@gmail.com</a>
				</div>
			</div>
		</div>

		<!--Contact form-->
		<div class="bg-white rounded-lg p-6 flex flex-col gap-6">
			<span class="font-semibold text-3xl leading-10 capitalize">fill the form below</span>

			<!--Form-->
			<form class="flex flex-col gap-3" method="POST">
				<Button class="cursor-pointer">Submit</Button>
			</form>
		</div>
	</div>
</section>