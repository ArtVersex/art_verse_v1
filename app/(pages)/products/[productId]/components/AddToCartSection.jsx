// components/AddToCartSection.jsx
"use client";

import React from 'react';
import { ShareButton } from './ShareButton';
import { CreditCard, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import AuthContextProvider, { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/lib/firestore/user/read';
import { updateCart } from '@/lib/firestore/user/write';
import { updateFavorites } from '@/lib/firestore/user/write';

// Create a wrapped version of the component that includes the context
const AddToCartSectionWithAuth = ({ product }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { user: userData } = useUser(user?.uid);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isProcessingBuy, setIsProcessingBuy] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  // Rest of your component code...
  // All the functions and JSX remain the same
  
  // Function to safely convert Firestore timestamps to ISO strings
  const serializeTimestamp = (timestamp) => {
    if (!timestamp) return null;
    if (typeof timestamp === 'object' && 'seconds' in timestamp) {
      return new Date(timestamp.seconds * 1000).toISOString();
    }
    return timestamp; // Return as is if it's already serialized
  };

  // Create a fully serialized version of the product object
  const transformedProduct = {
    ...product,
    timestampcreate: serializeTimestamp(product.timestampcreate),
    timestampUpdate: serializeTimestamp(product.timestampUpdate),
    // Add any other timestamp fields that might be in your product object
  };

  const isOutOfStock = !product?.stock || product.stock <= 0;
  
  // Check if product is in cart
  const isInCart = userData?.cart?.some(item => item.productId === product.id);
  
  // Check if product is in wishlist
  const isInWishlist = userData?.favorites?.includes(product.id);

  // Handle Add to Cart
  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    
    try {
      setIsAddingToCart(true);
      
      // Handle authenticated users only
      if (!user) {
        router.push('/login');
        toast.error("You must be logged in to add items to cart.");
        return;
      }

      if (!userData) {
        // Create a new cart if none exists
        const newCart = [{ productId: product.id, quantity: 1 }];
        await updateCart({ cart: newCart, uid: user.uid });
        toast.success("Added to cart");
      } else {
        const currentCart = userData.cart || [];
        
        const existingItemIndex = currentCart.findIndex(item => item.productId === product.id);
        
        if (existingItemIndex >= 0) {
          // Check if increasing quantity would exceed stock
          const newQuantity = currentCart[existingItemIndex].quantity + 1;
          
          if (product.stock > 0 && newQuantity > product.stock) {
            toast.error(`Cannot add more items. Maximum stock (${product.stock}) reached.`);
            return;
          }
          
          // Increment quantity if already in cart
          const newCart = [...currentCart];
          newCart[existingItemIndex].quantity = newQuantity;
          await updateCart({ cart: newCart, uid: user.uid });
          toast.success("Item quantity increased");
        } else {
          // Add to cart
          const newCart = [...currentCart, { productId: product.id, quantity: 1 }];
          await updateCart({ cart: newCart, uid: user.uid });
          toast.success("Added to cart");
        }
      }
    } catch (error) {
      toast.error(error?.message || "Error updating cart");
      console.error("Error updating cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle Buy Now
  const handleBuyNow = () => {
    if (isOutOfStock) return;
    
    if (!user) {
      router.push('/login');
      toast.error("You must be logged in to make a purchase.");
      return;
    }
    
    setIsProcessingBuy(true);
    router.push(`/checkout?type=buynow&productId=${product.id}`);
  };

  // Handle Wishlist
// Handle Wishlist
const handleWishlist = async () => {
  try {
    setIsAddingToWishlist(true);
    
    // Handle authenticated users only
    if (!user) {
      router.push('/login');
      toast.error("You must be logged in to add items to wishlist.");
      return;
    }

    if (!userData) {
      // Create a new favorites list if none exists
      await updateFavorites({ list: [product.id], uid: user.uid });
      toast.success("Added to wishlist");
    } else {
      const currentFavorites = userData.favorites || [];
      
      if (currentFavorites.includes(product.id)) {
        // Remove from favorites if already in list
        const newList = currentFavorites.filter(id => id !== product.id);
        await updateFavorites({ list: newList, uid: user.uid });
        toast.success("Removed from wishlist");
      } else {
        // Add to favorites
        const newList = [...currentFavorites, product.id];
        await updateFavorites({ list: newList, uid: user.uid });
        toast.success("Added to wishlist");
      }
    }
  } catch (error) {
    toast.error(error?.message || "Error updating wishlist");
    console.error("Error updating wishlist:", error);
  } finally {
    setIsAddingToWishlist(false);
  }
};

  return (
    <div className="mt-8 space-y-4">
      {/* Purchase Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Add to Cart Button */}
        <button
          className={`flex items-center justify-center px-6 py-3 rounded-md font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors
            ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isOutOfStock || isAddingToCart}
          onClick={handleAddToCart}
        >
          {isAddingToCart ? (
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
            </svg>
          )}
          {isAddingToCart ? 'Adding...' : isInCart ? 'Add More' : 'Add to Cart'}
        </button>

        {/* Buy Now Button */}
        <button
          className={`flex items-center justify-center px-6 py-3 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors
            ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isOutOfStock || isProcessingBuy}
          onClick={handleBuyNow}
        >
          {isProcessingBuy ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <CreditCard className="h-4 w-4 mr-2" />
          )}
          {isProcessingBuy ? 'Processing...' : 'Buy Now'}
        </button>
      </div>

      {/* Wishlist and Share Buttons */}
      <div className="flex space-x-4">
        <button 
          className={`flex-1 py-3 px-4 flex items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors
            ${isAddingToWishlist ? 'opacity-75' : ''}`}
          onClick={handleWishlist}
          disabled={isAddingToWishlist}
        >
          {isAddingToWishlist ? (
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 mr-2 ${isInWishlist ? 'text-red-500 fill-red-500' : 'text-red-500'}`} 
              viewBox="0 0 20 20" 
              fill={isInWishlist ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={isInWishlist ? "0" : "1.5"}
            >
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          )}
          {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </button>

        {/* ShareButton with fully serialized product data */}
        <ShareButton product={transformedProduct} />
      </div>
    </div>
  );
};

// Export a wrapper component that includes the AuthContextProvider
export const AddToCartSection = ({ product }) => {
  return (
    <AuthContextProvider>
      <AddToCartSectionWithAuth product={product} />
    </AuthContextProvider>
  );
};