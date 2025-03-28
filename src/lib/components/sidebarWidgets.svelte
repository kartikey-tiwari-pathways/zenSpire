<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    let propsRune = $props();
    let { children } = propsRune;

    let thisElement;

    onMount(() => {
        if (propsRune.interactive) {
            thisElement.addEventListener("click", () => {
                goto(propsRune.interactive);
            });
        }
    });
</script>

<div class="sidebarWidget w-[75px] h-[75px] rounded-full bg-white flex flex-col items-center justify-center shadow-md mb-4{propsRune.interactive ? " cursor-pointer hover:bg-gray-400 transition-all" : ""}" bind:this={thisElement}>
    <p class="text-2xl">{@html propsRune.emoji}</p>
    <p class="text-xs font-bold text-black">{@render children?.()}</p>
</div>