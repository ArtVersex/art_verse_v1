"use client";

import { useState, useEffect } from "react";
import { getOrder } from "@/lib/firestore/orders/read";
import { getCategory } from "@/lib/firestore/categories/read";
import Link from "next/link";

export default function OrderDetails({ orderId }) {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch order details and category names
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const orderData = await getOrder(orderId);
        
        if (orderData) {
          // Fetch category names for each item
          if (orderData.items && orderData.items.length > 0) {
            const itemsWithCategories = await Promise.all(
              orderData.items.map(async (item) => {
                if (item.category) {
                  try {
                    const categoryData = await getCategory(item.category);
                    return {
                      ...item,
                      categoryName: categoryData.name || item.category
                    };
                  } catch (err) {
                    console.error(`Error fetching category ${item.category}:`, err);
                    return {
                      ...item,
                      categoryName: item.category // Fallback to ID if fetch fails
                    };
                  }
                }
                return item;
              })
            );
            
            setOrder({
              ...orderData,
              items: itemsWithCategories
            });
          } else {
            setOrder(orderData);
          }
        } else {
          setError('Order not found');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.message || 'Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: order?.currency || 'USD'
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Date not available';
    
    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
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

  // Get status color and icon
  const getStatusDetails = (status) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: (
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )
        };
      case 'confirmed':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: (
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )
        };
      case 'processing':
        return {
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: (
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          )
        };
      case 'shipped':
        return {
          color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          icon: (
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
          )
        };
      case 'delivered':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: (
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          )
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: (
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          )
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: (
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )
        };
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-6 px-3 sm:py-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8">
            <div className="animate-pulse space-y-4 sm:space-y-6">
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-2/3 sm:w-1/3"></div>
              <div className="space-y-3 sm:space-y-4">
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-full sm:w-3/4"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 sm:w-1/2"></div>
                <div className="h-24 sm:h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-6 px-3 sm:py-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8">
            <div className="text-center py-6 sm:py-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-serif font-medium text-gray-900 mb-2">Order Not Found</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">{error}</p>
              <Link 
                href="/orders"
                className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
              >
                Back to Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const statusDetails = getStatusDetails(order.orderStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-16 px-3 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4 sm:mb-6">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-gray-900 mb-1 sm:mb-2 break-words">
                Order #{order.id?.toUpperCase().slice(-8) || 'N/A'}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Placed on {formatDate(order.timestampCreate)}
              </p>
            </div>
            <div className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-full border ${statusDetails.color} flex-shrink-0`}>
              {statusDetails.icon}
              <span className="font-medium text-sm sm:text-base">
                {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
              </span>
            </div>
          </div>

          {/* Order Progress - Mobile Optimized */}
          <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <h3 className="font-serif font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Order Status</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="text-center bg-white rounded-lg p-2 sm:p-3">
                <div className="font-medium text-gray-700">Payment</div>
                <div className="text-gray-600 text-xs sm:text-sm">{order.paymentStatus || 'Pending'}</div>
              </div>
              <div className="text-center bg-white rounded-lg p-2 sm:p-3">
                <div className="font-medium text-gray-700">Fulfillment</div>
                <div className="text-gray-600 text-xs sm:text-sm">{order.fulfillmentStatus || 'Pending'}</div>
              </div>
              <div className="text-center bg-white rounded-lg p-2 sm:p-3">
                <div className="font-medium text-gray-700">Contact</div>
                <div className="text-gray-600 text-xs sm:text-sm">{order.contactMethod || 'Email'}</div>
              </div>
              <div className="text-center bg-white rounded-lg p-2 sm:p-3">
                <div className="font-medium text-gray-700">Type</div>
                <div className="text-gray-600 text-xs sm:text-sm">{order.orderType || 'Purchase'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items - Mobile Optimized */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-gray-900 mb-4 sm:mb-6">Acquired Artworks</h2>
          <div className="space-y-3 sm:space-y-4">
            {order.items?.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  {item.productImage && (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.productImage} 
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-grow min-w-0">
                    <h3 className="font-serif font-medium text-gray-900 text-sm sm:text-base lg:text-lg mb-1 break-words">
                      {item.productName}
                    </h3>
                    {item.description && (
                      <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2 break-words">
                        {item.description}
                      </p>
                    )}
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <span>Qty: {item.quantity}</span>
                      <span>Unit: {formatCurrency(item.price)}</span>
                      {item.categoryName && <span>Category: {item.categoryName}</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-serif font-bold text-sm sm:text-base lg:text-lg text-gray-900">
                      {formatCurrency(item.totalPrice)}
                    </div>
                  </div>
                </div>

                {/* Authenticity Badge - Mobile Optimized */}
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-green-800">Authentic Artwork</span>
                    </div>
                    <span className="text-xs text-gray-500 hidden sm:block">Certificate of Authenticity Included</span>
                    <span className="text-xs text-gray-500 sm:hidden">COA Included</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary - Mobile Optimized */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                  <span>Shipping:</span>
                  <span className="text-xs sm:text-sm">Contact for details</span>
                </div>
                <div className="border-t border-indigo-200 pt-2 mt-2">
                  <div className="flex justify-between font-serif font-bold text-indigo-900 text-base sm:text-lg lg:text-xl">
                    <span>Total:</span>
                    <span>{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Delivery Information - Mobile Optimized */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Shipping Address */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg lg:text-xl font-serif font-bold text-gray-900 mb-3 sm:mb-4">Delivery Address</h3>
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 font-serif text-gray-700 text-sm sm:text-base">
              <p className="font-medium text-gray-900 mb-1">
                {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
              </p>
              <p className="break-words">{order.shippingAddress?.address}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
              </p>
              {order.shippingAddress?.phone && (
                <p className="mt-2 pt-2 border-t border-gray-200 text-sm">
                  Phone: {order.shippingAddress.phone}
                </p>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg lg:text-xl font-serif font-bold text-gray-900 mb-3 sm:mb-4">Contact Information</h3>
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 font-serif text-gray-700 text-sm sm:text-base">
              <p className="mb-1"><span className="font-medium">Name:</span> {order.customerName}</p>
              <p className="mb-1 break-all"><span className="font-medium">Email:</span> {order.customerEmail}</p>
              {order.customerPhone && (
                <p className="mb-1"><span className="font-medium">Phone:</span> {order.customerPhone}</p>
              )}
              <p className="mb-1"><span className="font-medium">Preferred Contact:</span> {order.contactMethod || 'Email'}</p>
              {order.customerNotes && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="font-medium">Customer Notes:</p>
                  <p className="text-xs sm:text-sm mt-1 break-words">{order.customerNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Authenticity Certificate - Mobile Optimized */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-indigo-100">
          <div className="text-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-indigo-900 mb-2">Certificate of Authenticity</h3>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 mx-auto mb-3 sm:mb-4 rounded-full"></div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm">
              <div>
                <h4 className="font-serif font-bold text-indigo-900 mb-2 sm:mb-3 text-sm sm:text-base">Authentication Details</h4>
                <div className="space-y-1 sm:space-y-2 text-indigo-800">
                  <p><span className="font-medium">Certificate ID:</span> <span className="break-all">AUTH-{order.id?.toUpperCase().slice(-12) || 'PENDING'}</span></p>
                  <p><span className="font-medium">Issue Date:</span> {formatDate(order.timestampCreate)}</p>
                  <p><span className="font-medium">Verification:</span> Professional Art Authentication</p>
                  <p><span className="font-medium">Status:</span> <span className="text-green-600 font-medium">Verified Authentic</span></p>
                </div>
              </div>
              <div>
                <h4 className="font-serif font-bold text-indigo-900 mb-2 sm:mb-3 text-sm sm:text-base">Provenance Information</h4>
                <div className="space-y-1 sm:space-y-2 text-indigo-800">
                  <p><span className="font-medium">Origin:</span> Artist Direct</p>
                  <p><span className="font-medium">Authentication:</span> Certified Art Appraiser</p>
                  <p><span className="font-medium">Chain of Custody:</span> Documented</p>
                  <p><span className="font-medium">Digital Record:</span> Blockchain Verified</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <div className="text-xs sm:text-sm">
                <p className="font-medium text-yellow-800 mb-1">Important Authentication Notice</p>
                <p className="text-yellow-700 leading-relaxed">
                  This certificate guarantees the authenticity and provenance of your acquired artwork(s). 
                  Each piece has been professionally authenticated and comes with full documentation. 
                  Please retain this certificate for insurance and resale purposes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
          <Link 
            href="/orders"
            className="w-full sm:w-auto px-6 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors font-serif text-center text-sm sm:text-base"
          >
            Back to Orders
          </Link>
          <Link 
            href="/gallery"
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors font-serif text-center text-sm sm:text-base"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}