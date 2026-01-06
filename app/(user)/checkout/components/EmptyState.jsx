import Link from "next/link";

export default function EmptyState() {
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