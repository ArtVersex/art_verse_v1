import { doc, serverTimestamp, setDoc, updateDoc, arrayUnion, getDoc } from "firebase/firestore"
import { db, storage } from "../firebase"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


// /lib/firestore/users/createOrUpdateUser.js

export const createOrUpdateUser = async (user) => {
  if (!user?.uid) throw new Error("User is required");

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  const profileData = {
    name: user.displayName || "",
    email: user.email || "",
    imageUrl: user.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}`,
    updatedAt: serverTimestamp(),
  };

  // 👇 FIRST LOGIN CASE: create document
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      ...profileData,
      firstLoginDate: serverTimestamp(),  // ⭐ saved once
      favorites: [],
      cart: [],
      reviews: [],
      addresses: [],
      createdAt: serverTimestamp(),
    });
  } 
  // 👇 EXISTING USER CASE: only update profile and updatedAt
  else {
    await setDoc(
      userRef, 
      profileData, 
      { merge: true }
    );
  }

  return true;
};

export const updateUserProfile = async (uid, { name, imageUrl }) => {
  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, {
    name,
    imageUrl,
    updatedAt: serverTimestamp(),
  });

  return true;
};

export const handleProfileImageUpload = async (uid, file) => {
  if (!file) return null;

  try {
    // Create storage path: users/{uid}/profile.jpg
    const storageRef = ref(storage, `users/${uid}/profile.jpg`);

    // Upload file
    await uploadBytes(storageRef, file);

    // Get public URL
    const downloadURL = await getDownloadURL(storageRef);

    // Update user document in Firestore
    await updateDoc(doc(db, "users", uid), {
      imageUrl: downloadURL,
      updatedAt: new Date(),
    });

    return downloadURL;
  } catch (error) {
    console.error("Profile Upload Error:", error);
    throw error;
  }
};



// Existing functions
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

// NEW REVIEW FUNCTIONS
export const addReview = async (userId, reviewData) => {
  if (!userId) throw new Error("User ID is required");
  if (!reviewData.productId) throw new Error("Product ID is required");
  if (!reviewData.rating) throw new Error("Rating is required");
  if (!reviewData.comment) throw new Error("Review comment is required");
  
  try {
    const userRef = doc(db, "users", userId);
    
    const review = {
      id: `${userId}_${reviewData.productId}_${Date.now()}`,
      productId: reviewData.productId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      title: reviewData.title || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      userId: userId
    };
    
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userDoc.data();
    const existingReview = userData.reviews?.find(review => review.productId === reviewData.productId);
    
    if (existingReview) {
      const updatedReviews = userData.reviews.map(review => 
        review.productId === reviewData.productId 
          ? { ...review, ...reviewData, updatedAt: serverTimestamp() }
          : review
      );
      
      await updateDoc(userRef, {
        reviews: updatedReviews
      });
    } else {
      await updateDoc(userRef, {
        reviews: arrayUnion(review)
      });
    }
    
    return review;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

export const updateReview = async (userId, productId, reviewData) => {
  if (!userId) throw new Error("User ID is required");
  if (!productId) throw new Error("Product ID is required");
  
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userDoc.data();
    const updatedReviews = userData.reviews?.map(review => 
      review.productId === productId 
        ? { ...review, ...reviewData, updatedAt: serverTimestamp() }
        : review
    ) || [];
    
    await updateDoc(userRef, {
      reviews: updatedReviews
    });
    
    return updatedReviews;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

export const removeReview = async (userId, productId) => {
  if (!userId) throw new Error("User ID is required");
  if (!productId) throw new Error("Product ID is required");
  
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userDoc.data();
    const updatedReviews = userData.reviews?.filter(review => review.productId !== productId) || [];
    
    await updateDoc(userRef, {
      reviews: updatedReviews
    });
    
    return updatedReviews;
  } catch (error) {
    console.error("Error removing review:", error);
    throw error;
  }
};

export const updateReviews = async ({ reviews, uid }) => {
  if (!uid) {
    throw new Error("UID is required to update reviews.");
  }

  await setDoc(doc(db, `users/${uid}`), 
    { 
      reviews: reviews,
      updatedAt: serverTimestamp()
    }, 
    { merge: true }
  );
};

// NEW ADDRESS FUNCTIONS
export const addAddress = async (userId, addressData) => {
  if (!userId) throw new Error("User ID is required");
  if (!addressData.name) throw new Error("Name is required");
  if (!addressData.street) throw new Error("Street address is required");
  if (!addressData.city) throw new Error("City is required");
  if (!addressData.state) throw new Error("State is required");
  if (!addressData.zipCode) throw new Error("ZIP code is required");
  if (!addressData.country) throw new Error("Country is required");
  
  try {
    const userRef = doc(db, "users", userId);
    
    const address = {
      id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: addressData.name,
      street: addressData.street,
      street2: addressData.street2 || "",
      city: addressData.city,
      state: addressData.state,
      zipCode: addressData.zipCode,
      country: addressData.country,
      phone: addressData.phone || "",
      isDefault: addressData.isDefault || false,
      type: addressData.type || "shipping",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    if (address.isDefault) {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.addresses) {
          const updatedAddresses = userData.addresses.map(addr => ({
            ...addr,
            isDefault: false
          }));
          
          await updateDoc(userRef, {
            addresses: updatedAddresses
          });
        }
      }
    }
    
    await updateDoc(userRef, {
      addresses: arrayUnion(address)
    });
    
    return address;
  } catch (error) {
    console.error("Error adding address:", error);
    throw error;
  }
};

export const updateAddress = async (userId, addressId, addressData) => {
  if (!userId) throw new Error("User ID is required");
  if (!addressId) throw new Error("Address ID is required");
  
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userDoc.data();
    let updatedAddresses = userData.addresses || [];
    
    if (addressData.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: false
      }));
    }
    
    updatedAddresses = updatedAddresses.map(address => 
      address.id === addressId 
        ? { ...address, ...addressData, updatedAt: serverTimestamp() }
        : address
    );
    
    await updateDoc(userRef, {
      addresses: updatedAddresses
    });
    
    return updatedAddresses;
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
};

export const removeAddress = async (userId, addressId) => {
  if (!userId) throw new Error("User ID is required");
  if (!addressId) throw new Error("Address ID is required");
  
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userDoc.data();
    const updatedAddresses = userData.addresses?.filter(address => address.id !== addressId) || [];
    
    await updateDoc(userRef, {
      addresses: updatedAddresses
    });
    
    return updatedAddresses;
  } catch (error) {
    console.error("Error removing address:", error);
    throw error;
  }
};

export const setDefaultAddress = async (userId, addressId) => {
  if (!userId) throw new Error("User ID is required");
  if (!addressId) throw new Error("Address ID is required");
  
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userDoc.data();
    const updatedAddresses = userData.addresses?.map(address => ({
      ...address,
      isDefault: address.id === addressId,
      updatedAt: address.id === addressId ? serverTimestamp() : address.updatedAt
    })) || [];
    
    await updateDoc(userRef, {
      addresses: updatedAddresses
    });
    
    return updatedAddresses;
  } catch (error) {
    console.error("Error setting default address:", error);
    throw error;
  }
};

export const updateAddresses = async ({ addresses, uid }) => {
  try {
    if (!uid) throw new Error("User ID is required");

    const userRef = doc(db, "users", uid);

    await updateDoc(userRef, {
      addresses: addresses,
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error updating addresses:", error);
    throw error;
  }
};