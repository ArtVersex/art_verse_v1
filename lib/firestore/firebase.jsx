import { getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";  // ✅ Correct import
import { getAuth } from "firebase/auth";            // ✅ Correct import
import { getStorage } from "firebase/storage";      // ✅ Correct import

const firebaseConfig = {
    apiKey: "AIzaSyAd2Jmv_uu3L8GmL2XqVVJOevnKo23Nu2k",
    authDomain: "artverse-9aee1.firebaseapp.com",
    projectId: "artverse-9aee1",
    storageBucket: "artverse-9aee1.firebasestorage.app",
    messagingSenderId: "921415706677",
    appId: "1:921415706677:web:08bc46b8352f983c5f697c",
    measurementId: "G-QR8BQYQZ4N"
  };

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const analytics = typeof window !== "undefined" && app.name
  ? getAnalytics(app)
  : null;

export const db = getFirestore(app);    // ✅ Fixed
export const auth = getAuth(app);        // ✅ Fixed
export const storage = getStorage(app);  // ✅ Fixed
