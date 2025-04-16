<script>
    import { goto } from "$app/navigation";
    import { firebaseConfig } from "$lib";
    import { initializeApp } from "firebase/app";
    import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
    import { onMount } from "svelte";
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const googleProvider = new GoogleAuthProvider();

    let resultElement;
    let resultElementBase = "text-2xl font-bold mt-2 border-2 bg-black p-2";
    onMount(() => {
        document.title = "Authentication | zenSpire";
    });
    
    function newAccount() {
        goto("/auth/signup");
    }

    function login() {
        goto("/auth/login");
    }

    function google() {
        signInWithPopup(auth, googleProvider).then(() => {
            resultElement.className = `${resultElementBase} text-green-500`;
            resultElement.textContent = "Success!";
            goto("/");
        }).catch(err => {
            resultElement.className = `${resultElementBase} text-red-500`;
            resultElement.textContent = `Error: ${err.code}`;
        });
    }
</script>

<div class="flex flex-col items-center justify-center w-[calc(100vw-96px)] h-screen absolute top-0 right-0">
    <p class="text-4xl font-bold text-black">Welcome!</p>
    <button on:click={newAccount} class="w-auto min-w-72 h-auto min-h-16 bg-white rounded-2xl p-2 text-2xl flex justify-center items-center cursor-pointer hover:bg-gray-400 transition-all mt-8">👋 Create an account</button>
    <button on:click={login} class="w-auto min-w-80 h-auto min-h-16 bg-white rounded-2xl py-3 px-4 text-2xl flex justify-center items-center gap-2 cursor-pointer hover:bg-gray-400 transition-all mt-8"><p>🤗</p><p>Already have an account?</p></button>
    <button on:click={google} class="w-auto min-w-80 h-auto min-h-16 bg-white rounded-2xl py-3 text-2xl flex justify-center items-center gap-2 cursor-pointer hover:bg-gray-400 transition-all mt-8"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="google_logo" class="w-6 h-6"><p>Continue with Google</p></button>
    <p bind:this={resultElement} class="invisible">How can you see this?</p>
</div>