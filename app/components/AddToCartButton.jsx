"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { updateCart } from "@/lib/firestore/user/write";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ 
  productId, 
  disabled = false,
  stock = 0,
  variant = "default", // "default", "quick", "outline", "premium"
  size = "md",         // "sm", "md", "lg"
  className = "",      // Additional custom classes
  buttonText,          // Custom button text (optional)
  showIcon = true,     // Whether to show the cart icon
  fullWidth = true,    // Whether button should take full width
  onClick              // Optional callback after adding to cart
}) {
  const [isInCart, setIsInCart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const { user } = useAuth();
  const { user: userData } = useUser(user?.uid);
  const router = useRouter();

  // Set initial cart status from Firebase data when it loads
  useEffect(() => {
    if (userData && userData.cart) {
      const cartItem = userData.cart.find(item => item.productId === productId);
      if (cartItem) {
        setIsInCart(true);
        setCurrentQuantity(cartItem.quantity);
      } else {
        setIsInCart(false);
        setCurrentQuantity(0);
      }
    }
  }, [userData, productId]);

  // Check if adding would exceed stock limit
  const wouldExceedStock = () => {
    return stock > 0 && currentQuantity >= stock;
  };

  const handleAddToCart = async (e) => {
    // For icon variants, prevent default behavior and propagation
    if (variant === "quick" && e) {
      e.preventDefault();
      e.stopPropagation();
    } else if (e) {
      e.preventDefault();
    }
    
    // Check if we would exceed stock
    if (wouldExceedStock()) {
      toast.error(`Cannot add more items. Maximum stock (${stock}) reached.`);
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Handle authenticated users only
      if (!user) {
        router.push('/login');
        toast.error("You must be logged in to add items to cart.");
        return;
      }

      if (!userData) {
        // Create a new cart if none exists
        const newCart = [{ productId, quantity: 1 }];
        await updateCart({ cart: newCart, uid: user.uid });
        setIsInCart(true);
        setCurrentQuantity(1);
        toast.success("Added to cart");
      } else {
        const currentCart = userData.cart || [];
        
        const existingItemIndex = currentCart.findIndex(item => item.productId === productId);
        
        if (existingItemIndex >= 0) {
          // Check if increasing quantity would exceed stock
          const newQuantity = currentCart[existingItemIndex].quantity + 1;
          
          if (stock > 0 && newQuantity > stock) {
            toast.error(`Cannot add more items. Maximum stock (${stock}) reached.`);
            return;
          }
          
          // Increment quantity if already in cart
          const newCart = [...currentCart];
          newCart[existingItemIndex].quantity = newQuantity;
          await updateCart({ cart: newCart, uid: user.uid });
          setCurrentQuantity(newQuantity);
          toast.success("Item quantity increased");
        } else {
          // Add to cart
          const newCart = [...currentCart, { productId, quantity: 1 }];
          await updateCart({ cart: newCart, uid: user.uid });
          setIsInCart(true);
          setCurrentQuantity(1);
          toast.success("Added to cart");
        }
      }
      
      // Call the optional callback if provided
      if (onClick) onClick();
      
    } catch (error) {
      toast.error(error?.message || "Error updating cart");
      console.error("Error updating cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if the button should be disabled
  const isButtonDisabled = disabled || isLoading || wouldExceedStock() || stock <= 0;

  // Get appropriate button text based on stock and cart status
  const getButtonText = () => {
    if (buttonText) return buttonText;
    if (isLoading) return 'Adding...';
    if (stock <= 0) return 'Out of Stock';
    if (wouldExceedStock()) return 'Max Stock';
    return isInCart ? 'Add More' : 'Add to Cart';
  };

  // Size classes
  const sizeClasses = {
    sm: "text-xs py-1.5 px-2",
    md: "text-sm py-2 px-4",
    lg: "text-base py-2.5 px-5"
  };

  // Style variants
  const getVariantClasses = () => {
    const base = "rounded font-medium transition-all duration-300 flex items-center justify-center gap-1 ";
    
    // Determine width class
    const widthClass = fullWidth ? "w-full " : "";
    
    // Base class with width
    let classes = base + widthClass;
    
    if (isButtonDisabled && stock <= 0) {
      return classes + "bg-gray-200 text-gray-500 cursor-not-allowed";
    }
    
    if (isButtonDisabled && wouldExceedStock()) {
      return classes + "bg-gray-200 text-gray-500 cursor-not-allowed";
    }
    
    switch (variant) {
      case "quick":
        return "w-8 h-8 flex items-center justify-center rounded-full shadow-md transition-all duration-300 " + 
          (isInCart 
            ? "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg" 
            : "bg-white text-gray-700 hover:bg-blue-100 hover:shadow-lg");
      
      case "outline":
        return classes + (isInCart 
          ? "border-2 border-blue-500 text-blue-600 bg-blue-50 hover:bg-blue-100" 
          : "border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600");
      
      case "premium":
        return classes + (isInCart 
          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm hover:shadow-md" 
          : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm hover:shadow-md");
      
      default: // "default"
        return classes + (isInCart 
          ? "bg-blue-100 text-blue-700 hover:bg-blue-200" 
          : "bg-blue-600 text-white hover:bg-blue-700");
    }
  };

  // Render the quick variant (circular button)
  if (variant === "quick") {
    return (
      <button
        className={getVariantClasses() + " " + className}
        onClick={handleAddToCart}
        disabled={isButtonDisabled}
        aria-label={isInCart ? "Item in cart" : "Add to cart"}
        title={wouldExceedStock() ? `Maximum stock (${stock}) reached` : ""}
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <ShoppingCart size={16} />
        )}
      </button>
    );
  }

  // Render the normal button variants
  return (
    <button
      className={`${getVariantClasses()} ${sizeClasses[size]} ${className}`}
      onClick={handleAddToCart} 
      disabled={isButtonDisabled}
      aria-label="Add to cart"
      title={wouldExceedStock() ? `Maximum stock (${stock}) reached` : ""}
    >
      {showIcon && (isLoading ? 
        <Loader2 size={size === "lg" ? 18 : 14} className="animate-spin" /> : 
        <ShoppingCart size={size === "lg" ? 18 : 14} />
      )}
      <span className="truncate">{getButtonText()}</span>
    </button>
  );
}