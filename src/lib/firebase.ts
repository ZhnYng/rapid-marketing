import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDzq7nEGMPFU-zO7p0g19hyQHULat5lVtg",
    authDomain: "rapid-marketing-ai.firebaseapp.com",
    projectId: "rapid-marketing-ai",
    storageBucket: "rapid-marketing-ai.appspot.com",
    messagingSenderId: "513963514760",
    appId: "1:513963514760:web:48e9979a38113d7ac4383d",
    measurementId: "G-23494J9259"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const firestore = getFirestore(app);