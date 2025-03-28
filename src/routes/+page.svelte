<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    onMount(() => {
        document.title = "Home | zenSpire"
    });

    function transitionToPage(page) {
        goto(`/${page}`);
    }
</script>

<p class="text-4xl text-white mt-8 font-bold">Welcome back, USER</p>
<button class="w-72 h-16 bg-white rounded-2xl p-2 text-2xl flex justify-center items-center cursor-pointer hover:bg-gray-400 transition-all mt-8 mb-32" on:click={() => transitionToPage("chat")}>👋 Hey! What's up</button>
<p class="text-4xl text-white font-bold">Today's fun fact is:</p>
<p id="funfact" class="text-md text-black mb-32">[insert fun fact]</p>
<p class="text-4xl text-white font-bold">Activities:</p>
<button class="w-72 h-16 bg-white rounded-2xl p-2 text-2xl flex justify-center items-center cursor-pointer hover:bg-gray-400 transition-all mt-8" on:click={() => transitionToPage("journal")}>📖 Journal</button>
<button class="w-72 h-16 bg-white rounded-2xl p-2 text-2xl flex justify-center items-center cursor-pointer hover:bg-gray-400 transition-all mt-8" on:click={() => transitionToPage("sketch")}>🖌️ Sketchbook</button>