"use client";

import { db } from "../firebase"
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

export function useBrands() {
    const { data, error } = useSWRSubscription(
        "brands",
        (key, { next }) => {
            const ref = collection(db, key); // key is "brands"

            const unsub = onSnapshot(
                ref,
                (snapshot) => {
                    const brands = snapshot.docs.map((doc) => ({
                        id: doc.id, // Ensure id is included
                        ...doc.data(),
                    }));
                    next(null, brands);
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

// export const getBrands = async (id) => {
//     return await getDoc(doc(db,`brands/${id}`));
// }

export const getBrands = async (id) => {
    const docRef = doc(db, `brands/${id}`);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        throw new Error(`brands with ID ${id} not found.`);
    }
    return { id: docSnap.id, ...docSnap.data() };
};
