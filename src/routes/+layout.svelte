<script>
	import Navbar from '$lib/components/navbar.svelte';
	import '../app.css';
	
	let { children } = $props();
</script>

<div class="flex">
	<Navbar />
	<div class="bg-[#B19CD9] w-[calc(100vw-80px)] h-screen absolute top-0 right-0 -z-20">
		<img src="https://crossmagri.com/wp-content/uploads/2021/03/gran-lago-neopop.jpg" alt="bg" class="absolute top-0 left-0 w-full h-full opacity-20 -z-10" />
		{@render children()}
	</div>
</div>
