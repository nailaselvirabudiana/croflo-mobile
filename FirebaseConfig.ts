import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC57vprNYJsbln6ZLiJ0BgMFADXDoE9vbY",
    authDomain: "croflo-reksti.firebaseapp.com",
    projectId: "croflo-reksti",
    storageBucket: "croflo-reksti.firebasestorage.app",
    messagingSenderId: "479126097772",
    appId: "1:479126097772:web:d79a3d6a1a675246506d49",
    measurementId: "G-XZW18MSYKR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firestore
export const db = getFirestore(app);

// Export Auth Providers
export const googleProvider = new GoogleAuthProvider();