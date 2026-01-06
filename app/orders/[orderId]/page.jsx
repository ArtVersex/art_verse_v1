"use client";

import { useAuth } from "@/contexts/AuthContext";
import OrderDetails from "@/app/components/orders/OrderDetails";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { use } from "react"; // Import the use function

export default function OrderDetailsPage({ params }) {
  // Unwrap the params promise
  const unwrappedParams = use(params);
  const { orderId } = unwrappedParams;
  
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return <OrderDetails orderId={orderId} />;
}