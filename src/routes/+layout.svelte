<script>
	import '../app.css';
	import Navbar from '$lib/components/navbar.svelte';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import { initializeApp } from 'firebase/app';
    import { firebaseConfig } from '$lib';
    import { afterNavigate, goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
	import { getDatabase, get as getFromDatabase, ref } from 'firebase/database';
	let { children } = $props();

	const app = initializeApp(firebaseConfig);
	const auth = getAuth(app);
	const db = getDatabase(app);

	afterNavigate(() => {
		const unsub = onAuthStateChanged(auth, user => {
			checkAuth(user);
			unsub();
		});
	});

	function checkAuth(user) {
		const currentPage = get(page).url.pathname;
		if (user && currentPage.startsWith("/auth")) {
			if (user.providerData[0].providerId !== "google.com") {
				goto("/");
			} else {
				getFromDatabase(ref(db, `users/${user.uid}`)).then(snapshot => {
					if (snapshot.exists()) {
						goto("/");
					}
				});
			}
		} else if (!user && !currentPage.startsWith("/auth")) {
			goto("/auth");
		}
	}
</script>

<div class="flex">
	<Navbar />
	<div class="bg-[#B19CD9] w-[calc(100vw-96px)] h-screen absolute top-0 right-0 backdrop-opacity-100">
		<div class="fixed top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[url('/background.png')] bg-repeat z-[-1]"></div>
		<div class="ml-4 z-10 opacity-100 backdrop-opacity-100">
			{@render children()}
		</div>
	</div>
</div>
