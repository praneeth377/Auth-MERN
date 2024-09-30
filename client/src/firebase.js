// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-24e5a.firebaseapp.com",
  projectId: "mern-auth-24e5a",
  storageBucket: "mern-auth-24e5a.appspot.com",
  messagingSenderId: "756638856427",
  appId: "1:756638856427:web:576026d5c09b0c233fbaae",
  measurementId: "G-Y6B87Z2L05"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
