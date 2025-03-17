import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC06BIJ0kbxdY0JgMfbr8dXlQ9F45P9AV4",
    authDomain: "fyp-ff975.firebaseapp.com",
    projectId: "fyp-ff975",
    storageBucket: "fyp-ff975.firebasestorage.app",
    messagingSenderId: "959313888345",
    appId: "1:959313888345:web:af718fdd04c6c558ec9d48"  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
