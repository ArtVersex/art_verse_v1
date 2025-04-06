"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BuyNowButton({
  productId,
  disabled = false,
  stock = 0,
  variant = "default", // "default", "outline", "premium"
  size = "md",         // "sm", "md", "lg"
  className = "",      // Additional custom classes
  buttonText,          // Custom button text (optional)
  showIcon = true,     // Whether to show the credit card icon
  fullWidth = true     // Whether button should take full width
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleBuyNow = () => {
    setIsLoading(true);
    router.push(`/checkout?type=buynow&productId=${productId}`);
  };

  // Determine if the button should be disabled
  const isButtonDisabled = disabled || isLoading || stock <= 0;

  // Get appropriate button text
  const getButtonText = () => {
    if (buttonText) return buttonText;
    if (isLoading) return 'Processing...';
    if (stock <= 0) return 'Out of Stock';
    return 'Buy Now';
  };

  // Size classes
  const sizeClasses = {
    sm: "text-xs py-1.5 px-3",
    md: "text-sm py-2 px-4",
    lg: "text-base py-2.5 px-5"
  };

  // Style variants
  const getVariantClasses = () => {
    const base = "rounded font-medium transition-all duration-300 flex items-center justify-center gap-2 ";
    
    // Determine width class
    const widthClass = fullWidth ? "w-full " : "";
    
    // Base class with width
    let classes = base + widthClass;
    
    if (isButtonDisabled && stock <= 0) {
      return classes + "bg-gray-200 text-gray-500 cursor-not-allowed";
    }
    
    switch (variant) {
      case "outline":
        return classes + "border-2 border-emerald-500 text-emerald-600 bg-emerald-50 hover:bg-emerald-100";
      
      case "premium":
        return classes + "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-teal-700 transform hover:-translate-y-px";
      
      default: // "default"
        return classes + "bg-emerald-600 text-white hover:bg-emerald-700";
    }
  };

  return (
    <button
      className={`${getVariantClasses()} ${sizeClasses[size]} ${className}`}
      onClick={handleBuyNow}
      disabled={isButtonDisabled}
      aria-label="Buy now"
    >
      {showIcon && (isLoading ? 
        <Loader2 size={size === "lg" ? 20 : 16} className="animate-spin" /> : 
        <CreditCard size={size === "lg" ? 20 : 16} />
      )}
      {getButtonText()}
    </button>
  );
}