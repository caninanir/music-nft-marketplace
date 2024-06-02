// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMgqbefFTZC1eijU6muPlXWpXDhnAVmWw",
  authDomain: "music-nft-1773d.firebaseapp.com",
  projectId: "music-nft-1773d",
  storageBucket: "music-nft-1773d.appspot.com",
  messagingSenderId: "813585744952",
  appId: "1:813585744952:web:4423c58802753f9f7a12cd",
  measurementId: "G-LPDE6DGEL3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app);