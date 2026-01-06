export default function ProgressSteps({ step, formSubmitted }) {
    const steps = [
      { key: 'review', label: 'Review' },
      { key: 'shipping', label: 'Delivery' },
      { key: 'payment', label: 'Payment' },
      { key: 'confirmation', label: 'Complete' }
    ];
  
    const getProgressWidth = () => {
      switch (step) {
        case 'review': return 'w-1/4';
        case 'shipping': return 'w-2/4';
        case 'payment': return 'w-3/4';
        case 'confirmation': return 'w-full';
        default: return 'w-1/4';
      }
    };
  
    return (
      <div className="lg:hidden mb-8">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-indigo-100 -translate-y-1/2 z-0"></div>
          <div 
            className={`absolute top-1/2 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 -translate-y-1/2 z-10 transition-all duration-500 ${getProgressWidth()}`}
          ></div>
          
          {steps.map((s, i) => (
            <div key={s.key} className="relative z-20">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-serif font-medium ${
                  step === s.key || (s.key === 'confirmation' && formSubmitted) ? 
                  'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md' : 
                  'bg-white border-2 border-indigo-200 text-indigo-400'
                }`}
              >
                {i + 1}
              </div>
              <div 
                className={`absolute top-full mt-2 text-xs font-serif whitespace-nowrap left-1/2 transform -translate-x-1/2 ${
                  step === s.key || (s.key === 'confirmation' && formSubmitted) ? 
                  'text-indigo-800 font-medium' : 'text-indigo-400'
                }`}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }