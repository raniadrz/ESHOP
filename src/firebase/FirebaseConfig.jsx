// FirebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
        apiKey: "AIzaSyCtA_mfPaCNTkWEWSO5AvILh1woz3fRWvo",
        authDomain: "eshop-cc32b.firebaseapp.com",
        projectId: "eshop-cc32b",
        storageBucket: "eshop-cc32b.firebasestorage.app",
        messagingSenderId: "816370095225",
        appId: "1:816370095225:web:6c792454bfc80cd59d70a8",
        measurementId: "G-DTFKK7MXBM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const fireDB = getFirestore(app);
const auth = getAuth(app);

export { auth, fireDB, storage };
