<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const unixTimestamp = Math.floor(startOfDay.getTime() / 1000);
    onMount(() => {
        goto(`/journal/${unixTimestamp}`);
    })
</script>