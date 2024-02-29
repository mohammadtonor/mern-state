// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-646c3.firebaseapp.com",
  projectId: "mern-estate-646c3",
  storageBucket: "mern-estate-646c3.appspot.com",
  messagingSenderId: "846962728521",
  appId: "1:846962728521:web:de14a1d423d57f6644a998"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);