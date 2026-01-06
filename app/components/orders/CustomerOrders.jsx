"use client";

import { useState } from "react";
import { useOrdersByCustomer } from "@/lib/firestore/orders/read";
import Link from "next/link";

export default function CustomerOrders({ user }) {
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { data: orders, error, isLoading } = useOrdersByCustomer({ 
    userId: user?.uid,
    customerEmail: user?.email
  });

  const filteredOrders = orders?.filter(order => {
    if (statusFilter === 'all') return true;
    return order.orderStatus === statusFilter;
  }) || [];

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount || 0);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Date not available';
    
    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          color: 'from-amber-400 to-yellow-500',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800',
          icon: '⏳'
        };
      case 'confirmed':
        return {
          color: 'from-blue-400 to-indigo-500',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: '✓'
        };
      case 'processing':
        return {
          color: 'from-violet-400 to-purple-500',
          bg: 'bg-violet-50',
          border: 'border-violet-200',
          text: 'text-violet-800',
          icon: '⚙️'
        };
      case 'shipped':
        return {
          color: 'from-blue-400 to-indigo-500',
          bg: 'bg-indigo-50',
          border: 'border-indigo-200',
          text: 'text-indigo-800',
          icon: '🚚'
        };
      case 'delivered':
        return {
          color: 'from-emerald-400 to-teal-500',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-800',
          icon: '✨'
        };
      case 'cancelled':
        return {
          color: 'from-rose-400 to-orange-500',
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          text: 'text-rose-800',
          icon: '✕'
        };
      default:
        return {
          color: 'from-gray-400 to-gray-500',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: 'ℹ'
        };
    }
  };

  if (!user?.uid && !user?.email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-8 px-3 sm:py-12 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-200/30 to-blue-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                Authentication Required
              </h3>
              <p className="text-gray-600 mb-8 text-base sm:text-lg">Please sign in to view your art collection</p>
              <Link 
                href="/auth/signin"
                className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-serif text-lg"
              >
                Sign In to Continue
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-8 px-3 sm:py-12 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-white/60 rounded-2xl w-1/3"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-white py-8 px-3 sm:py-12 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-3">Unable to Load Orders</h3>
              <p className="text-gray-600 mb-8">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-serif"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-white py-8 px-3 sm:py-12 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
            
            <div className="relative text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <h3 className="text-3xl sm:text-4xl font-serif font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Your Collection Awaits
              </h3>
              <p className="text-gray-600 mb-8 text-lg">Begin your artistic journey today</p>
              <Link 
                href="/gallery"
                className="inline-block px-10 py-5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-serif text-lg"
              >
                Explore Masterpieces
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-8 px-3 sm:py-12 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Artistic Header */}
        <div className="relative mb-8 sm:mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-3xl blur-2xl"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Your Art Collection
                </h1>
                <p className="text-gray-600 mt-1">Curated acquisitions & treasured pieces</p>
              </div>
            </div>
            
            {/* Artistic Status Filter */}
            <div className="flex flex-wrap gap-3">
              {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => {
                const config = status === 'all' ? { color: 'from-blue-500 to-indigo-600' } : getStatusConfig(status);
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`group relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      statusFilter === status
                        ? `bg-gradient-to-r ${config.color} text-white shadow-lg transform scale-105`
                        : 'bg-white/60 text-gray-700 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      {status !== 'all' && <span>{getStatusConfig(status).icon}</span>}
                      <span>{status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 p-12 text-center">
              <p className="text-gray-500 text-lg font-serif">No orders found for the selected status</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.orderStatus);
              return (
                <div 
                  key={order.id} 
                  className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]"
                >
                  {/* Decorative gradient bar */}
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${statusConfig.color}`}></div>
                  
                  <div className="p-6 sm:p-8">
                    {/* Order Header */}
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6 space-y-4 lg:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`w-12 h-12 bg-gradient-to-br ${statusConfig.color} rounded-xl flex items-center justify-center shadow-md`}>
                            <span className="text-2xl">{statusConfig.icon}</span>
                          </div>
                          <div>
                            <h3 className="font-serif font-bold text-xl text-gray-900">
                              Order #{order.id.slice(-8).toUpperCase()}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {formatDate(order.timestampCreate)}
                            </p>
                          </div>
                        </div>
                        {order.customerName && (
                          <p className="text-gray-700 font-medium ml-15">
                            <span className="text-gray-500">Customer:</span> {order.customerName}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-start lg:items-end space-y-2">
                        <div className={`px-4 py-2 rounded-full ${statusConfig.bg} ${statusConfig.border} border-2`}>
                          <span className={`${statusConfig.text} font-bold text-sm flex items-center space-x-2`}>
                            <span>{statusConfig.icon}</span>
                            <span>{order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}</span>
                          </span>
                        </div>
                        {order.orderType && (
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                            {order.orderType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                        <p className="text-xs font-medium text-gray-500 mb-1">Payment Method</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{order.paymentMethod || 'Not specified'}</p>
                      </div>
                      <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-4 border border-violet-100">
                        <p className="text-xs font-medium text-gray-500 mb-1">Payment Status</p>
                        <p className="text-sm font-bold text-gray-900">{order.paymentStatus || 'Pending'}</p>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
                        <p className="text-xs font-medium text-gray-500 mb-1">Fulfillment</p>
                        <p className="text-sm font-bold text-gray-900">{order.fulfillmentStatus || 'Pending'}</p>
                      </div>
                      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-4 border border-amber-100">
                        <p className="text-xs font-medium text-gray-500 mb-1">Order Source</p>
                        <p className="text-sm font-bold text-gray-900">{order.orderSource || 'Website'}</p>
                      </div>
                    </div>

                    {/* Contact Information */}
                    {(order.customerPhone || order.customerEmail) && (
                      <div className="mb-6 p-5 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl border border-blue-100">
                        <h4 className="font-serif font-bold text-gray-900 mb-3 flex items-center space-x-2">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                          <span>Contact Information</span>
                        </h4>
                        <div className="space-y-2 text-sm">
                          {order.customerEmail && (
                            <p className="text-gray-700 break-words">
                              <span className="font-medium">Email:</span> {order.customerEmail}
                            </p>
                          )}
                          {order.customerPhone && (
                            <p className="text-gray-700">
                              <span className="font-medium">Phone:</span> {order.customerPhone}
                            </p>
                          )}
                          {order.contactMethod && (
                            <p className="text-gray-700">
                              <span className="font-medium">Preferred:</span> {order.contactMethod}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Customer Notes */}
                    {order.customerNotes && order.customerNotes.trim() && (
                      <div className="mb-6 p-5 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200">
                        <h4 className="font-serif font-bold text-gray-900 mb-2 flex items-center space-x-2">
                          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                          </svg>
                          <span>Special Instructions</span>
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed italic">{order.customerNotes}</p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-6 border-t-2 border-dashed border-gray-200 space-y-4 sm:space-y-0">
                      <div>
                        {order.subtotal && order.subtotal !== order.totalAmount && (
                          <p className="text-sm text-gray-600 mb-1">
                            Subtotal: {formatCurrency(order.subtotal, order.currency)}
                          </p>
                        )}
                        <div className="text-3xl font-serif font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          {formatCurrency(order.totalAmount, order.currency)}
                        </div>
                      </div>
                      <Link 
                        href={`/orders/${order.id}`}
                        className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-serif"
                      >
                        <span>View Details</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Summary Footer */}
        {filteredOrders.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-block bg-white/80 backdrop-blur-xl rounded-full px-8 py-4 shadow-lg border border-white/20">
              <p className="text-gray-600 font-medium">
                Displaying <span className="font-bold text-blue-600">{filteredOrders.length}</span> of{' '}
                <span className="font-bold text-indigo-600">{orders.length}</span> total orders
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}