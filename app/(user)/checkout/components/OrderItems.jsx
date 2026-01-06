export default function OrderItems({ checkoutItems }) {
  return (
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
  );
}