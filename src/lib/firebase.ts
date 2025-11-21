import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// Replace with your Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyAax9RJ5Vrb8EIXJWpw7HNvirYmc518hgY",
  authDomain: "yatraflow-c2c84.firebaseapp.com",
  projectId: "yatraflow-c2c84",
  storageBucket: "yatraflow-c2c84.firebasestorage.app",
  messagingSenderId: "1718051320",
  appId: "1:1718051320:web:677d49516d0df4dc93760d",
  measurementId: "G-VCXWSVLV08"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
