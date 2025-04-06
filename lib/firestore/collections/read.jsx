"use client";

import { db } from "../firebase"
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

export function useCollections() {
    const { data, error } = useSWRSubscription(
        "collections",
        (key, { next }) => {
            const ref = collection(db, key); // key is "categories"

            const unsub = onSnapshot(
                ref,
                (snapshot) => {
                    const categories = snapshot.docs.map((doc) => ({
                        id: doc.id, // Ensure id is included
                        ...doc.data(),
                    }));
                    next(null, categories);
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
//     return await getDoc(doc(db,`categories/${id}`));
// }

export const getCollection = async (id) => {
    const docRef = doc(db, `collections/${id}`);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        throw new Error(`Category with ID ${id} not found.`);
    }

    return { id: docSnap.id, ...docSnap.data() };
};
