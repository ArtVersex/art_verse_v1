"use client"

import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function CheckoutLayout({ children }) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "cart";
  const productId = searchParams.get("productId");
  const { user, loading: authLoading } = useAuth();
  
  // Fixed parameter for useUser hook
  const { user: userData, error, isLoading: userDataLoading } = useUser(user?.uid);
  const isLoading = authLoading || userDataLoading;

  useEffect(() => {
    console.log("Checkout Layout:", {
      type,
      productId,
      userId: user?.uid,
      userDataLoaded: !!userData,
      hasCart: !!userData?.cart,
      cartItems: Array.isArray(userData?.cart) ? userData.cart.length : "unknown"
    });
  }, [type, productId, user, userData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading checkout...</h2>
          <div className="mt-4 animate-pulse flex space-x-4 justify-center">
            <div className="rounded-full bg-slate-200 h-10 w-10"></div>
            <div className="rounded-full bg-slate-200 h-10 w-10"></div>
            <div className="rounded-full bg-slate-200 h-10 w-10"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // Validate cart checkout
  if (type === "cart" && userData && (!userData.cart || (Array.isArray(userData.cart) && userData.cart.length === 0))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Your Cart is Empty</h2>
          <p className="mb-4">Add items to your cart to begin checkout</p>
          <Link href="/gallery" className="px-4 py-2 bg-blue-500 text-white rounded">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // Validate buynow checkout
  if (type === "buynow" && !productId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
          <p className="mb-4">The product you're looking for could not be found</p>
          <Link href="/gallery" className="px-4 py-2 bg-blue-500 text-white rounded">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}