"use client";

import { db } from "../firebase"
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

export function useAdmins() {
    const { data, error } = useSWRSubscription(
        "admins",
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

export function useAdmin({ email }) {
    const { data, error } = useSWRSubscription(
        ["admins", email],
        (key, { next }) => {
            const ref = doc(db, `admins`, email);

            const unsub = onSnapshot(
                ref,
                (snapshot) => {
                    next(null, snapshot.exists() ? snapshot.data() : null);
                },
                (error) => {
                    next(error.message);
                }
            );

            return () => unsub();
        }
    );

    return {
        data,
        error,
        isLoading: data === undefined,
    };
}



// export const getBrands = async (id) => {
//     return await getDoc(doc(db,`brands/${id}`));
// }

export const getAdmins = async (id) => {
    const docRef = doc(db, `admins/${id}`);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        throw new Error(`brands with ID ${id} not found.`);
    }
    return { id: docSnap.id, ...docSnap.data() };
};
