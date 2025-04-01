<script>
	import Navbar from '$lib/components/navbar.svelte';
	import '../app.css';
	
	let { children } = $props();
</script>

<div class="flex">
	<Navbar />
	<div class="bg-[#B19CD9] w-[calc(100vw-96px)] h-screen absolute top-0 right-0">
		<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgL0Ujmwvp_WdxaxVDIq3yyTHWHJ7-702wXjpI1D8RPOvWdsJV35Z0oW_ZtfUCUAX-IdDQo5L3FZugGtDTz8-Q-SFflUxXzMOlDZkH5NgkpcezUegU1rkz0ZTgHCKfnuG7SrUT1jSzs2Cw/s1600/Neopop_daisies.jpg" alt="bg" class="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" />
		<div class="ml-4 z-10 opacity-100 backdrop-opacity-100">
			{@render children()}
		</div>
	</div>
</div>
