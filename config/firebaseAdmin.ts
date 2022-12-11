import * as admin from "firebase-admin"

import { firebaseConfig } from "./firebase.config"

const env = process.env.NODE_ENV === "production"

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
      projectId: firebaseConfig.projectId,
      privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") || ""
    }),
    projectId: firebaseConfig.projectId,
    // storageBucket: (env) ? firebaseConfig.storageBucket : firebaseDevConfig.storageBucket
    // databaseURL: (env) ? firebaseConfig.databaseURL : firebaseDevConfig.databaseURL,
  })
}

const firestore = admin.firestore()

export { firestore }
export {}