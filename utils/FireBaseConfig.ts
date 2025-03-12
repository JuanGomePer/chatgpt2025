// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIzO1pRzzxVFlmxpyom9HOfd8rLxa8kZI",
  authDomain: "movil-chat-7a496.firebaseapp.com",
  projectId: "movil-chat-7a496",
  storageBucket: "movil-chat-7a496.firebasestorage.app",
  messagingSenderId: "145785137247",
  appId: "1:145785137247:web:380a8a77f3df29aa5713ea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export { app };
