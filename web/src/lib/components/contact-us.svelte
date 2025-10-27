<script lang="ts">
	import ContactusBg from "$lib/assets/images/question.jpg";
	// import Person1Img from '$lib/assets/images/person1.jpg';
	import PhoneIcon from "$lib/assets/phone.svg";
	import EmailIcon from "$lib/assets/email.svg";
	import { Button } from "$lib/components/ui/button";
	import type { ContactFormFieldT, InputT, QuestionT } from "$lib/types";
	import { Textarea } from "$lib/components/ui/textarea";
	import { QuestionFormSchema } from "$lib/schema";
	import { Input } from "$lib/components/ui/input";

	let contactForm = $state<QuestionT>({
		name: "",
		email: "",
		message: ""
	});

	let errors = $state<Record<ContactFormFieldT, string>>({
		name: "",
		email: "",
		message: ""
	});

	const isValidForm = $derived(() => {
		return (
			Object.values(errors).every((error) => error === "") &&
			Object.values(contactForm).every((value) => value !== "")
		);
	});

	const contactFormFields = $state<
		{
			name: ContactFormFieldT;
			type: InputT;
			placeholder: string;
		}[]
	>([
		{ name: "name", type: "text", placeholder: "Full name" },
		{ name: "email", type: "email", placeholder: "example@example.com" },
		{ name: "message", type: "textarea", placeholder: "Kindly type your message here..." }
	]);

	// validate a single field on blur
	function validateField(name: ContactFormFieldT) {
		const schema = QuestionFormSchema.shape[name];
		const result = schema.safeParse(contactForm[name]);

		errors[name] = result.success ? "" : result.error.issues[0].message;
	}
</script>

<section class="relative g-mt-pt">
	<img
		alt="contact us"
		class="absolute top-0 left-0 -z-10 h-full w-full object-cover object-top"
		src={ContactusBg}
	/>

	<!--User card and contact form-->
	<div class="grid grid-cols-1 gap-6 g-px pb-10 md:gap-10 lg:grid-cols-2 lg:gap-44">
		<!--	Description and user card-->
		<div class="flex flex-col gap-10">
			<!--Title and Description-->
			<div class="flex flex-col gap-1 text-center text-white">
				<span class="text-2xl leading-8 font-semibold md:text-4xl md:leading-12"
					>More Questions? Contact us</span
				>
				<p class="text-sm font-light text-white">
					Send us a message, and we’ll get back to you soon!
				</p>
			</div>
			<!-- User card -->
			<div class="flex flex-col gap-4 rounded-lg bg-white p-6">
				<!--Avatar and name-->
				<div class="flex items-center gap-4">
					<!--					<img alt="country rep" class="h-14 w-14 object-cover object-top rounded-full" src={Person1Img} />-->
					<div class="h-14 w-14 rounded-full bg-blue-400"></div>
					<div class="flex flex-col">
						<span class="font-semibold">Dela Rich</span>
						<span class="text-xs text-muted-foreground">Country rep</span>
					</div>
				</div>
				<!--Phone -->
				<div class="flex items-center gap-4">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
						<img alt="" src={PhoneIcon} />
					</div>
					<a href="tel:+233206238380" rel="nofollow noopener noreferrer" target="_blank"
						>+233206238380</a
					>
				</div>
				<!--Email-->
				<div class="flex items-center gap-4">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
						<img alt="" src={EmailIcon} />
					</div>
					<a href="mailto:devekkx@gmail.com" rel="nofollow noopener noreferrer" target="_blank"
						>devekkx@gmail.com</a
					>
				</div>
			</div>
		</div>

		<!--Contact form-->
		<div class="flex flex-col gap-6 rounded-lg bg-white p-6">
			<span class="text-3xl leading-10 font-semibold capitalize">fill the form below</span>

			<!--Form-->
			<form class="flex flex-col gap-3" method="POST">
				<!--Array of form fields-->
				<div class="flex flex-col gap-4">
					{#each contactFormFields as field (field.name)}
						<div class="flex flex-col gap-1">
							<span class="font-medium capitalize">{field.name}</span>
							{#if field.type === "textarea"}
								<Textarea
									class="h-42 resize-none"
									id={field.name}
									name={field.name}
									placeholder={field.placeholder}
									bind:value={contactForm[field.name]}
									oninput={() => validateField(field.name)}
									onblur={() => validateField(field.name)}
								/>
							{:else}
								<Input
									autocomplete="off"
									id={field.name}
									name={field.name}
									type={field.type}
									placeholder={field.placeholder}
									bind:value={contactForm[field.name]}
									oninput={() => validateField(field.name)}
									onblur={() => validateField(field.name)}
								/>
							{/if}
							{#if errors[field.name]}
								<p class="text-sm text-red-500">{errors[field.name]}</p>
							{/if}
						</div>
					{/each}
				</div>

				<Button
					class="mt-6 cursor-pointer"
					disabled={!isValidForm()}
					onclick={(e) => e.preventDefault()}
					type="submit"
					>Submit
				</Button>
			</form>
		</div>
	</div>
</section>
