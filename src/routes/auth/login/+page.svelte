<script>
    import { goto } from "$app/navigation";
    import { firebaseConfig } from "$lib";
    import { initializeApp } from "firebase/app";
    import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
    import { onMount } from "svelte";

    onMount(() => {
        document.title = "Login | zenSpire";
    });

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    let email = "";
    let password = "";
    /**
     * @type Document
     */
    let resultElement;
    let resultElementBase = "text-2xl font-bold mt-2 border-2 bg-black p-2";

    function login() {
        signInWithEmailAndPassword(auth, email, password).then(() => {
            resultElement.className = `${resultElementBase} text-green-500`;
            resultElement.textContent = "Success!";
            back();
        }).catch(err => {
            resultElement.className = `${resultElementBase} text-red-500`;
            resultElement.textContent = `Error: ${err.code}`;
        });
    }

    function back() {
        goto("../");
    }
</script>

<div class="flex flex-col items-center justify-center w-[calc(100vw-96px)] h-screen">
    <p class="text-4xl text-white font-bold">Welcome back!</p>
    <form class="flex flex-col items-center mt-6" on:submit={login}>
        <input autocomplete="off" bind:value={email} required type="text" name="email" id="email" class="w-auto h-10 rounded-md bg-white text-black text-base p-4 m-4 border-2" placeholder="Enter your email...">
        <input autocomplete="off" bind:value={password} required type="password" name="password" id="password" class="w-auto h-10 rounded-md bg-white text-black text-base p-4 border-2" placeholder="Enter your password...">
        <button class="w-fit h-10 bg-white rounded-2xl py-3 text-2xl flex justify-center items-center gap-2 cursor-pointer hover:bg-gray-400 transition-all mt-8 p-4 border-2">Sign up</button>
        <p bind:this={resultElement} class="invisible">How can you see this?</p>
    </form>
    <button on:click={back} class="w-fit h-10 bg-white rounded-2xl py-3 text-2xl flex justify-center items-center gap-2 cursor-pointer hover:bg-gray-400 transition-all mt-8 p-4 border-2">Back</button>
</div>