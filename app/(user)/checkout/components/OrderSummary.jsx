export default function OrderSummary({ 
  checkoutItems, 
  subtotal, 
  step, 
  userData, 
  formSubmitted, 
  onProceedToDelivery,
  savedOrderId, // Add this prop
  isOrderSaving // Add this prop
}) {
  
  const handleContinueShopping = () => {
    // Navigate back to products page or home
    window.location.href = '/gallery'; // Adjust this URL as needed
  };

  const handleViewOrder = () => {
    // Navigate to order details page
    if (savedOrderId) {
      window.location.href = `/orders/${savedOrderId}`; // Adjust this URL as needed
    }
  };

  return (
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
          <h2 className="text-2xl font-serif font-bold text-indigo-900">
            {step === 'confirmation' ? 'Order Complete!' : 'Order Summary'}
          </h2>
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
                <span className="font-serif text-lg font-bold text-indigo-900">Final Total</span>
                <span className="font-serif text-lg font-bold text-indigo-900">${subtotal.toFixed(2)}</span>
              </div>
              
              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <h3 className="font-serif font-medium text-green-900">Order Confirmed!</h3>
                </div>
                {savedOrderId && (
                  <p className="text-sm text-green-700 font-serif">
                    Order ID: {savedOrderId}
                  </p>
                )}
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
        
        {/* Navigation Buttons */}
        {(step === 'shipping' || step === 'payment') && !formSubmitted && onProceedToDelivery && (
          <div className="mt-8">
            <button 
              onClick={onProceedToDelivery}
              disabled={isOrderSaving}
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 font-serif font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isOrderSaving ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                step === 'shipping' ? 'Continue to Payment' : 'Complete Order'
              )}
            </button>
            <p className="text-xs text-center text-indigo-600 font-serif mt-4">
              By proceeding, you agree to our Terms of Sale & Privacy Policy
            </p>
          </div>
        )}

        {/* Confirmation Step Actions */}
        {step === 'confirmation' && (
          <div className="mt-8 space-y-3">
            {savedOrderId && (
              <button 
                onClick={handleViewOrder}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 font-serif font-medium"
              >
                View Order Details
              </button>
            )}
            <button 
              onClick={handleContinueShopping}
              className="w-full px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all duration-300 font-serif font-medium"
            >
              Continue Shopping
            </button>
            <p className="text-xs text-center text-indigo-600 font-serif mt-4">
              Thank you for your purchase! You will receive an email confirmation shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}