"use client";

import { db } from "../firebase"
import { collection, doc, documentId, getDoc, onSnapshot, query, where, orderBy, limit } from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

export function useOrdersByUserId(uid) {
    const { data, error } = useSWRSubscription(
        ["orders-by-user", uid],
        ([path, uid], { next }) => {

            // When user is not logged in yet
            if (!uid) {
                next(null, []);
                return () => {};
            }

            const ref = collection(db, "orders");

            // Query: Get orders where userId = uid
            const q = query(
                ref,
                where("userId", "==", uid),
                orderBy("timestampCreate", "desc")
            );

            const unsub = onSnapshot(
                q,
                (snapshot) => {
                    const orders = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    next(null, orders);
                },
                (error) => {
                    next(error.message);
                }
            );

            return () => unsub();
        }
    );

    return {
        orders: data || [],
        error,
        isLoading: data === undefined,
    };
}


export function useOrders() {
    const { data, error } = useSWRSubscription(
        "orders",
        (key, { next }) => {
            const ref = collection(db, key); // key is "orders"
            const q = query(ref, orderBy("timestampCreate", "desc")); // Order by creation date, newest first

            const unsub = onSnapshot(
                q,
                (snapshot) => {
                    const orders = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    next(null, orders);
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

export const getOrder = async (id) => {
    const docRef = doc(db, `orders/${id}`);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        console.warn(`Order with ID ${id} not found.`);
        return null;
    }

    return { id: docSnap.id, ...docSnap.data() };
};

export function useOrdersByStatus({ status }) {
    const { data, error } = useSWRSubscription(
        ["orders", status],
        ([path, status], { next }) => {
            const ref = collection(db, path);
            let q;
            
            if (status) {
                q = query(ref, where("orderStatus", "==", status), orderBy("timestampCreate", "desc"));
            } else {
                q = query(ref, orderBy("timestampCreate", "desc"));
            }

            const unsub = onSnapshot(
                q,
                (snapshot) => {
                    const orders = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    next(null, orders);
                },
                (error) => {
                    next(error.message);
                }
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

// Updated to support both userId and customerEmail queries
export function useOrdersByCustomer({ userId, customerEmail }) {
    const { data, error } = useSWRSubscription(
        ["orders", userId, customerEmail],
        ([path, userId, customerEmail], { next }) => {
            console.log("useOrdersByCustomer called with:", { userId, customerEmail });
            
            // If neither userId nor customerEmail is provided, return empty array
            if (!userId && !customerEmail) {
                console.log("No userId or customerEmail provided");
                next(null, []);
                return () => {};
            }

            const ref = collection(db, path);
            let q;
            
            try {
                // Prioritize userId if available, otherwise use customerEmail
                if (userId) {
                    console.log("Querying by userId:", userId);
                    // Try without orderBy first to test if the where clause works
                    q = query(ref, where("userId", "==", userId));
                } else if (customerEmail) {
                    console.log("Querying by customerEmail:", customerEmail);
                    // Try without orderBy first to test if the where clause works
                    q = query(ref, where("customerEmail", "==", customerEmail));
                }

                console.log("Executing query...");
                
                const unsub = onSnapshot(
                    q,
                    (snapshot) => {
                        console.log("Query snapshot received, docs count:", snapshot.docs.length);
                        const orders = snapshot.docs.map((doc) => {
                            console.log("Order doc:", doc.id, doc.data());
                            return {
                                id: doc.id,
                                ...doc.data(),
                            };
                        });
                        console.log("Processed orders:", orders);
                        next(null, orders);
                    },
                    (error) => {
                        console.error("Firestore query error:", error);
                        next(error.message);
                    }
                );

                return () => unsub();
            } catch (error) {
                console.error("Error setting up query:", error);
                next(error.message);
                return () => {};
            }
        }
    );

    return {
        data: data || [],
        error: error?.message,
        isLoading: data === undefined,
    };
}


export function useRecentOrders({ limitCount = 10 }) {
    const { data, error } = useSWRSubscription(
        ["recent-orders", limitCount],
        ([path, limitCount], { next }) => {
            const ref = collection(db, "orders");
            const q = query(
                ref, 
                orderBy("timestampCreate", "desc"), 
                limit(limitCount)
            );

            const unsub = onSnapshot(
                q,
                (snapshot) => {
                    const orders = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    next(null, orders);
                },
                (error) => {
                    next(error.message);
                }
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

export function useOrdersByIds({ idsList }) {
    const { data, error } = useSWRSubscription(
        ["orders", idsList],
        ([path, idsList], { next }) => {
            // Only proceed if we have valid IDs
            if (!idsList || idsList.length === 0) {
                next(null, []);
                return () => {};
            }

            const ref = collection(db, path);
            let q = query(ref, where(documentId(), "in", idsList));

            const unsub = onSnapshot(
                q,
                (snapshot) =>
                    next(
                        null,
                        snapshot.docs.length === 0
                            ? []
                            : snapshot.docs.map((snap) => ({
                                id: snap.id,
                                ...snap.data()
                            }))
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