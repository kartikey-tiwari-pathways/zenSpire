<script>
    import { goto } from "$app/navigation";
    import { firebaseConfig } from "$lib";
    import { initializeApp } from "firebase/app";
    import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
    import { get, set, getDatabase, ref } from "firebase/database";
    import { onMount } from "svelte";
    import countries from "$lib/countries.json";
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getDatabase(app);
    const googleProvider = new GoogleAuthProvider();

    let resultElement;
    let resultElementBase = "text-2xl font-bold mt-2 border-2 bg-black p-2";
    let ageInputElement;
    let countrySelectElement;

    let age;
    let country;
    let educationlvl;

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
        signInWithPopup(auth, googleProvider).then(user => {
            const userDoc = ref(db, `users/${user.user.uid}`);
            get(userDoc).then(snapshot => {
                if (!snapshot.exists()) {
                    set(userDoc, {
                        email: user.user.email,
                        age: age,
                        country: country,
                        displayname: user.user.displayName,
                        educationlvl: educationlvl,
                        provider: "google"
                    }).then(() => {
                        resultElement.className = `${resultElementBase} text-green-500`;
                        resultElement.textContent = "Success!";
                        goto("/");
                    }).catch(err => {
                        resultElement.className = `${resultElementBase} text-red-500`;
                        resultElement.textContent = `Error: ${err.code}`;
                    });
                } else {
                    resultElement.className = `${resultElementBase} text-green-500`;
                    resultElement.textContent = "Success!";
                    goto("/");
                }
            });
        }).catch(err => {
            resultElement.className = `${resultElementBase} text-red-500`;
            resultElement.textContent = `Error: ${err.code}`;
        });
    }
</script>

<div class="flex flex-col items-center justify-center w-[calc(100vw-96px)] h-screen absolute top-0 right-0">
    <p class="text-4xl font-bold text-black">Welcome!</p>
    <button onclick={newAccount} class="w-auto min-w-72 h-auto min-h-16 bg-white rounded-2xl p-2 text-2xl flex justify-center items-center cursor-pointer hover:bg-gray-400 transition-all mt-8">👋 Create an account</button>
    <button onclick={login} class="w-auto min-w-80 h-auto min-h-16 bg-white rounded-2xl py-3 px-4 text-2xl flex justify-center items-center gap-2 cursor-pointer hover:bg-gray-400 transition-all mt-8"><p>🤗</p><p>Already have an account?</p></button>
    <form onsubmit={google}>
        <div class="w-auto min-w-80 h-auto min-h-16 flex justify-center items-center mt-8">
            <button type="submit" class="w-auto p-6 h-full bg-white rounded-2xl py-3 text-2xl flex justify-center items-center gap-2 cursor-pointer hover:bg-gray-400 transition-all">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="google_logo" class="w-6 h-6">
              <p>Continue with Google</p>
            </button>
          </div>
        <input bind:this={ageInputElement} autocomplete="off" bind:value={age} type="number" min="0" name="age" id="age" class="w-auto h-10 rounded-md bg-white text-black text-base p-4 m-4 border-2" placeholder="Enter your age...">
        <select bind:this={countrySelectElement} name="country" id="country" bind:value={country} class="w-auto h-10 rounded-md bg-white text-black text-base m-4 border-2">
            <option value="" disabled selected>Please select a country</option>
            {#each countries as _country}
                <option value={_country.code}>{_country.name}</option>
            {/each}
        </select>
        <input autocomplete="off" bind:value={educationlvl} type="text" name="educationlvl" id="educationlvl" class="w-104 h-10 rounded-md bg-white text-black text-base p-4 m-4 border-2" placeholder="What is your level of education (9th, Freshman, etc.)...">
        <p class="text-white text-base">Fill these if you're signing in with Google for the first time</p>
    </form>
    <p bind:this={resultElement} class="invisible">How can you see this?</p>
</div>