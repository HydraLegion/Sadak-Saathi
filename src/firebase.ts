// Import ONLY what you need (Firebase + Firestore)
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAJaCk7n1_gkEAYJiT7_Pfy_7iqsHP7Cu4",
  authDomain: "bsp-excelviewer.firebaseapp.com",
  projectId: "bsp-excelviewer",
  storageBucket: "bsp-excelviewer.firebasestorage.app",
  messagingSenderId: "601994430473",
  appId: "1:601994430473:web:5588669db43df8ef8c10d8",
  measurementId: "G-NZ3GE4ZKDC"
};

// Initialize Firebase safely for Next.js (Prevents the duplicate app error!)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Cloud Firestore ONLY
const db = getFirestore(app);

// Export them
export { app, db };