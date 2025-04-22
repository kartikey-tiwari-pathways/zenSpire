<script>
    import { goto } from "$app/navigation";
    import { firebaseConfig } from "$lib";
    import { GoogleGenAI } from "@google/genai";
    import { initializeApp } from "firebase/app";
    import { EmailAuthProvider, getAuth, GoogleAuthProvider, onAuthStateChanged, reauthenticateWithCredential, reauthenticateWithPopup, signOut } from "firebase/auth";
    import { onMount } from "svelte";
    import { marked } from "marked";
    import { get, getDatabase, ref, set } from "firebase/database";
    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getDatabase(app);
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

    let displayName;
    let funFact = "Give me a second...";

    onMount(async () => {
        document.title = "Home | zenSpire"
        const unsub = onAuthStateChanged(auth, user => {
            if (user) displayName = user.displayName;
            unsub();
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

    let actionLoadingIndicator;
    function deleteAccount() {
        const confirmation = confirm("Are you SURE you want to delete your account (THIS ACTION CANNOT BE UNDONE)");
        if (!confirmation) return;
        actionLoadingIndicator.style.display = "block";
        const unsub = onAuthStateChanged(auth, async user => {
            const userRef = ref(db, `users/${user.uid}`);
            const messagesRef = ref(db, `messages/${user.uid}`);
            if ((await get(userRef)).val().provider === "email") {
                alert("It seems like you signed up using your email! You're going to need to enter your password to confirm this action.");
                try {
                    const password = prompt("What is your password?");
                    const credential = EmailAuthProvider.credential(user.email, password);
                    await reauthenticateWithCredential(user, credential);

                    await set(userRef, null);
                    await set(messagesRef, null);

                    await user.delete();
                    actionLoadingIndicator.style.display = "none";
                    
                    alert("Your account has been successfully deleted.");
                    goto("/");
                } catch (error) {
                    console.error("Error deleting account:", error);
                    alert("Failed to delete account. Make sure the password is correct.");
                }
            } else if ((await get(userRef)).val().provider === "google") {
                try {
                    alert("It seems like you signed up using Google! You're going to need to reauthenticate to confirm this action.")
                    const provider = new GoogleAuthProvider();
                    await reauthenticateWithPopup(user, provider);
                    
                    await set(userRef, null);
                    await set(messagesRef, null);
                    
                    await user.delete();
                    actionLoadingIndicator.style.display = "none";
                    alert("Account successfully deleted!");
                    goto("/"); // Redirect if needed
                } catch (error) {
                    console.error("Error deleting account:", error);
                    alert("Failed to delete account. Please try again.");
                }
            }
            unsub();
        });
    }
</script>

<div class="h-[90vh]">
    <p class="text-4xl text-white mt-8 font-bold">Welcome back, {displayName}</p>
    <button class="w-auto min-w-72 h-auto min-h-16 bg-white rounded-2xl p-2 text-2xl flex justify-center items-center cursor-pointer hover:bg-gray-400 transition-all mt-8 mb-32" onclick={() => transitionToPage("chat")}>👋 Hey! What's up</button>
    <p class="text-4xl text-white font-bold">Our fun fact is:</p>
    <p id="funfact" class="text-md text-black mb-32" bind:innerHTML={funFact} contenteditable="true">[insert fun fact]</p>
    <p class="text-4xl text-white font-bold">Activities:</p>
    <button class="w-auto min-w-72 h-auto min-h-16 bg-white rounded-2xl p-2 text-2xl flex justify-center items-center cursor-pointer hover:bg-gray-400 transition-all mt-8" onclick={() => transitionToPage("journal")}>📖 Journal</button>
    <button class="w-auto min-w-72 h-auto min-h-16 bg-white rounded-2xl p-2 text-2xl flex justify-center items-center cursor-pointer hover:bg-gray-400 transition-all mt-8" onclick={() => transitionToPage("sketch")}>🖌️ Sketchbook</button>
    <button class="absolute bottom-0 right-0 w-auto h-10 hover:bg-red-500 bg-white hover:text-white text-red-500 rounded-md border-2 cursor-pointer p-2 m-2" onclick={deleteAccount}>Delete account</button>
    <button class="absolute bottom-15 right-0 w-auto h-10 bg-white text-red-500 rounded-md border-2 cursor-pointer p-2 m-2" onclick={logOut}>Sign out</button>
    <p bind:this={actionLoadingIndicator} class="absolute bottom-25 right-0 w-auto h-10 bg-white black rounded-md border-2 cursor-pointer p-2 m-2" style="display: none;">Loading...</p>
</div>