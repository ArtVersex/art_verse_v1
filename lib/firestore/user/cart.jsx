"use client";

import { db } from "../firebase";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";

// Add a product to cart
export async function addToCart(userId, productId, quantity = 1) {
  if (!userId) throw new Error("User ID is required");
  if (!productId) throw new Error("Product ID is required");
  
  try {
    const userRef = doc(db, "users", userId);
    
    // First check if product already exists in the cart
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userDoc.data();
    const existingCartItem = userData.cart?.find(item => item.productId === productId);
    
    if (existingCartItem) {
      // Update quantity if item already exists
      const updatedCart = userData.cart.map(item => 
        item.productId === productId 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
      );
      
      await updateDoc(userRef, {
        cart: updatedCart
      });
    } else {
      // Add new item to cart
      await updateDoc(userRef, {
        cart: arrayUnion({ productId, quantity })
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
}

// Update cart item quantity
export async function updateCartItemQuantity(userId, productId, quantity) {
  if (!userId) throw new Error("User ID is required");
  if (!productId) throw new Error("Product ID is required");
  if (quantity < 1) throw new Error("Quantity must be at least 1");
  
  try {
    const userRef = doc(db, "users", userId);
    
    // Get current cart data
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userDoc.data();
    
    // Create updated cart array
    const updatedCart = userData.cart?.map(item => 
      item.productId === productId 
        ? { ...item, quantity } 
        : item
    ) || [];
    
    // Update the cart
    await updateDoc(userRef, {
      cart: updatedCart
    });
    
    return updatedCart;
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    throw error;
  }
}

// Remove item from cart
export async function removeFromCart(userId, productId) {
  if (!userId) throw new Error("User ID is required");
  if (!productId) throw new Error("Product ID is required");
  
  try {
    const userRef = doc(db, "users", userId);
    
    // Get current cart data
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userDoc.data();
    
    // Create updated cart array by filtering out the item
    const updatedCart = userData.cart?.filter(item => item.productId !== productId) || [];
    
    // Update the cart
    await updateDoc(userRef, {
      cart: updatedCart
    });
    
    return updatedCart;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
}

// Clear the entire cart
export async function clearCart(userId) {
  if (!userId) throw new Error("User ID is required");
  
  try {
    const userRef = doc(db, "users", userId);
    
    // Set cart to empty array
    await updateDoc(userRef, {
      cart: []
    });
    
    return [];
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
}

// Calculate cart totals from cart items array and product data
export function calculateCartTotals(cartItems) {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = 0; // Free shipping
  const total = subtotal + tax + shipping;
  
  return {
    subtotal,
    tax,
    shipping,
    total,
    itemCount: cartItems.length,
    itemQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0)
  };
}