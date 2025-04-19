<script>
    import { goto } from "$app/navigation";
    import { firebaseConfig } from "$lib";
    import { GoogleGenAI } from "@google/genai";
    import { initializeApp } from "firebase/app";
    import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
    import { onMount } from "svelte";
    import { marked } from "marked";

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

    let displayName;
    let funFact = "Give me a second...";

    onMount(async () => {
        document.title = "Home | zenSpire"
        onAuthStateChanged(auth, user => {
            if (user) displayName = user.displayName;
        });

        const funFactObject = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: "Give a random fun fact; don't give any other text. It'd be nice if the fun fact was related to mental health; however, keep it positive. Also keep a joyful tone by using things like exclamation marks and such. Thank you so much!"
        });
        funFact = marked(funFactObject.text);
    });

    function transitionToPage(page) {
        goto(`/${page}`);
    }

    function logOut() {
        signOut(auth);
    }
</script>

<p class="text-4xl text-white mt-8 font-bold">Welcome back, {displayName}</p>
<button class="w-auto min-w-72 h-auto min-h-16 bg-white rounded-2xl p-2 text-2xl flex justify-center items-center cursor-pointer hover:bg-gray-400 transition-all mt-8 mb-32" onclick={() => transitionToPage("chat")}>👋 Hey! What's up</button>
<p class="text-4xl text-white font-bold">Today's fun fact is:</p>
<p id="funfact" class="text-md text-black mb-32" bind:innerHTML={funFact} contenteditable="true">[insert fun fact]</p>
<p class="text-4xl text-white font-bold">Activities:</p>
<button class="w-auto min-w-72 h-auto min-h-16 bg-white rounded-2xl p-2 text-2xl flex justify-center items-center cursor-pointer hover:bg-gray-400 transition-all mt-8" onclick={() => transitionToPage("journal")}>📖 Journal</button>
<button class="w-auto min-w-72 h-auto min-h-16 bg-white rounded-2xl p-2 text-2xl flex justify-center items-center cursor-pointer hover:bg-gray-400 transition-all mt-8" onclick={() => transitionToPage("sketch")}>🖌️ Sketchbook</button>
<button class="absolute bottom-0 right-0 w-auto h-10 bg-white text-red-500 rounded-md border-2 cursor-pointer p-2 m-2" onclick={logOut}>Sign out</button>