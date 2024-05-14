// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJX-cUaMI0sOhK2J2sA54nE3CIZTaYVQY",
  authDomain: "magister-db9cf.firebaseapp.com",
  projectId: "magister-db9cf",
  storageBucket: "magister-db9cf.appspot.com",
  messagingSenderId: "773565986796",
  appId: "1:773565986796:web:82f41d694392b5285432c9",
  measurementId: "G-J8MDPREKNE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;