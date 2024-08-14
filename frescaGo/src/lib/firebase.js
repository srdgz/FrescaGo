// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKE32O8Yv-QDqmJJ8y0Peo3nKnZpElJ3Y",
  authDomain: "frescago.firebaseapp.com",
  projectId: "frescago",
  storageBucket: "frescago.appspot.com",
  messagingSenderId: "406093592981",
  appId: "1:406093592981:web:0333e6cc1ac7b3413c5e9c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
