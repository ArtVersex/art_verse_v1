export default function LoadingState() {
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