<script>
    import { goto } from "$app/navigation";
    import { firebaseConfig } from "$lib";
    import { initializeApp } from "firebase/app";
    import { getAuth, onAuthStateChanged } from "firebase/auth";
    import { onMount } from "svelte";

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    let displayName;

    onMount(() => {
        document.title = "Home | zenSpire"
        onAuthStateChanged(auth, user => {
            displayName = user.displayName;
        });
    });

    function transitionToPage(page) {
        goto(`/${page}`);
    }
</script>

<p class="text-4xl text-white mt-8 font-bold">Welcome back, {displayName}</p>
<button class="w-auto min-w-72 h-auto min-h-16 bg-white rounded-2xl p-2 text-2xl flex justify-center items-center cursor-pointer hover:bg-gray-400 transition-all mt-8 mb-32" on:click={() => transitionToPage("chat")}>👋 Hey! What's up</button>
<p class="text-4xl text-white font-bold">Today's fun fact is:</p>
<p id="funfact" class="text-md text-black mb-32">[insert fun fact]</p>
<p class="text-4xl text-white font-bold">Activities:</p>
<button class="w-auto min-w-72 h-auto min-h-16 bg-white rounded-2xl p-2 text-2xl flex justify-center items-center cursor-pointer hover:bg-gray-400 transition-all mt-8" on:click={() => transitionToPage("journal")}>📖 Journal</button>
<button class="w-auto min-w-72 h-auto min-h-16 bg-white rounded-2xl p-2 text-2xl flex justify-center items-center cursor-pointer hover:bg-gray-400 transition-all mt-8" on:click={() => transitionToPage("sketch")}>🖌️ Sketchbook</button>