// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {
  getFirestore,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNkGq-2kEI4VZDRUfCPu4QJXkBO5zn3ZY",
  authDomain: "casperbot-b942e.firebaseapp.com",
  projectId: "casperbot-b942e",
  storageBucket: "casperbot-b942e.appspot.com",
  messagingSenderId: "1017604283034",
  appId: "1:1017604283034:web:cae4e475d6ef1cbe439d23",
  measurementId: "G-BQXD02D4NY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const logout = () => {
  signOut(auth);
};