"use client";

import { db } from "../firebase"
import { collection, doc, documentId, getDoc, onSnapshot, query, where } from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

export function useProducts() {
    const { data, error } = useSWRSubscription(
        "products",
        (key, { next }) => {
            const ref = collection(db, key); // key is "Products"

            const unsub = onSnapshot(
                ref,
                (snapshot) => {
                    const products = snapshot.docs.map((doc) => ({
                        id: doc.id, // Ensure id is included
                        ...doc.data(),
                    }));
                    next(null, products);
                },
                (error) => {
                    next(error.message);
                }
            );

            return () => unsub(); // Cleanup on unmount
        }
    );

    return {
        data,
        error,
        isLoading: data === undefined, // Cleaner check
    };
}

// export const getCategory = async (id) => {
//     return await getDoc(doc(db,`Products/${id}`));
// }


export const getProduct = async (id) => {
    const docRef = doc(db, `products/${id}`);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        console.warn(`Product with ID ${id} not found.`);
        return null; // Return null instead of throwing
    }

    return { id: docSnap.id, ...docSnap.data() };
};

// First, let's fix the useProductsByIds function
export function useProductsByIds({ idsList }) {
    const { data, error } = useSWRSubscription(
      ["products", idsList],
      ([path, idsList], { next }) => {
        // Only proceed if we have valid IDs
        if (!idsList || idsList.length === 0) {
          next(null, []);
          return () => {};
        }
  
        const ref = collection(db, path);
        let q = query(ref, where("id", "in", idsList));
  
        const unsub = onSnapshot(
          q,
          (snapshot) =>
            next(
              null,
              snapshot.docs.length === 0
                ? []
                : snapshot.docs.map((snap) => snap.data())
            ),
          (err) => next(err, null)
        );
        return () => unsub();
      }
    );
  
    return {
      data: data || [],
      error: error?.message,
      isLoading: data === undefined,
    };
  }
  