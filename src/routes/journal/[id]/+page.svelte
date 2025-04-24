<script>
    import { afterNavigate, goto } from "$app/navigation";
    import { firebaseConfig } from "$lib";
    import { initializeApp } from "firebase/app";
    import { getAuth, onAuthStateChanged } from "firebase/auth";
    import { getDatabase, get, ref, onValue, set } from "firebase/database";
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getDatabase(app);
    let { data } = $props();
    const selectedDate = data.id;
    let journals = $state();
    let journalContent = $state();
    let journalLoadingAlert;
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };
    const date = new Date(selectedDate * 1000);
    const dateString = date.toLocaleDateString("en-us", options);
    let accessingJournalEntries = $state(true);

    afterNavigate(() => {
        console.log("navigation detected...");
        setUp();
    });

    function setUp() {
        console.log("setting up 1");
        const unsub = onAuthStateChanged(auth, async user => {
            console.log("setting up 2");
            journalLoadingAlert.style.display = "flex";
            const journalsRef = ref(db, `journals/${user.uid}`);
            onValue(journalsRef, async snapshot => {
                journals = await getAllJournals(user.uid, snapshot);
                console.log("setting up 3");
            });
            journals = await getAllJournals(user.uid);
            try {
                journalContent = journals[selectedDate].content;
            } catch (err) {
                console.log("Journal entry does not exist.")
            }
            journalLoadingAlert.style.display = "none";
            console.log("setting up 4");
            unsub();
        });
    }
    
    async function getAllJournals(uid, snapshot) {
        accessingJournalEntries = true;
        const journalsRef = ref(db, `journals/${uid}`);
        try {
            if (!snapshot) {
                snapshot = await get(journalsRef);
            }
            if (snapshot.exists()) {
                accessingJournalEntries = false;
                return snapshot.val();
            } else {
                accessingJournalEntries = false;
                return null;
            }
        } catch (err) {
            console.error(err);
        }
    }


    function saveJournal() {
        const unsub = onAuthStateChanged(auth, async user => {
            try {
                const journalRef = ref(db, `journals/${user.uid}/${date.getTime() / 1000}`);
                await set(journalRef, {
                    date: dateString,
                    content: journalContent
                });
                console.log("Journal saved successfully!");
            } catch (err) {
                console.error(err);
            }
        });
    }

    function deleteJournal(id) {
        const unsub = onAuthStateChanged(auth, async user => {
            const journalRef = ref(db, `journals/${user.uid}/${id}`);
            try {
                await set(journalRef, null);
            } catch (err) {
                console.error(err);
            };
            unsub();
        });
    }

    function gotoJournal(id) {
        console.log(id);
        goto(`/journal/${id}`);
    }
</script>

<div class="w-full h-screen flex flex-col items-center justify-center gap-4">
    <div class="flex flex-col items-center justify-center h-[80%] w-[80%] bg-blue-300 rounded-md border-2 p-4">
        <p class="text-2xl font-bold text-white mb-4">Journal of {dateString}</p>
        <textarea bind:value={journalContent} name="textbox" id="textbox" placeholder="Write out your heart..." class="bg-white w-[80%] h-[50%] rounded-md border-2 p-4 mb-2"></textarea>
        <button onclick={saveJournal} class="bg-white min-w-[5%] min-h-[5%] rounded-md border-2 p-2 cursor-pointer hover:bg-gray-400 transition-all">💾 Save</button>
    </div>
    
    <div class="flex flex-col items-start justify-center w-[80%] bg-yellow-300 rounded-md border-2 p-4">
        {#if journals}
        <div><p>Journal found</p></div>
        {#each Object.entries(journals) as journal}
            {#if journal[1] === selectedDate}
                <div class="bg-blue-500 flex items-center justify-between rounded-md border-2 p-2 mb-2 hover:bg-gray-400 transition-all">
                    <button class="flex-1 text-left cursor-pointer h-full" onclick={() => gotoJournal(journal[0])}>
                        <p class="text-base font-bold text-black">{journal[1].date}</p>
                    </button>
                    <button onclick={() => deleteJournal(journal[0])} class="ml-2 border-2 bg-white hover:bg-gray-600 cursor-pointer p-1">🗑️</button>
                </div>
            {:else}
                <div class="bg-white flex items-center justify-between rounded-md border-2 p-2 mb-2 hover:bg-gray-400 transition-all">
                    <button class="flex-1 text-left cursor-pointer h-full" onclick={() => gotoJournal(journal[0])}>
                        <p class="text-base font-bold text-black">{journal[1].date}</p>
                    </button>
                    <button onclick={() => deleteJournal(journal[0])} class="ml-2 border-2 bg-white hover:bg-gray-600 cursor-pointer p-1">🗑️</button>
                </div>
            {/if}
        {/each}
      
        {:else if accessingJournalEntries}
            <p class="text-2xl font-bold text-white">Loading...</p>
        {:else}
            <p class="text-2xl font-bold text-white">No journals found</p>
        {/if}
    </div>
</div>

<div bind:this={journalLoadingAlert} class="fixed top-0 left-0 h-screen w-screen flex items-center justify-center backdrop-opacity-80">
    <div class="bg-white border-2 border-black text-black text-2xl p-4">
        <p>Hi! Please wait while the journal loads...</p>
    </div>
</div>