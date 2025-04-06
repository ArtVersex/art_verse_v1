"use client";

import { db } from "../firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import useSWRSubscription from "swr/subscription";
import useSWR, { mutate as globalMutate } from "swr";

// This hook should be used where the uid is available
export function useUser(uid) {
    // Use SWR subscription for real-time updates
    const { data, error } = useSWRSubscription(
        uid ? `users/${uid}` : null,
        (key, { next }) => {
            if (!key) return () => {};
            
            const ref = doc(db, key);
            
            const unsub = onSnapshot(
                ref,
                (snapshot) => {
                    if (snapshot.exists()) {
                        next(null, {
                            id: snapshot.id,
                            ...snapshot.data(),
                        });
                    } else {
                        next(null, null); // User not found
                    }
                },
                (error) => {
                    next(error);
                }
            );
            
            return () => unsub(); // Cleanup on unmount
        }
    );
    
    // Use useSWR to get the mutate function
    const { mutate } = useSWR(uid ? `users/${uid}` : null);
    
    return {
        user: data,
        error,
        isLoading: !error && data === undefined,
        mutate: () => mutate ? mutate() : globalMutate(`users/${uid}`)
    };
}