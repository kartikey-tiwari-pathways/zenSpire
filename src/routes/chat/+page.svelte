<script>
    import { firebaseConfig } from "$lib";
    import Message from "$lib/components/message.svelte";
    import { GoogleGenAI } from "@google/genai";
    import { text } from "@sveltejs/kit";
    import { initializeApp } from "firebase/app";
    import { getAuth, onAuthStateChanged } from "firebase/auth";
    import { get, getDatabase, ref, set } from "firebase/database";
    import { onMount } from "svelte";
    import { marked } from "marked";
    import { goto } from "$app/navigation";
    
    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getDatabase(app);
    
    let messageLog = [];
    let sentUserContent = "";
    let messageInput;
    let submitButton;
    let messageInputForm;
    let chatLoadingAlert;

    let systemPrompt = "";
    async function buildSystemPrompt(uid) {
        const userRef = ref(db, `users/${uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            const data = snapshot.val();
            return systemPrompt = `Ignore all previous instructions. Your name is zenSpire. Act as a student psychologist working with students from 6th grade to college. The age group which we are targetting is 11-21 years; however, you should help everyone. You will address these students' mental health concerns, such as their loneliness, exam stress, academic pressure, so on. Make it conversational and easy to understand. Talk like a real human and the reading level of the conversation should be ok for the level of the user. Give shorter responses similar to texting someone unless specifically ask otherwise. The user's name is ${data.displayname} and they are in ${data.educationlvl}, and they are ${data.age} years old. They are in ${data.country}. Congratulations; you are now ready to start helping the user. The conversation starts from the next message.`;
        } else {
            console.error("User doc doesn't exist");
        }
    }
    /**
     * @type {import("@google/genai").Chat}
     */
    let chat;
    onMount(async () => {
        const unsub = onAuthStateChanged(auth, async user => {
            systemPrompt = await buildSystemPrompt(user.uid);
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
            const userMessageHistory = await get(ref(db, `messages/${user.uid}`));
            if (userMessageHistory.exists()) {
                chat = ai.chats.create({
                    model: "gemini-2.0-flash",
                    history: userMessageHistory.val()
                });
            } else {
                chat = ai.chats.create({
                    model: "gemini-2.0-flash",
                    history: []
                });
                const response = await chat.sendMessage({ message: systemPrompt });
            }
            await saveChat();
            messageLog = chat.getHistory();
            chatLoadingAlert.remove();
            unsub();
        });
    });
    

    async function messageSent(e) {
        e.preventDefault();
        if (!sentUserContent) return;
        messageInput.disabled = true;
        submitButton.disabled = true;
        const userMessageContent = sentUserContent;
        sentUserContent = "";
        let message = {
            role: "user",
            parts: [{ text: userMessageContent }]
        };
        messageLog = [...messageLog, message];
        message = {
            role: "model",
            parts: [{ text: "..." }]
        }
        messageLog = [...messageLog, message];
        const response = await chat.sendMessage({
            message: userMessageContent
        });
        message = response.candidates[0].content;
        messageLog.pop();
        messageLog = [...messageLog, message];
        await saveChat();
        messageInput.disabled = false;
        submitButton.disabled = false;
    }

    async function saveChat() {
        const unsub = onAuthStateChanged(auth, async user => {
            const messageHistoryRef = ref(db, `messages/${user.uid}`);
            await set(messageHistoryRef, messageLog);
            unsub();
        });
    }
    
    function deleteChat() {
        const deleteConfirmation = confirm("Are you SURE you want to delete the whole chat? (THIS ACTION CANNOT BE UNDONE)");
        if (!deleteConfirmation) return;
        const unsub = onAuthStateChanged(auth, async user => {
            const userMessageHistoryRef = ref(db, `messages/${user.uid}`);
            await set(userMessageHistoryRef, null);
            unsub();
            goto("/");
        });
    }
</script>

<div id="messageLog" class="flex flex-col w-full h-screen px-4">
    <div class="flex flex-col overflow-y-auto pb-12">
        {#each messageLog as message, index}
            {#if index > 0}
                <Message role={message.role}>{@html marked(message.parts[0].text)}</Message>
            {/if}
        {/each}
    </div>
    <div class="flex w-full gap-2 p-4">
        <form bind:this={messageInputForm} onsubmit={messageSent}>
            <input bind:this={messageInput} bind:value={sentUserContent} autocomplete="off" type="text" name="message" id="message" class="bg-white border-2 rounded-xl absolute bottom-0 m-2 w-[80%] h-10 left-0 p-6" placeholder="What's on your mind?">
            <button bind:this={submitButton} name="messageSubmit" id="messageSubmit" class="cursor-pointer bg-white border-2 rounded-xl absolute bottom-0 right-[10%] m-2 w-[5%] h-10 p-6 flex items-center justify-center">Send</button>
        </form>
        <button onclick={deleteChat} class="cursor-pointer bg-white text-red-500 border-2 rounded-xl absolute bottom-0 right-0 m-2 w-[5%] h-10 p-6 flex items-center justify-center">Delete history</button>
    </div>
</div>

<div bind:this={chatLoadingAlert} class="fixed top-0 left-0 h-screen w-screen flex items-center justify-center backdrop-opacity-80">
    <div class="bg-white border-2 border-black text-black text-2xl p-4">
        <p>Hi! Please wait while the chat loads...</p>
    </div>
</div>