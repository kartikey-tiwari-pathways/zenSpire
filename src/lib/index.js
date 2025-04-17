// place files you want to import through the `$lib` alias in this folder.

import { onAuthStateChanged } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";

const firebaseConfig = {
    apiKey: "AIzaSyAmp1Akf_2ONZt-oQQkmGEEeTgv0Fl7FJQ",
    authDomain: "zenspire-a9e65.firebaseapp.com",
    projectId: "zenspire-a9e65",
    storageBucket: "zenspire-a9e65.firebasestorage.app",
    messagingSenderId: "207132632281",
    appId: "1:207132632281:web:b8e7895dfab27ccc77cac8",
    databaseURL: "https://zenspire-a9e65-default-rtdb.firebaseio.com/"
};

export { firebaseConfig }