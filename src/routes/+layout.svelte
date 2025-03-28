<script>
	import Navbar from '$lib/components/navbar.svelte';
	import '../app.css';
	
	let { children } = $props();
</script>

<div class="flex">
	<Navbar />
	<div class="bg-[#B19CD9] w-[calc(100vw-80px)] h-screen absolute top-0 right-0">
		<img src="https://crossmagri.com/wp-content/uploads/2021/03/gran-lago-neopop.jpg" alt="bg" class="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" />
		<div class="z-10 opacity-100 backdrop-opacity-100">
			{@render children()}
		</div>
	</div>
</div>
