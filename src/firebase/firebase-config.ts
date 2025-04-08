import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBeJxDbKsu8HbRC_rWXtbDJfQ-DE2nkXo0",
  authDomain: "nail-app-fd022.firebaseapp.com",
  projectId: "nail-app-fd022",
  storageBucket: "nail-app-fd022.firebasestorage.app",
  messagingSenderId: "685935479847",
  appId: "1:685935479847:web:ebf7c78abd2db52cba5202",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { getToken, messaging, onMessage };
