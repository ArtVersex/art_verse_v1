"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { createNewOrder } from "@/lib/firestore/orders/write";

export default function OrderConfirmation({ 
  userData, 
  orderTotal, 
  checkoutItems, 
  deliveryData, 
  paymentData, 
  userId,
  savedOrderId,
  orderSaveError,
  isOrderSaving,
  onOrderSaved,
  onOrderSaveError,
  isReadyForSave
}) {
  const [localOrderId, setLocalOrderId] = useState(savedOrderId);
  const [localSaving, setLocalSaving] = useState(false);
  const [localError, setLocalError] = useState(orderSaveError);
  const hasSavedOrder = useRef(false);
  const isCurrentlySaving = useRef(false);

  console.log("deliver data:" , deliveryData, paymentData, userData, checkoutItems, orderTotal);
  
  // Save order when component mounts and data is ready
  useEffect(() => {
    const saveOrder = async () => {
      // Comprehensive checks to prevent double saves
      if (
        hasSavedOrder.current || 
        isCurrentlySaving.current || 
        localOrderId || 
        localSaving || 
        !isReadyForSave ||
        !checkoutItems?.length ||
        !deliveryData ||
        !paymentData
      ) {
        return;
      }

      // Mark as saving immediately
      isCurrentlySaving.current = true;
      hasSavedOrder.current = true;
      setLocalSaving(true);
      setLocalError(null);

      try {
        // Prepare order data
        const orderData = {
          // Customer Information
          customerName: `${deliveryData.firstName} ${deliveryData.lastName}`.trim(),
          customerEmail: userData?.email || '',
          customerPhone: deliveryData.phone || '',
          userId: userId,
          contactMethod: deliveryData.communicationPreference || 'email',
          contactVia: deliveryData.communicationContact || "",

          // Order Items
          items: checkoutItems.map(item => ({
            productId: item.productId,
            productName: item.product?.title || 'Unknown Product',
            productImage: item.product?.featureImageUrl || '',
            quantity: item.quantity || 1,
            price: item.product?.price || 0,
            totalPrice: (item.product?.price || 0) * (item.quantity || 1),
            description: item.product?.shortDescription || '',
            category: item.product?.categoryID || '',
          })),

          // Order Totals
          subtotal: orderTotal,
          totalAmount: orderTotal,
          currency: 'USD',

          // Shipping Information
          shippingAddress: {
            firstName: deliveryData.firstName,
            lastName: deliveryData.lastName,
            address: deliveryData.address,
            city: deliveryData.city,
            state: deliveryData.state,
            zipCode: deliveryData.zipCode,
            phone: deliveryData.phone,
          },

          // Billing Information
          billingAddress: deliveryData.billingAddress && Object.keys(deliveryData.billingAddress).length > 0 
            ? deliveryData.billingAddress 
            : {
                firstName: deliveryData.firstName,
                lastName: deliveryData.lastName,
                address: deliveryData.address,
                city: deliveryData.city,
                state: deliveryData.state,
                zipCode: deliveryData.zipCode,
              },

          // Payment Information
          paymentMethod: paymentData.method || 'Crypto',
          paymentStatus: 'pending',
          customerNotes: paymentData.notes || '',

          // Order Status
          orderStatus: 'pending',
          fulfillmentStatus: 'pending',

          // Additional metadata
          orderSource: 'website',
          orderType: 'artwork_purchase',
        };

        console.log('Saving order with data:', orderData);

        // Save to Firestore
        const orderId = await createNewOrder({ orderData });
        
        setLocalOrderId(orderId);
                /* 🔔 SEND EMAIL HERE */
        try {
          console.log("📧 Sending order confirmation email to:", orderData.customerEmail);

          const res = await fetch("/api/send-order-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userEmail: orderData.customerEmail,
              userName: orderData.customerName,
              orderId,
              items: orderData.items,
              subtotal: orderData.totalAmount,
              deliveryAddress: orderData.shippingAddress
            })
          });

          const result = await res.json();
          console.log("📨 Email API result:", result);

        } catch (emailErr) {
          console.error("🔥 Email sending failed:", emailErr);
        }

        // Notify parent component
        if (onOrderSaved) {
          onOrderSaved(orderId, orderData);
        }

        console.log('Order saved successfully with ID:', orderId);
        
      } catch (error) {
        console.error('Error saving order:', error);
        const errorMessage = error.message || 'Failed to save order';
        setLocalError(errorMessage);
        
        // Notify parent component of error
        if (onOrderSaveError) {
          onOrderSaveError(errorMessage);
        }
        
        // Reset flags on error so user can retry
        hasSavedOrder.current = false;
        isCurrentlySaving.current = false;
      } finally {
        setLocalSaving(false);
        isCurrentlySaving.current = false;
      }
    };

    saveOrder();
  }, [isReadyForSave]); // Only depend on isReadyForSave

  // Update local state when props change
  useEffect(() => {
    if (savedOrderId && !localOrderId) {
      setLocalOrderId(savedOrderId);
      hasSavedOrder.current = true;
    }
  }, [savedOrderId]);

  useEffect(() => {
    setLocalError(orderSaveError);
  }, [orderSaveError]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Display order ID
  const displayOrderId = localOrderId ? localOrderId.toUpperCase() : 'PENDING';

  // Error state
  if (localError && !localSaving) {
    return (
      <div className="bg-white rounded-2xl shadow-artistic p-6 sm:p-8">
        <div className="text-center py-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-serif font-bold text-red-900 mb-4">Order Error</h2>
          <p className="text-red-700 mb-6 px-4">{localError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-serif"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (localSaving || isOrderSaving) {
    return (
      <div className="bg-white rounded-2xl shadow-artistic p-6 sm:p-8">
        <div className="text-center py-8">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
          <h2 className="text-3xl font-serif font-bold text-indigo-900 mb-4">Processing Order...</h2>
          <p className="text-indigo-700 px-4">Please wait while we confirm your acquisition.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-artistic p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-indigo-100 opacity-20"></div>
      <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full bg-purple-100 opacity-20"></div>
      
      <div className="relative z-10">
        {/* Success Header */}
        <div className="text-center py-8 border-b border-indigo-100 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg">
            <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-serif font-bold text-indigo-900 mb-4">Acquisition Confirmed</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-indigo-700 mb-6 font-serif px-4">
            Your acquisition request has been registered. Our representative will contact you shortly to complete the ownership transfer process.
          </p>
          
          {/* Order ID and Date */}
          <div className="bg-indigo-50 rounded-xl p-4 max-w-md mx-auto">
            <p className="font-serif text-indigo-800 mb-2">
              <span className="font-medium">Order ID:</span> 
              <span className="bg-indigo-100 px-3 py-1 rounded-full ml-2">
                {displayOrderId}
              </span>
            </p>
            <p className="font-serif text-indigo-700 text-sm">
              <span className="font-medium">Date:</span> {formatDate(new Date())}
            </p>
          </div>
        </div>

        {/* Order Details */}
        <div className="space-y-6 mb-8">
          {/* Ordered Items */}
          <div>
            <h3 className="font-serif text-xl font-bold text-indigo-900 mb-4">Acquired Artworks</h3>
            <div className="space-y-4">
              {checkoutItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-indigo-50 rounded-xl">
                  {item.product?.featureImageUrl && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product.featureImageUrl} 
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h4 className="font-serif font-medium text-indigo-900">
                      {item.product?.title || 'Artwork'}
                    </h4>
                    <p className="text-sm text-indigo-700">
                      Quantity: {item.quantity || 1}
                    </p>
                    {item.product?.category && (
                      <p className="text-xs text-indigo-600">
                        Category: {item.product.categoryID}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-serif font-bold text-indigo-900">
                      {formatCurrency((item.product?.price || 0) * (item.quantity || 1))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
            <h3 className="font-serif text-lg font-bold text-indigo-900 mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-indigo-700">
                <span>Subtotal:</span>
                <span>{formatCurrency(orderTotal)}</span>
              </div>
              <div className="flex justify-between text-indigo-700">
                <span>Shipping:</span>
                <span>Contact for details</span>
              </div>
              <div className="border-t border-indigo-200 pt-2 mt-2">
                <div className="flex justify-between font-serif font-bold text-indigo-900 text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(orderTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          {deliveryData && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-indigo-900 mb-3">Delivery Address</h3>
                <div className="bg-indigo-50 rounded-xl p-4 text-sm text-indigo-700 font-serif">
                  <p className="font-medium">{deliveryData.firstName} {deliveryData.lastName}</p>
                  <p>{deliveryData.address}</p>
                  <p>{deliveryData.city}, {deliveryData.state} {deliveryData.zipCode}</p>
                  {deliveryData.phone && <p>Phone: {deliveryData.phone}</p>}
                </div>
              </div>
              
              <div>
                <h3 className="font-serif text-lg font-bold text-indigo-900 mb-3">Contact Information</h3>
                <div className="bg-indigo-50 rounded-xl p-4 text-sm text-indigo-700 font-serif">
                  <p>Preferred: {paymentData?.contactMethod || 'Email'}</p>
                  <p>Email: {userData?.email || 'Not provided'}</p>
                  {paymentData?.notes && (
                    <div className="mt-2">
                      <p className="font-medium">Notes:</p>
                      <p className="text-xs">{paymentData.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8">
          <h3 className="font-serif text-lg font-medium text-indigo-900 mb-3">What happens next?</h3>
          <ul className="space-y-2 text-sm text-indigo-700 font-serif">
            <li className="flex items-start">
              <svg className="w-4 h-4 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Verification of your purchase details within 24 hours</span>
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Secure payment arrangement and processing</span>
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Artwork transfer and delivery coordination</span>
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Certificate of authenticity and ownership documentation</span>
            </li>
          </ul>
        </div>
        
        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <Link 
            href="/gallery" 
            className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 font-serif font-medium"
          >
            Continue Exploring
          </Link>
          
          {localOrderId && (
            <div className="mt-4">
              <Link 
                href={`/orders/${localOrderId}`}
                className="inline-block px-6 py-2 border-2 border-indigo-300 text-indigo-700 rounded-full hover:bg-indigo-50 transition-colors font-serif"
              >
                View Order Details
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}