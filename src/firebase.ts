// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDWjOGWcB0Lr-kvhmctYEUtM2ZJ4xWBgKA",
  authDomain: "nail-spa-7c1a9.firebaseapp.com",
  projectId: "nail-spa-7c1a9",
  storageBucket: "nail-spa-7c1a9.firebasestorage.app",
  messagingSenderId: "103072032496",
  appId: "1:103072032496:web:f4dcd6fe4cbe27fefac435",
  measurementId: "G-S5B073TSJB",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
