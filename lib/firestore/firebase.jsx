import { getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";  // ✅ Correct import
import { getAuth } from "firebase/auth";            // ✅ Correct import
import { getStorage } from "firebase/storage";      // ✅ Correct import

// const firebaseConfig = {
//     apiKey: "AIzaSyAd2Jmv_uu3L8GmL2XqVVJOevnKo23Nu2k",
//     authDomain: "artverse-9aee1.firebaseapp.com",
//     projectId: "artverse-9aee1",
//     storageBucket: "artverse-9aee1.firebasestorage.app",
//     messagingSenderId: "921415706677",
//     appId: "1:921415706677:web:08bc46b8352f983c5f697c",
//     measurementId: "G-QR8BQYQZ4N"
//   };

// const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// export const analytics = typeof window !== "undefined" && app.name
//   ? getAnalytics(app)
//   : null;

// export const db = getFirestore(app);    // ✅ Fixed
// export const auth = getAuth(app);        // ✅ Fixed
// export const storage = getStorage(app);  // ✅ Fixed


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const analytics = typeof window !== "undefined" && app.name
  ? getAnalytics(app)
  : null;

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);