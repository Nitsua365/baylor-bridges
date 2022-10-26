// Import the functions you need from the SDKs you need
import { firebaseConfig } from "./firebase.config";

import firebase, { FirebaseApp, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore"
import { Auth, getAuth } from "firebase/auth"

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
export const app: FirebaseApp = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app)
export const auth: Auth = getAuth(app)
export default firebase;