<script>
    let { children, role } = $props();
</script>

{#if role === "user"}
    <div class="flex justify-end w-full">
        <div class="max-w-[60%] bg-blue-800 text-white rounded-xl px-4 py-2 text-base m-2 text-wrap">{@render children?.()}</div>
    </div>
{:else}
    <div class="flex justify-start w-full">
        <div class="max-w-[60%] bg-green-600 text-white rounded-xl px-4 py-2 text-base m-2">{@render children?.()}</div>
    </div>
{/if}