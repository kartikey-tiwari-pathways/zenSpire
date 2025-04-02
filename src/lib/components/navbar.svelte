<script>
    import SidebarWidgets from "$lib/components/sidebarWidgets.svelte";
</script>

<div id="navbar" class="h-screen w-24 bg-[#B13DFA] flex items-center justify-center flex-col">
    <SidebarWidgets emoji='<img src="/favicon.png" class="w-6 h-6" />'>zenSpire</SidebarWidgets>
    <SidebarWidgets emoji="🏠" interactive="/">Home</SidebarWidgets>
    <SidebarWidgets emoji="💬" interactive="/chat">Chat</SidebarWidgets>
    <SidebarWidgets emoji="📖" interactive="/journal">Journal</SidebarWidgets>
    <SidebarWidgets emoji="🖌️" interactive="/sketch">Sketchbook</SidebarWidgets>
</div>