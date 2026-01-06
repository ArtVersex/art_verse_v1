// components/checkout/PaymentForm.jsx
"use client"

export default function PaymentForm({ 
  onBack, 
  completeAcquisition, 
  isWhatsapp,
  paymentData,
  onPaymentDataChange,
  onComplete,
  isLoading
}) {
  
  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    const updatedData = { ...paymentData, method };
    onPaymentDataChange(updatedData);
  };

  // Handle notes change
  const handleNotesChange = (notes) => {
    const updatedData = { ...paymentData, notes };
    onPaymentDataChange(updatedData);
  };

  // Handle form submission
  const handleComplete = () => {
    // Use onComplete if provided, otherwise use completeAcquisition
    if (onComplete) {
      onComplete();
    } else if (completeAcquisition) {
      completeAcquisition();
    }
  };

  return (
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
                <input 
                  type="radio" 
                  id="payment-Crypto" 
                  name="payment-method" 
                  className="w-5 h-5 accent-indigo-600" 
                  checked={paymentData?.method === 'Crypto'}
                  onChange={() => handlePaymentMethodChange('Crypto')}
                />
                <label htmlFor="payment-Crypto" className="text-sm font-serif text-indigo-800">Crypto</label>
              </div>
              <div className="flex items-center space-x-3">
                <input 
                  type="radio" 
                  id="payment-card" 
                  name="payment-method" 
                  className="w-5 h-5 accent-indigo-600"
                  checked={paymentData?.method === 'online'}
                  onChange={() => handlePaymentMethodChange('online')}
                />
                <label htmlFor="payment-card" className="text-sm font-serif text-indigo-800">Online</label>
              </div>
              <div className="flex items-center space-x-3">
                <input 
                  type="radio" 
                  id="payment-mix" 
                  name="payment-method" 
                  className="w-5 h-5 accent-indigo-600"
                  checked={paymentData?.method === 'mix'}
                  onChange={() => handlePaymentMethodChange('mix')}
                />
                <label htmlFor="payment-mix" className="text-sm font-serif text-indigo-800">Mix of Crypto & Online</label>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-serif text-indigo-800 mb-2">Additional Payment Notes (Optional)</label>
            <textarea 
              className="w-full border border-indigo-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all bg-white shadow-sm h-24"
              placeholder="Any specific payment arrangements or preferences... Like Bitcoin, Ethereum, etc."
              value={paymentData?.notes || ''}
              onChange={(e) => handleNotesChange(e.target.value)}
            ></textarea>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <button 
            onClick={onBack}
            disabled={isLoading}
            className="px-6 py-3 border border-indigo-300 rounded-xl text-indigo-700 hover:bg-indigo-50 transition-all font-serif font-medium w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Return to Delivery
          </button>
          <button 
            onClick={handleComplete}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 font-serif font-medium w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Complete Acquisition'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}