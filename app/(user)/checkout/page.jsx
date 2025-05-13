"use client"

import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "next/navigation";
import CheckoutComponent from "./components/checkout";

export default function CheckoutPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "cart";
  const productId = searchParams.get("productId");

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Sign in Required</h2>
          <p className="mb-4">Please sign in to access checkout</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto py-15 px-4 pt-20">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <CheckoutComponent 
        userId={user.uid} 
        checkoutType={type} 
        singleProductId={productId} 
      />
    </main>
  );
}