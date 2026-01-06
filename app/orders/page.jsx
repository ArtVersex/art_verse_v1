"use client"
import { useAuth } from "@/contexts/AuthContext";
import CustomerOrders from "@/app/components/orders/CustomerOrders";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        router.push('/login');
      }
      setAuthChecked(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [user, router]);

  // Artistic loading state
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white flex justify-center items-center">
        <div className="relative">
          {/* Animated background circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-20 animate-ping"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full opacity-30 animate-pulse"></div>
          </div>
          
          {/* Main spinner */}
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-blue-600 border-r-indigo-600 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              </div>
              <div className="text-center">
                <p className="font-serif text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Loading Your Collection
                </p>
                <p className="text-sm text-gray-500 mt-1">Please wait...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      {/* Hero Section with Artistic Header */}
      <div className="relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-300/30 to-indigo-300/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-300/30 to-blue-300/30 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative container mx-auto px-4 pt-12 pb-8 sm:pt-16 sm:pb-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Decorative top element */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 blur-xl opacity-50 rounded-full"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-6 hover:rotate-12 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Your Art Collection
              </span>
            </h1>
            
            {/* Decorative line */}
            <div className="flex justify-center mb-4">
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 rounded-full"></div>
            </div>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-600 font-medium mb-3">
              Track and manage your exquisite artwork acquisitions
            </p>
            
            {/* User greeting */}
            {user?.displayName && (
              <div className="inline-block">
                <div className="bg-white/60 backdrop-blur-xl rounded-full px-6 py-2 shadow-lg border border-white/20">
                  <p className="text-sm text-gray-600">
                    Welcome back, <span className="font-bold text-blue-600">{user.displayName}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Decorative bottom accent */}
            <div className="mt-8 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative">
        <CustomerOrders user={user} />
      </div>

      {/* Decorative Footer Elements */}
      <div className="relative pb-12">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-indigo-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}