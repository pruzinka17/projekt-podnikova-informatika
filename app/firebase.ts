// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBq-aux3dy0PYp02PCsYxniPpiY2XFm4zA",
  authDomain: "podnik-informatika.firebaseapp.com",
  projectId: "podnik-informatika",
  storageBucket: "podnik-informatika.appspot.com",
  messagingSenderId: "50374364937",
  appId: "1:50374364937:web:a0e3f20a8e6915762d0dd8",
  measurementId: "G-Q4H86NF323",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize firestore
export const db = getFirestore(app);
