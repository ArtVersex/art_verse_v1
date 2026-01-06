"use client"

import { useUser } from "@/lib/firestore/user/read";
import { useProductsByIds } from "@/lib/firestore/products/read";
import { clearCart } from "@/lib/firestore/user/cart"; // Add this import

import { useState, useEffect } from "react";

// Import all the separate components
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import ProgressSteps from "./ProgressSteps";
import OrderItems from "./OrderItems";
import DeliveryForm from "./DeliveryForm";
import PaymentForm from "./PaymentForm";
import OrderConfirmation from "./OrderConfirmation";
import OrderSummary from "./OrderSummary";

export default function ArtisticCheckoutComponent({ userId, checkoutType, singleProductId }) {
  const [productIds, setProductIds] = useState([]);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [step, setStep] = useState('shipping');
  const [sameBillingAddress, setSameBillingAddress] = useState(true);
  const [isWhatsapp, setIsWhatsapp] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Add order saving states
  const [savedOrderId, setSavedOrderId] = useState(null);
  const [orderSaveError, setOrderSaveError] = useState(null);
  const [isOrderSaving, setIsOrderSaving] = useState(false);
  const [isCartClearing, setIsCartClearing] = useState(false); // Add cart clearing state

  // Form data states
  const [deliveryData, setDeliveryData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    billingAddress: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  const [paymentData, setPaymentData] = useState({
    method: 'Crypto',
    notes: ''
  });

  // Get user data
  const { user: userData, isLoading: userLoading } = useUser(userId);
  console.log("User Data:", userData);
  console.log("Checkout Type:", checkoutType);
  
  // Extract product IDs from cart or use singleProductId
  useEffect(() => {
    if (checkoutType === 'buynow' && singleProductId) {
      setProductIds([singleProductId]);
    } else if (checkoutType === 'cart' && userData?.cart && Array.isArray(userData.cart)) {
      const ids = userData.cart.map(item => item.productId).filter(Boolean);
      setProductIds(ids);
    }
  }, [checkoutType, singleProductId, userData]);
  
  console.log("Product IDs:", productIds);
  console.log("Single Product ID:", singleProductId);
  
  // Fetch products based on IDs
  const { data: products, isLoading: productsLoading } = useProductsByIds({
    idsList: productIds.length > 0 ? productIds : []
  });
  
  console.log("Products Loaded:", products);
  console.log("Products Loading State:", productsLoading);

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
      }).filter(item => item.product);
    }

    setCheckoutItems(items);
    setSubtotal(total);
  }, [products, checkoutType, singleProductId, userData]);
  
  console.log("Checkout Items:", checkoutItems);
  console.log("Subtotal:", subtotal);

  const isLoading = userLoading || productsLoading;

  // Step navigation functions
  const goToStep = (newStep) => {
    setStep(newStep);
  };

  // Function to clear cart after successful order
  const clearCartAfterOrder = async () => {
    if (checkoutType === 'cart' && userId) {
      try {
        setIsCartClearing(true);
        await clearCart(userId);
        console.log('Cart cleared successfully after order completion');
      } catch (error) {
        console.error('Error clearing cart after order:', error);
        // Don't throw the error here as the order is already complete
        // Just log it for debugging purposes
      } finally {
        setIsCartClearing(false);
      }savedOrderId
    }
  };

  // Enhanced completion function with order saving and cart clearing
  const completeAcquisition = async () => {
    try {
      setIsOrderSaving(true);
      setOrderSaveError(null);
      
      // Move to confirmation step immediately
      setStep('confirmation');
      setFormSubmitted(true);
      
      console.log('Order completion initiated');
      
    } catch (error) {
      console.error('Error completing acquisition:', error);
      setOrderSaveError(error.message || 'Failed to complete order');
      // Stay on payment step if there's an error
      setStep('payment');
    } finally {
      setIsOrderSaving(false);
    }
  };

  // Order save handlers
  const handleOrderSaved = async (orderId, orderData) => {
    console.log('Order saved successfully:', orderId);
    setSavedOrderId(orderId);
    setOrderSaveError(null);
    setIsOrderSaving(false);
    // Clear cart after successful order save (only for cart checkout)
    await clearCartAfterOrder();
  };

  const handleOrderSaveError = (error) => {
    console.error('Order save error:', error);
    setOrderSaveError(error);
    setIsOrderSaving(false);
  };

  // Form handlers
  const handleDeliveryDataChange = (data) => {
    setDeliveryData(data);
  };

  const handlePaymentDataChange = (data) => {
    setPaymentData(data);
  };

  const handleSameBillingChange = (value) => {
    setSameBillingAddress(value);
  };

  const handleWhatsappChange = (value) => {
    setIsWhatsapp(value);
  };

  // Validation function
  const isReadyForOrderSave = () => {
    return (
      checkoutItems.length > 0 &&
      deliveryData.firstName &&
      deliveryData.lastName &&
      deliveryData.address &&
      deliveryData.city &&
      deliveryData.state &&
      deliveryData.zipCode &&
      subtotal > 0
    );
  };

  // Loading State
  if (isLoading) {
    return <LoadingState />;
  }

  // Empty State
  if (checkoutItems.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Progress Steps - Mobile Only */}
        <div className="lg:hidden mb-8">
          <ProgressSteps
            currentStep={step}
            formSubmitted={formSubmitted}
          />
        </div>

        {/* Error Message Display */}
        {orderSaveError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-red-800 font-medium">Order Error: {orderSaveError}</p>
            </div>
          </div>
        )}

        {/* Cart Clearing Status */}
        {isCartClearing && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <svg className="animate-spin w-5 h-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-blue-800 font-medium">Clearing cart...</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items - Always visible */}
            <OrderItems checkoutItems={checkoutItems} />

            {/* Delivery Form - Only shown in shipping step */}
            {step === 'shipping' && (
              <DeliveryForm
                setStep={setStep}
                userId={userId}
                deliveryData={deliveryData}
                onDeliveryDataChange={handleDeliveryDataChange}
                sameBillingAddress={sameBillingAddress}
                setSameBillingAddress={setSameBillingAddress}
                isWhatsapp={isWhatsapp}
                setIsWhatsapp={setIsWhatsapp}
              />
            )}

            {/* Payment Form - Only shown in payment step */}
            {step === 'payment' && (
              <PaymentForm
                paymentData={paymentData}
                onPaymentDataChange={handlePaymentDataChange}
                isWhatsapp={isWhatsapp}
                onBack={() => goToStep('shipping')}
                onComplete={completeAcquisition}
                isLoading={isOrderSaving}
              />
            )}

            {/* Order Confirmation - Only shown in confirmation step */}
            {step === 'confirmation' && (
              <OrderConfirmation
                userData={userData}
                orderTotal={subtotal}
                checkoutItems={checkoutItems}
                deliveryData={deliveryData}
                paymentData={paymentData}
                userId={userId}
                savedOrderId={savedOrderId}
                orderSaveError={orderSaveError}
                isOrderSaving={isOrderSaving}
                onOrderSaved={handleOrderSaved}
                onOrderSaveError={handleOrderSaveError}
                isReadyForSave={isReadyForOrderSave()}
              />
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              checkoutItems={checkoutItems}
              subtotal={subtotal}
              step={step}
              formSubmitted={formSubmitted}
              userData={userData}
              isOrderSaving={isOrderSaving || isCartClearing} // Include cart clearing in loading state
              savedOrderId={savedOrderId}
              onProceedToDelivery={() => {
                if (step === 'shipping') {
                  goToStep('payment');
                } else if (step === 'payment') {
                  completeAcquisition();
                }
              }}
            />
          </div>
        </div>

        {/* Debug Information (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs">
            <h4 className="font-bold mb-2">Debug Info:</h4>
            <p>Step: {step}</p>
            <p>Checkout Type: {checkoutType}</p>
            <p>Items: {checkoutItems.length}</p>
            <p>Subtotal: ${subtotal}</p>
            <p>Order Ready: {isReadyForOrderSave() ? 'Yes' : 'No'}</p>
            <p>Saved Order ID: {savedOrderId || 'None'}</p>
            <p>Order Saving: {isOrderSaving ? 'Yes' : 'No'}</p>
            <p>Cart Clearing: {isCartClearing ? 'Yes' : 'No'}</p>
          </div>
        )}
      </div>
    </div>
  );
}