<script>
    import { goto } from "$app/navigation";
    import { firebaseConfig } from "$lib";
    import { initializeApp } from "firebase/app";
    import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
    import { getDatabase, ref, set } from "firebase/database";
    import { onMount } from "svelte";
    import countries from "$lib/countries.json";

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getDatabase(app);
    
    onMount(() => {
        document.title = "Sign up | zenSpire";
    });

    let email = "";
    let password = "";
    let name = "";
    let country = "";
    let educationlvl = "";
    let age = 0;

    let resultElement;
    let resultElementBase = "text-2xl font-bold mt-2 border-2 bg-black p-2";

    function signUp() {
        createUserWithEmailAndPassword(auth, email, password).then(() => {
            signInWithEmailAndPassword(auth, email, password).then(user => {
                updateProfile(user.user, {
                    displayName: name
                });
                set(ref(db, `users/${user.user.uid}`), {
                    email: email,                    
                    age: parseInt(age),
                    country: country,
                    displayname: name,
                    educationlvl: educationlvl,
                    provider: "email"
                }).then(() => {
                    resultElement.className = `${resultElementBase} text-green-500`;
                    resultElement.textContent = "Success!";
                    goto("/");
                }).catch(err => {
                    resultElement.className = `${resultElementBase} text-red-500`;
                    resultElement.textContent = `Error: ${err.code}`;
                });
            }).catch(err => {
                resultElement.className = `${resultElementBase} text-red-500`;
                resultElement.textContent = `Error: ${err.code}`;
            });
        }).catch(err => {
            resultElement.className = `${resultElementBase} text-red-500`;
            resultElement.textContent = `Error: ${err.code}`;
        });
    }

    function back() {
        goto("../");
    }
</script>

<div class="flex flex-col items-center justify-center w-[calc(100vw-96px)] h-screen absolute top-0 right-0">
    <p class="text-4xl text-black font-bold">Welcome!</p>
    <form class="flex flex-col items-center mt-6" on:submit={signUp}>
        <input autocomplete="off" bind:value={name} required type="text" name="name" id="name" class="w-auto h-10 rounded-md bg-white text-black text-base p-4 m-4 border-2" placeholder="Enter your name...">
        <input autocomplete="off" bind:value={age} required type="number" min="0" name="age" id="age" class="w-auto h-10 rounded-md bg-white text-black text-base p-4 m-4 border-2" placeholder="Enter your age...">
        <select name="country" id="country" bind:value={country} class="w-auto h-10 rounded-md bg-white text-black text-base m-4 border-2">
            <option value="" disabled selected>Please select a country</option>
            {#each countries as _country}
            <option value={_country.code}>{_country.name}</option>
            {/each}
        </select>
        <input autocomplete="off" bind:value={educationlvl} required type="text" name="educationlvl" id="educationlvl" class="w-104 h-10 rounded-md bg-white text-black text-base p-4 m-4 border-2" placeholder="What is your level of education (9th, Freshman, etc.)...">
        <input autocomplete="off" bind:value={email} required type="email" name="email" id="email" class="w-auto h-10 rounded-md bg-white text-black text-base p-4 m-4 border-2" placeholder="Enter your email...">
        <input autocomplete="off" bind:value={password} required type="password" name="password" id="password" class="w-auto h-10 rounded-md bg-white text-black text-base p-4 border-2" placeholder="Enter your password...">
        <button class="w-fit h-10 bg-white rounded-2xl py-3 text-2xl flex justify-center items-center gap-2 cursor-pointer hover:bg-gray-400 transition-all mt-8 p-4 border-2">Sign up</button>
        <p bind:this={resultElement} class="invisible">How can you see this?</p>
    </form>
    <button on:click={back} class="w-fit h-10 bg-white rounded-2xl py-3 text-2xl flex justify-center items-center gap-2 cursor-pointer hover:bg-gray-400 transition-all mt-8 p-4 border-2">Back</button>
</div>