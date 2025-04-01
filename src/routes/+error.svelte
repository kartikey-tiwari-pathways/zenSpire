<script>
    import { page } from "$app/state";
    console.log ()
</script>
<div class="flex flex-col justify-center items-center mt-2">
    {#if page.status === 404}
    <img src="https://media.tenor.com/IHdlTRsmcS4AAAAM/404.gif" alt="404 gif">
    {:else}
        <p class="text-4xl text-white mt-8 font-bold">{page.status}</p>
    {/if}
    <p class="text-4xl text-white mt-8 font-bold">{page.error.message}</p>
</div>