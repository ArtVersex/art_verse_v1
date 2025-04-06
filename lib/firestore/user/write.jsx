import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore"
import { db } from "../firebase"

export const updateFavorites = async ({ list, uid }) => {

  if (!uid) {
    throw new Error("UID is required to update favorites.");
  }

  await setDoc(doc(db, `users/${uid}`),
    { favorites: list, }, { merge: true }
  )
}


export const updateCart = async ({ cart, uid }) => {
  try {
    if (!uid) throw new Error("User ID is required");

    const userRef = doc(db, "users", uid);

    await updateDoc(userRef, {
      cart: cart,
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};
