"use client";

import React, { useState } from 'react';
import { ShareButton } from './ShareButton';
import { CreditCard, Heart, Share2, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
  };

  const isOutOfStock = !product?.stock || product.stock <= 0;
  const isInCart = userData?.cart?.some(item => item.productId === product.id);
  const isInWishlist = userData?.favorites?.includes(product.id);

  // Handle Add to Cart
  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    
    try {
      setIsAddingToCart(true);
      
      if (!user) {
        router.push('/login');
        toast.error("You must be logged in to add items to cart.");
        return;
      }

      if (!userData) {
        const newCart = [{ productId: product.id, quantity: 1 }];
        await updateCart({ cart: newCart, uid: user.uid });
        toast.success("Added to your collection");
      } else {
        const currentCart = userData.cart || [];
        const existingItemIndex = currentCart.findIndex(item => item.productId === product.id);
        
        if (existingItemIndex >= 0) {
          const newQuantity = currentCart[existingItemIndex].quantity + 1;
          
          if (product.stock > 0 && newQuantity > product.stock) {
            toast.error(`Cannot add more. Maximum available (${product.stock}) reached.`);
            return;
          }
          
          const newCart = [...currentCart];
          newCart[existingItemIndex].quantity = newQuantity;
          await updateCart({ cart: newCart, uid: user.uid });
          toast.success("Quantity increased in your collection");
        } else {
          const newCart = [...currentCart, { productId: product.id, quantity: 1 }];
          await updateCart({ cart: newCart, uid: user.uid });
          toast.success("Added to your collection");
        }
      }
    } catch (error) {
      toast.error(error?.message || "Error updating collection");
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
      toast.error("You must be logged in to acquire this piece.");
      return;
    }
    
    setIsProcessingBuy(true);
    router.push(`/checkout?type=buynow&productId=${product.id}`);
  };

  // Handle Wishlist
  const handleWishlist = async () => {
    try {
      setIsAddingToWishlist(true);
      
      if (!user) {
        router.push('/login');
        toast.error("You must be logged in to add items to your curated list.");
        return;
      }

      if (!userData) {
        await updateFavorites({ list: [product.id], uid: user.uid });
        toast.success("Added to your curated list");
      } else {
        const currentFavorites = userData.favorites || [];
        
        if (currentFavorites.includes(product.id)) {
          const newList = currentFavorites.filter(id => id !== product.id);
          await updateFavorites({ list: newList, uid: user.uid });
          toast.success("Removed from your curated list");
        } else {
          const newList = [...currentFavorites, product.id];
          await updateFavorites({ list: newList, uid: user.uid });
          toast.success("Added to your curated list");
        }
      }
    } catch (error) {
      toast.error(error?.message || "Error updating curated list");
      console.error("Error updating wishlist:", error);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  return (
    <div className="space-y-4 relative mt-6 md:mt-8">
      {/* Artistic decorative elements - adjusted for mobile */}
      <div className="absolute -left-4 md:-left-6 -top-3 md:-top-4 h-12 md:h-16 w-1 bg-gradient-to-b from-amber-200 to-transparent opacity-70"></div>
      <div className="absolute -right-4 md:-right-6 -top-3 md:-top-4 h-12 md:h-16 w-1 bg-gradient-to-b from-amber-200 to-transparent opacity-70"></div>
      
      <h3 className="font-serif text-stone-700 text-base md:text-lg mb-3 md:mb-4 relative">
        <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">Acquisition Options</span>
      </h3>

      {/* Purchase Buttons - Stack on mobile, grid on larger screens */}
      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3">
        {/* Add to Cart Button with artistic styling - full width on mobile */}
        <button
          className={`flex items-center justify-center px-4 md:px-6 py-3 md:py-4 rounded-md font-serif text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all shadow-md text-sm md:text-base
            ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}
            active:scale-98 touch-action-manipulation`} /* Added for better mobile touch feedback */
          disabled={isOutOfStock || isAddingToCart}
          onClick={handleAddToCart}
        >
          {isAddingToCart ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 md:h-5 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <ShoppingBag className="h-4 w-4 md:h-5 md:w-5 mr-2" />
          )}
          {isAddingToCart ? 'Adding...' : isInCart ? 'Add Another' : 'Add to Collection'}
        </button>

        {/* Buy Now Button with artistic styling - full width on mobile */}
        <button
          className={`flex items-center justify-center px-4 md:px-6 py-3 md:py-4 rounded-md font-serif text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md text-sm md:text-base
            ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}
            active:scale-98 touch-action-manipulation`} /* Added for better mobile touch feedback */
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
          {isProcessingBuy ? 'Processing...' : 'Acquire Now'}
        </button>
      </div>

      {/* Wishlist and Share Buttons - Stack on mobile, flex on larger screens */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-3 md:mt-4">
        <button 
          className={`py-3 px-4 flex items-center justify-center rounded-md border ${isInWishlist ? 'border-amber-200 bg-amber-50' : 'border-stone-200 bg-stone-50'} text-sm md:text-base text-stone-700 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 transition-colors shadow-sm w-full sm:flex-1
            ${isAddingToWishlist ? 'opacity-75' : ''}
            active:scale-98 touch-action-manipulation`} /* Added for better touch feedback */
          onClick={handleWishlist}
          disabled={isAddingToWishlist}
        >
          {isAddingToWishlist ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 md:h-5 md:w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Heart 
              className={`h-4 w-4 md:h-5 md:w-5 mr-2 ${isInWishlist ? 'text-amber-500 fill-amber-500' : 'text-amber-500'}`}
              fill={isInWishlist ? "currentColor" : "none"}
            />
          )}
          <span className="font-serif">
            {isInWishlist ? 'Curated' : 'Add to Curated List'}
          </span>
        </button>

        {/* Share Button with artistic styling */}
        <ShareButton product={transformedProduct}>
          <button
            className="py-3 px-4 flex items-center justify-center rounded-md border border-stone-200 bg-stone-50 text-sm md:text-base text-stone-700 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 transition-colors shadow-sm w-full sm:flex-1 active:scale-98 touch-action-manipulation" /* Added for better touch feedback */
          >
            <Share2 className="h-4 w-4 md:h-5 md:w-5 mr-2 text-stone-500" />
            <span className="font-serif">Share Artwork</span>
          </button>
        </ShareButton>
      </div>
      
      {/* Certificate of Authenticity notice */}
      <div className="mt-5 md:mt-6 pt-3 md:pt-4 border-t border-stone-100 text-center">
        <p className="text-xs text-stone-500 font-serif italic">
          Each acquisition includes a Certificate of Authenticity
        </p>
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