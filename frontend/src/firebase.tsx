// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blogsmith-636bb.firebaseapp.com",
  projectId: "blogsmith-636bb",
  storageBucket: "blogsmith-636bb.firebasestorage.app",
  messagingSenderId: "914646804547",
  appId: "1:914646804547:web:a2d7773f303eaf38d2ccf6",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
