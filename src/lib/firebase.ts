import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type User 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function initializeFirebaseSafe() {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    try {
      const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const db = getFirestore(app);
      return { app, auth, db };
    } catch (e) {
      console.error("Firebase initialization failed:", e);
    }
  }
  return { app: undefined, auth: undefined, db: undefined };
}

const { app, auth, db } = initializeFirebaseSafe();

const signUpWithEmailPassword = (email, password) => {
    if (!auth) throw new Error("Firebase not initialized");
    return createUserWithEmailAndPassword(auth, email, password);
};

const signInWithEmailPassword = (email, password) => {
    if (!auth) throw new Error("Firebase not initialized");
    return signInWithEmailAndPassword(auth, email, password);
};

const signOut = () => {
    if (!auth) throw new Error("Firebase not initialized");
    return firebaseSignOut(auth);
};

export { 
    app, 
    auth, 
    db, 
    onAuthStateChanged, 
    signOut, 
    signUpWithEmailPassword, 
    signInWithEmailPassword,
    type User 
};
