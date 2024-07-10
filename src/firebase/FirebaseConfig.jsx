// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDo8m-MqADbGKSU2Cls3z_q_KiabYppIRQ",
    authDomain: "e-pet-50f4f.firebaseapp.com",
    projectId: "e-pet-50f4f",
    storageBucket: "e-pet-50f4f.appspot.com",
    messagingSenderId: "258421061483",
    appId: "1:258421061483:web:ee988ef3a70b9aca92be2e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const fireDB = getFirestore(app);
const auth = getAuth(app);

export { auth, fireDB, storage };

