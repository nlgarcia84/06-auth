// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKKtWaj3O1OXhXnCnsILUZVEF_nPmPtNg",
  authDomain: "astro-authentication-90588.firebaseapp.com",
  projectId: "astro-authentication-90588",
  storageBucket: "astro-authentication-90588.firebasestorage.app",
  messagingSenderId: "1040178188959",
  appId: "1:1040178188959:web:ffc5a1b200aeee609d88aa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
auth.languageCode = "es";
export const firebase = { app, auth };
