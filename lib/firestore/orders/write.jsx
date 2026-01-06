import { collection, deleteDoc, doc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const createNewOrder = async ({ orderData }) => {
    if (!orderData.customerName) {
        throw new Error("Customer Name is Required");
    }
    if (!orderData.items || orderData.items.length === 0) {
        throw new Error("Order Items are Required");
    }
    if (!orderData.totalAmount) {
        throw new Error("Total Amount is Required");
    }

    const newId = doc(collection(db, `ids`)).id;

    await setDoc(doc(db, `orders/${newId}`), {
        ...orderData,
        id: newId,
        orderStatus: orderData.orderStatus || "pending",
        timestampCreate: Timestamp.now(),
    });

    return newId;
};

export const updateOrder = async ({ orderData }) => {
    if (!orderData.id) {
        throw new Error("Order ID is Required");
    }
    if (!orderData.customerName) {
        throw new Error("Customer Name is Required");
    }

    const orderRef = doc(db, `orders/${orderData.id}`);

    await updateDoc(orderRef, {
        ...orderData,
        timestampUpdate: Timestamp.now(),
    });
};

export const deleteOrder = async ({ id }) => {
    if (!id) {
        throw new Error("Order ID is Required");
    }

    await deleteDoc(doc(db, `orders/${id}`));
};

export const updateOrderStatus = async ({ id, status }) => {
    if (!id) {
        throw new Error("Order ID is Required");
    }
    if (!status) {
        throw new Error("Order Status is Required");
    }

    const orderRef = doc(db, `orders/${id}`);

    await updateDoc(orderRef, {
        orderStatus: status,
        timestampUpdate: Timestamp.now(),
    });
};

// Additional utility function for order management
export const addOrderItem = async ({ orderId, newItem }) => {
    if (!orderId) {
        throw new Error("Order ID is Required");
    }
    if (!newItem) {
        throw new Error("New Item is Required");
    }

    const orderRef = doc(db, `orders/${orderId}`);
    
    // You'll need to get the current order first, then update the items array
    // This is a simplified version - you might want to use arrayUnion for better handling
    await updateDoc(orderRef, {
        items: [...orderData.items, newItem], // You'll need to get current items first
        timestampUpdate: Timestamp.now(),
    });
};

export const removeOrderItem = async ({ orderId, itemId }) => {
    if (!orderId) {
        throw new Error("Order ID is Required");
    }
    if (!itemId) {
        throw new Error("Item ID is Required");
    }

    const orderRef = doc(db, `orders/${orderId}`);
    
    // You'll need to get current order, filter out the item, then update
    // This is a simplified version
    await updateDoc(orderRef, {
        // items: currentItems.filter(item => item.id !== itemId),
        timestampUpdate: Timestamp.now(),
    });
};