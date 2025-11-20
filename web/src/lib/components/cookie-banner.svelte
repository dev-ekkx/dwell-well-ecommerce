<script lang="ts">
    import {X} from "@lucide/svelte/icons"
    import GooglePartnerLogo from "$lib/assets/google_partner.svg"
    import {Button} from "$lib/components/ui/button";
</script>

<div class="fixed overflow-hidden top-0 left-0 w-full h-screen z-20 **pointer-events-none** inset-0 border-4 border-red-600">

<!-- Banner content -->
    <div class="relative flex flex-col gap-6 mt-[7.5vh] w-full h-max shadow-md pointer-events-auto bg-muted g-px py-7">

<!-- Google logo and close icon -->
    <div class="flex justify-between items-start">
        <img alt="google partner" src={GooglePartnerLogo} />
    <button class="cursor-pointer">
        <X class="transform scale-125" />
    </button>
    </div>

<!-- Heading and paragraph -->
    <div class="flex flex-col gap-4">
    <h6 class="font-bold text-section-head">We value your privacy</h6>
    <p class="text-section-p">
        This website uses cookies to personalize content, provide social media features, and analyse our traffic. You can customize your preferences or reject all.
    </p>
    </div>

<!-- Action buttons -->
        <div class="flex flex-col gap-4">
            <Button class="cursor-pointer">Customize settings</Button>
            <Button class="cursor-pointer text-primary" variant="outline">Reject all</Button>
        </div>
</div>
</div>
