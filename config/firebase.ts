// Import the functions you need from the SDKs you need
import { firebaseConfig, firebaseDevConfig } from "./firebase.config";

import firebase, { FirebaseApp, initializeApp } from "firebase/app";
import { Firestore, getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { Auth, connectAuthEmulator, getAuth } from "firebase/auth"
import { getStorage, FirebaseStorage, connectStorageEmulator } from "firebase/storage";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const env = process.env.NODE_ENV === "production"

const app: FirebaseApp = (env) ? initializeApp(firebaseConfig) : initializeApp({ appId: firebaseDevConfig.appId, projectId: firebaseDevConfig.projectId, apiKey: firebaseDevConfig.apiKey });
const db: Firestore = (env) ? getFirestore(app) : getFirestore()
const auth: Auth = (env) ? getAuth(app) : getAuth();
const storage: FirebaseStorage = (env) ? getStorage(app) : getStorage();

if (!env) {
  connectFirestoreEmulator(db, 'localhost', 8081)
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectStorageEmulator(storage, 'localhost', 9199);
}

export {
  app,
  db,
  auth
}

// export default firebase;