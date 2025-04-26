// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "TUA_API_KEY",
  authDomain: "TEU_PROJECT_ID.firebaseapp.com",
  projectId: "TEU_PROJECT_ID",
  storageBucket: "TEU_PROJECT_ID.appspot.com",
  messagingSenderId: "TEU_SENDER_ID",
  appId: "TEU_APP_ID"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta auth e provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut } from "firebase/auth";
