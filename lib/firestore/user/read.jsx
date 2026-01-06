"use client";

import { db } from "../firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import useSWRSubscription from "swr/subscription";
import useSWR, { mutate as globalMutate } from "swr";

export const getUserProfile = async (uid) => {
  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error loading user profile:", error);
    return null;
  }
};


// Existing useUser hook with added support for reviews and addresses
export function useUser(uid) {
    const { data, error } = useSWRSubscription(
        uid ? `users/${uid}` : null,
        (key, { next }) => {
            if (!key) return () => {};
            
            const ref = doc(db, key);
            
            const unsub = onSnapshot(
                ref,
                (snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.data();
                        next(null, {
                            id: snapshot.id,
                            ...userData,
                            // Ensure arrays exist with defaults
                            cart: userData.cart || [],
                            favorites: userData.favorites || [],
                            reviews: userData.reviews || [],
                            addresses: userData.addresses || []
                        });
                    } else {
                        next(null, null);
                    }
                },
                (error) => {
                    next(error);
                }
            );
            
            return () => unsub();
        }
    );
    
    const { mutate } = useSWR(uid ? `users/${uid}` : null);
    
    // Helper functions for easier access to user data
    const getUserReviewForProduct = (productId) => {
        return data?.reviews?.find(review => review.productId === productId) || null;
    };
    
    const getDefaultAddress = () => {
        return data?.addresses?.find(address => address.isDefault) || null;
    };
    
    const getAddressesByType = (type) => {
        return data?.addresses?.filter(address => 
            address.type === type || address.type === "both"
        ) || [];
    };
    
    const getShippingAddresses = () => {
        return getAddressesByType("shipping");
    };
    
    const getBillingAddresses = () => {
        return getAddressesByType("billing");
    };
    
    return {
        user: data,
        error,
        isLoading: !error && data === undefined,
        mutate: () => mutate ? mutate() : globalMutate(`users/${uid}`),
        // Helper methods
        getUserReviewForProduct,
        getDefaultAddress,
        getAddressesByType,
        getShippingAddresses,
        getBillingAddresses
    };
}

// NEW READ-ONLY FUNCTIONS

// Get user's review for a specific product (standalone function)
export async function getUserReviewForProduct(userId, productId) {
  if (!userId) throw new Error("User ID is required");
  if (!productId) throw new Error("Product ID is required");
  
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userDoc.data();
    const userReview = userData.reviews?.find(review => review.productId === productId);
    
    return userReview || null;
  } catch (error) {
    console.error("Error getting user review:", error);
    throw error;
  }
}

// Get default address (standalone function)
export async function getDefaultAddress(userId) {
  if (!userId) throw new Error("User ID is required");
  
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userDoc.data();
    const defaultAddress = userData.addresses?.find(address => address.isDefault);
    
    return defaultAddress || null;
  } catch (error) {
    console.error("Error getting default address:", error);
    throw error;
  }
}

// UTILITY/HELPER FUNCTIONS

// Validate review data
export const validateReviewData = (reviewData) => {
  const errors = [];
  
  if (!reviewData.productId) errors.push("Product ID is required");
  if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
    errors.push("Rating must be between 1 and 5");
  }
  if (!reviewData.comment || reviewData.comment.trim().length < 10) {
    errors.push("Review comment must be at least 10 characters long");
  }
  if (reviewData.comment && reviewData.comment.length > 1000) {
    errors.push("Review comment must be less than 1000 characters");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate address data
export const validateAddressData = (addressData) => {
  const errors = [];
  
  if (!addressData.name || addressData.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }
  if (!addressData.street || addressData.street.trim().length < 5) {
    errors.push("Street address must be at least 5 characters long");
  }
  if (!addressData.city || addressData.city.trim().length < 2) {
    errors.push("City must be at least 2 characters long");
  }
  if (!addressData.state || addressData.state.trim().length < 2) {
    errors.push("State must be at least 2 characters long");
  }
  if (!addressData.zipCode || !/^\d{5}(-\d{4})?$/.test(addressData.zipCode)) {
    errors.push("ZIP code must be in format 12345 or 12345-6789");
  }
  if (!addressData.country || addressData.country.trim().length < 2) {
    errors.push("Country is required");
  }
  if (addressData.phone && !/^\+?[\d\s\-\(\)]{10,}$/.test(addressData.phone)) {
    errors.push("Phone number format is invalid");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Format address for display
export const formatAddressForDisplay = (address) => {
  if (!address) return "";
  
  const lines = [
    address.name,
    address.street,
    address.street2,
    `${address.city}, ${address.state} ${address.zipCode}`,
    address.country
  ].filter(line => line && line.trim() !== "");
  
  return lines.join("\n");
};

// Format address for single line display
export const formatAddressOneLine = (address) => {
  if (!address) return "";
  
  return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
};

// Calculate average rating from reviews
export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (totalRating / reviews.length).toFixed(1);
};

// Get rating distribution
export const getRatingDistribution = (reviews) => {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  if (!reviews || reviews.length === 0) return distribution;
  
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      distribution[review.rating]++;
    }
  });
  
  return distribution;
};

// Get reviews by rating
export const getReviewsByRating = (reviews, rating) => {
  if (!reviews || reviews.length === 0) return [];
  
  return reviews.filter(review => review.rating === rating);
};

// Sort reviews by date (newest first)
export const sortReviewsByDate = (reviews, ascending = false) => {
  if (!reviews || reviews.length === 0) return [];
  
  return [...reviews].sort((a, b) => {
    const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
    const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
    
    return ascending ? dateA - dateB : dateB - dateA;
  });
};