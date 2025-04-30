"use client"

import { useUser } from "@/lib/firestore/user/read";
import { useProductsByIds } from "@/lib/firestore/products/read";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ArtisticCheckoutComponent({ userId, checkoutType, singleProductId }) {
  const [productIds, setProductIds] = useState([]);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [step, setStep] = useState('review'); 
  const [sameBillingAddress, setSameBillingAddress] = useState(true);
  const [isWhatsapp, setIsWhatsapp] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
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
  
  const completeAcquisition = () => {
    setStep('confirmation');
    setFormSubmitted(true);
  };
  
  // Artistic Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <div className="relative mx-auto w-24 h-24 mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200 animate-spin border-t-indigo-600"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-indigo-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-serif font-bold text-indigo-900 mb-2">Curating Your Collection</h3>
          <p className="font-serif italic text-indigo-700 mb-6">Gathering your selected masterpieces with care...</p>
          <div className="h-2 w-full bg-indigo-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 animate-progress"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Artistic Empty State
  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-artistic p-8 max-w-md w-full relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-indigo-100 opacity-30"></div>
          <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-purple-100 opacity-30"></div>
          
          <div className="relative z-10 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-serif font-bold text-indigo-900 mb-3">Your Collection Awaits</h2>
            <div className="w-16 h-1 bg-amber-400 mx-auto mb-6 transform rotate-1"></div>
            <p className="font-serif text-indigo-700 mb-8">The gallery is empty, but full of potential. Begin your collection today.</p>
            <Link href="/products" className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 font-serif font-medium">
              Explore Gallery
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Progress Steps - Mobile Only */}
        <div className="lg:hidden mb-8">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-indigo-100 -translate-y-1/2 z-0"></div>
            <div 
              className={`absolute top-1/2 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 -translate-y-1/2 z-10 transition-all duration-500 ${
                step === 'review' ? 'w-1/4' : 
                step === 'shipping' ? 'w-2/4' : 
                step === 'payment' ? 'w-3/4' : 
                'w-full'
              }`}
            ></div>
            
            {['review', 'shipping', 'payment', 'confirmation'].map((s, i) => (
              <div key={s} className="relative z-20">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-serif font-medium ${
                    step === s || (s === 'confirmation' && formSubmitted) ? 
                    'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md' : 
                    'bg-white border-2 border-indigo-200 text-indigo-400'
                  }`}
                >
                  {i + 1}
                </div>
                <div 
                  className={`absolute top-full mt-2 text-xs font-serif whitespace-nowrap left-1/2 transform -translate-x-1/2 ${
                    step === s || (s === 'confirmation' && formSubmitted) ? 
                    'text-indigo-800 font-medium' : 'text-indigo-400'
                  }`}
                >
                  {s === 'review' ? 'Review' : 
                   s === 'shipping' ? 'Delivery' : 
                   s === 'payment' ? 'Payment' : 'Complete'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items Card */}
            <div className="bg-white rounded-2xl shadow-artistic p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-indigo-100 opacity-20"></div>
              <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full bg-purple-100 opacity-20"></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-8">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-indigo-900">Your Masterpieces</h2>
                </div>
                
                <div className="space-y-6">
                  {checkoutItems.map((item, index) => (
                    <div key={index} className="border-b border-indigo-100 pb-6 last:border-b-0">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start group hover:bg-indigo-50/50 p-4 rounded-xl transition-all duration-300">
                        <div className="relative mb-4 sm:mb-0 sm:mr-6 transform group-hover:rotate-2 transition-transform duration-300">
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg transform rotate-1 -z-10"></div>
                          {item.product?.featureImageUrl ? (
                            <img 
                              src={item.product.featureImageUrl} 
                              alt={item.product.title} 
                              className="h-28 w-28 object-contain bg-white p-2 rounded-lg shadow-sm border border-indigo-100"
                            />
                          ) : (
                            <div className="h-28 w-28 flex items-center justify-center text-indigo-300 font-serif italic bg-white rounded-lg border border-indigo-100">
                              No Image
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="font-serif text-xl font-medium text-indigo-900 mb-1">{item.product?.title || 'Masterpiece'}</h3>
                          <p className="text-sm text-indigo-600 font-serif mb-3">
                            ID: {item.product?.id}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:justify-between items-center">
                            <div className="flex items-center mb-3 sm:mb-0">
                              <span className="text-sm font-serif italic text-indigo-700 mr-2">Quantity:</span>
                              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                                {item.quantity || 1}
                              </span>
                            </div>
                            <div className="font-serif text-xl font-medium text-indigo-900">
                              ${((item.product?.price || 0) * (item.quantity || 1)).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Delivery Information - only shown when in shipping step */}
            {step === 'shipping' && (
              <div className="bg-white rounded-2xl shadow-artistic p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-indigo-100 opacity-20"></div>
                <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full bg-purple-100 opacity-20"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                      </svg>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-indigo-900">Delivery Information</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-serif text-indigo-800 mb-2">First Name</label>
                        <input 
                          type="text" 
                          className="w-full border border-indigo-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all bg-white shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-serif text-indigo-800 mb-2">Last Name</label>
                        <input 
                          type="text" 
                          className="w-full border border-indigo-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all bg-white shadow-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-serif text-indigo-800 mb-2">Address</label>
                      <input 
                        type="text" 
                        className="w-full border border-indigo-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all bg-white shadow-sm"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-serif text-indigo-800 mb-2">City</label>
                        <input 
                          type="text" 
                          className="w-full border border-indigo-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all bg-white shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-serif text-indigo-800 mb-2">State</label>
                        <input 
                          type="text" 
                          className="w-full border border-indigo-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all bg-white shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-serif text-indigo-800 mb-2">ZIP Code</label>
                        <input 
                          type="text" 
                          className="w-full border border-indigo-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all bg-white shadow-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-serif text-indigo-800 mb-2">Phone Number</label>
                        <input 
                          type="tel" 
                          className="w-full border border-indigo-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all bg-white shadow-sm"
                        />
                      </div>
                      <div className="flex items-center space-x-3 mt-6">
                        <input 
                          type="checkbox" 
                          id="whatsapp-check" 
                          checked={isWhatsapp}
                          onChange={() => setIsWhatsapp(!isWhatsapp)}
                          className="w-5 h-5 accent-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor="whatsapp-check" className="text-sm font-serif text-indigo-800">
                          This number is available on WhatsApp
                        </label>
                      </div>
                    </div>
                    
                    <div className="border-t border-indigo-200 pt-6 mt-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <input 
                          type="checkbox" 
                          id="billing-check" 
                          checked={sameBillingAddress}
                          onChange={() => setSameBillingAddress(!sameBillingAddress)}
                          className="w-5 h-5 accent-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor="billing-check" className="text-sm font-serif text-indigo-800">
                          Billing address is the same as delivery address
                        </label>
                      </div>
                      
                      {!sameBillingAddress && (
                        <div className="space-y-6">
                          <h3 className="font-serif text-xl font-medium text-indigo-900">Billing Address</h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                              <label className="block text-sm font-serif text-indigo-800 mb-2">First Name</label>
                              <input 
                                type="text" 
                                className="w-full border border-indigo-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all bg-white shadow-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-serif text-indigo-800 mb-2">Last Name</label>
                              <input 
                                type="text" 
                                className="w-full border border-indigo-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all bg-white shadow-sm"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-serif text-indigo-800 mb-2">Address</label>
                            <input 
                              type="text" 
                              className="w-full border border-indigo-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all bg-white shadow-sm"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                            <div>
                              <label className="block text-sm font-serif text-indigo-800 mb-2">City</label>
                              <input 
                                type="text" 
                                className="w-full border border-indigo-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all bg-white shadow-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-serif text-indigo-800 mb-2">State</label>
                              <input 
                                type="text" 
                                className="w-full border border-indigo-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all bg-white shadow-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-serif text-indigo-800 mb-2">ZIP Code</label>
                              <input 
                                type="text" 
                                className="w-full border border-indigo-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all bg-white shadow-sm"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-8 flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                    <button 
                      onClick={() => setStep('review')}
                      className="px-6 py-3 border border-indigo-300 rounded-xl text-indigo-700 hover:bg-indigo-50 transition-all font-serif font-medium w-full sm:w-auto"
                    >
                      Return to Review
                    </button>
                    <button 
                      onClick={() => setStep('payment')}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 font-serif font-medium w-full sm:w-auto"
                    >
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Payment Information - only shown when in payment step */}
            {step === 'payment' && (
              <div className="bg-white rounded-2xl shadow-artistic p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-indigo-100 opacity-20"></div>
                <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full bg-purple-100 opacity-20"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                      </svg>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-indigo-900">Payment Method</h2>
                  </div>
                  
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg">
                    <p className="font-serif text-amber-800 text-sm">
                      <span className="font-bold">Note:</span> Since this is an artwork acquisition, we will connect with you via your preferred contact method to complete the ownership transfer and payment process securely.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-serif text-xl font-medium text-indigo-900 mb-4">Payment Options</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <input type="radio" id="payment-cash" name="payment-method" className="w-5 h-5 accent-indigo-600" defaultChecked />
                          <label htmlFor="payment-cash" className="text-sm font-serif text-indigo-800">Cash</label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <input type="radio" id="payment-card" name="payment-method" className="w-5 h-5 accent-indigo-600" />
                          <label htmlFor="payment-card" className="text-sm font-serif text-indigo-800">Card</label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <input type="radio" id="payment-mix" name="payment-method" className="w-5 h-5 accent-indigo-600" />
                          <label htmlFor="payment-mix" className="text-sm font-serif text-indigo-800">Mix of Cash & Card</label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-serif text-indigo-800 mb-2">Additional Payment Notes (Optional)</label>
                      <textarea 
                        className="w-full border border-indigo-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all bg-white shadow-sm h-24"
                        placeholder="Any specific payment arrangements or preferences..."
                      ></textarea>
                    </div>

                    <div className="border-t border-indigo-200 pt-6 mt-6">
                      <h3 className="font-serif text-xl font-medium text-indigo-900 mb-4">Preferred Contact Method</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <input type="radio" id="contact-email" name="contact-method" className="w-5 h-5 accent-indigo-600" defaultChecked />
                          <label htmlFor="contact-email" className="text-sm font-serif text-indigo-800">Email</label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <input type="radio" id="contact-phone" name="contact-method" className="w-5 h-5 accent-indigo-600" />
                          <label htmlFor="contact-phone" className="text-sm font-serif text-indigo-800">Phone</label>
                        </div>
                        {isWhatsapp && (
                          <div className="flex items-center space-x-3">
                            <input type="radio" id="contact-whatsapp" name="contact-method" className="w-5 h-5 accent-indigo-600" />
                            <label htmlFor="contact-whatsapp" className="text-sm font-serif text-indigo-800">WhatsApp</label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                    <button 
                      onClick={() => setStep('shipping')}
                      className="px-6 py-3 border border-indigo-300 rounded-xl text-indigo-700 hover:bg-indigo-50 transition-all font-serif font-medium w-full sm:w-auto"
                    >
                      Return to Delivery
                    </button>
                    <button 
                      onClick={completeAcquisition}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 font-serif font-medium w-full sm:w-auto"
                    >
                      Complete Acquisition
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Order Confirmation - only shown when in confirmation step */}
            {step === 'confirmation' && (
              <div className="bg-white rounded-2xl shadow-artistic p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-indigo-100 opacity-20"></div>
                <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full bg-purple-100 opacity-20"></div>
                
                <div className="relative z-10 text-center py-8">
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
                  <p className="font-serif text-indigo-800 mb-8">
                    <span className="font-medium bg-indigo-100 px-3 py-1 rounded-full">Reference: 78293-A</span>
                  </p>
                  
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 max-w-md mx-auto mb-8 text-left">
                    <h3 className="font-serif text-lg font-medium text-indigo-900 mb-3">What happens next?</h3>
                    <ul className="space-y-2 text-sm text-indigo-700 font-serif">
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Verification of your purchase details</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Secure payment arrangement</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Artwork transfer coordination</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Certificate of authenticity</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mt-8">
                    <Link href="/gallery" className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 font-serif font-medium">
                      Continue Exploring
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-artistic p-6 sticky top-8 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-indigo-100 opacity-20"></div>
              <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full bg-purple-100 opacity-20"></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-8">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-indigo-900">Order Summary</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-indigo-100">
                    <span className="font-serif text-indigo-700">Artworks ({checkoutItems.length})</span>
                    <span className="font-serif font-medium text-indigo-900">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {step !== 'confirmation' && (
                    <>
                      <div className="flex justify-between items-center pb-4 border-b border-indigo-100">
                        <span className="font-serif text-indigo-700">Shipping & Handling</span>
                        <span className="font-serif text-indigo-700">TBD</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-4 border-b border-indigo-100">
                        <span className="font-serif text-indigo-700">Tax</span>
                        <span className="font-serif text-indigo-700">Calculated at completion</span>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4">
                        <span className="font-serif text-lg font-bold text-indigo-900">Total</span>
                        <span className="font-serif text-lg font-bold text-indigo-900">${subtotal.toFixed(2)}+</span>
                      </div>
                      
                      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mt-6">
                        <p className="font-serif text-amber-800 text-sm">
                          Final total will be calculated during ownership transfer process including applicable taxes and shipping.
                        </p>
                      </div>
                    </>
                  )}
                  
                  {step === 'confirmation' && (
                    <>
                      <div className="flex justify-between items-center pt-4">
                        <span className="font-serif text-lg font-bold text-indigo-900">Subtotal</span>
                        <span className="font-serif text-lg font-bold text-indigo-900">${subtotal.toFixed(2)}</span>
                      </div>
                      
                      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mt-6">
                        <h3 className="font-serif font-medium text-indigo-900 mb-3">Contact Information</h3>
                        {userData?.email && (
                          <p className="text-sm text-indigo-700 font-serif mb-2 flex items-start">
                            <svg className="w-4 h-4 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            <span>{userData.email}</span>
                          </p>
                        )}
                        {userData?.phone && (
                          <p className="text-sm text-indigo-700 font-serif flex items-start">
                            <svg className="w-4 h-4 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                            <span>{userData.phone}</span>
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
                
                {step === 'review' && !formSubmitted && (
                  <div className="mt-8">
                    <button 
                      onClick={() => setStep('shipping')}
                      className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 font-serif font-medium"
                    >
                      Proceed to Delivery
                    </button>
                    <p className="text-xs text-center text-indigo-600 font-serif mt-4">
                      By proceeding, you agree to our Terms of Sale & Privacy Policy
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}