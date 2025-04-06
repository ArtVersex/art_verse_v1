"use client"

import { useUser } from "@/lib/firestore/user/read";
import { useProductsByIds } from "@/lib/firestore/products/read";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CheckoutComponent({ userId, checkoutType, singleProductId }) {
  const [productIds, setProductIds] = useState([]);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [step, setStep] = useState('review'); 
  
  // Get user data with fixed parameter
  const { user: userData, isLoading: userLoading } = useUser(userId);
  
  // Extract product IDs from cart or use singleProductId
  useEffect(() => {
    if (checkoutType === 'buynow' && singleProductId) {
      setProductIds([singleProductId]);
    } else if (checkoutType === 'cart' && userData?.cart && Array.isArray(userData.cart)) {
      const ids = userData.cart.map(item => item.productId).filter(Boolean);
      setProductIds(ids);
    }
  }, [checkoutType, singleProductId, userData]);
  
  // Fetch products based on IDs
  const { data: products, isLoading: productsLoading } = useProductsByIds({ 
    idsList: productIds.length > 0 ? productIds : [] 
  });
  
  // Prepare checkout items once products are loaded
  useEffect(() => {
    if (!products || products.length === 0) return;
    
    let items = [];
    let total = 0;
    
    if (checkoutType === 'buynow' && singleProductId) {
      const product = products.find(p => p.id === singleProductId);
      if (product) {
        items = [{
          id: product.id,
          productId: product.id,
          quantity: 1,
          product
        }];
        total = product.price || 0;
      }
    } else if (checkoutType === 'cart' && userData?.cart && Array.isArray(userData.cart)) {
      items = userData.cart.map(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        const itemTotal = product ? (product.price || 0) * (cartItem.quantity || 1) : 0;
        total += itemTotal;
        
        return {
          ...cartItem,
          product
        };
      }).filter(item => item.product); // Only include items with matching products
    }
    
    setCheckoutItems(items);
    setSubtotal(total);
  }, [products, checkoutType, singleProductId, userData]);
  
  const isLoading = userLoading || productsLoading;
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-pulse space-y-4 w-full max-w-md">
          <div className="h-6 bg-slate-200 rounded w-3/4"></div>
          <div className="h-32 bg-slate-200 rounded"></div>
          <div className="h-6 bg-slate-200 rounded w-1/2"></div>
          <div className="h-6 bg-slate-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }
  
  if (checkoutItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">No Items to Checkout</h2>
        <p className="mb-4">We couldn't find any products for your checkout.</p>
        <Link href="/products" className="px-4 py-2 bg-blue-500 text-white rounded">
          Browse Products
        </Link>
      </div>
    );
  }
  
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Left Column - Order Items */}
      <div className="md:col-span-2">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Order Items</h2>
          
          <div className="space-y-4">
            {checkoutItems.map((item, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start">
                  <div className="bg-gray-100 rounded w-20 h-20 flex items-center justify-center mr-4">
                    {item.product?.featureImageUrl ? (
                      <img 
                        src={item.product.featureImageUrl} 
                        alt={item.product.title} 
                        className="max-h-16 max-w-16 object-contain"
                      />
                    ) : (
                      <div className="text-gray-400 text-xs">No Image</div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product?.title || 'Product'}</h3>
                    <p className="text-sm text-gray-600">
                      Product ID: {item.product?.id}
                    </p>
                    <div className="flex justify-between mt-2">
                      <div className="text-sm">
                        Qty: {item.quantity || 1}
                      </div>
                      <div className="font-medium">
                        ${((item.product?.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Shipping Information - only shown when in shipping step */}
        {step === 'shipping' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ZIP Code</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <button 
                onClick={() => setStep('review')}
                className="px-4 py-2 border border-gray-300 rounded"
              >
                Back to Review
              </button>
              <button 
                onClick={() => setStep('payment')}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}
        
        {/* Payment Information - only shown when in payment step */}
        {step === 'payment' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Card Number</label>
                <input 
                  type="text" 
                  placeholder="•••• •••• •••• ••••"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Expiration Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">CVC</label>
                  <input 
                    type="text" 
                    placeholder="•••"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Name on Card</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <button 
                onClick={() => setStep('shipping')}
                className="px-4 py-2 border border-gray-300 rounded"
              >
                Back to Shipping
              </button>
              <button 
                onClick={() => setStep('confirmation')}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Complete Order
              </button>
            </div>
          </div>
        )}
        
        {/* Order Confirmation - only shown when in confirmation step */}
        {step === 'confirmation' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
              <p className="text-gray-600 mb-6">
                Your order has been placed successfully. You will receive a confirmation email shortly.
              </p>
              <p className="font-medium">Order #: 78293-A</p>
              
              <div className="mt-8">
                <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded">
                  Continue Shopping
                </Link>
                
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Right Column - Order Summary */}
      <div className="md:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>$0</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${(subtotal * 0.12).toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${(subtotal + 0 + (subtotal * 0.12)).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {step === 'review' && (
            <button 
              onClick={() => setStep('shipping')}
              className="w-full py-3 bg-blue-500 text-white rounded font-medium"
            >
              Proceed to Checkout
            </button>
          )}
          
          <div className="mt-6 text-sm text-gray-500">
            <p className="mb-2">We accept:</p>
            <div className="flex space-x-2">
              <div className="w-10 h-6 bg-gray-200 rounded"></div>
              <div className="w-10 h-6 bg-gray-200 rounded"></div>
              <div className="w-10 h-6 bg-gray-200 rounded"></div>
              <div className="w-10 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}