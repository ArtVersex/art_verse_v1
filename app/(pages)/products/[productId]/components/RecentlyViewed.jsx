import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const RecentlyViewed = ({ currentProductId }) => {
  // Mock recently viewed products - in a real app, this would come from your backend or local storage
  const recentlyViewedProducts = [
    {
      id: 'recent1',
      title: 'Mystic Forest',
      artist: 'Clara Blum',
      price: 380,
      imageUrl: '/path/to/recent1.jpg'
    },
    {
      id: 'recent2',
      title: 'Urban Landscape',
      artist: 'Marco Velázquez',
      price: 420,
      imageUrl: '/path/to/recent2.jpg'
    },
    {
      id: 'recent3',
      title: 'Celestial Dreams',
      artist: 'Aisha Patel',
      price: 550,
      imageUrl: '/path/to/recent3.jpg'
    },
    {
      id: 'recent4',
      title: 'Geometric Patterns',
      artist: 'Julian Mercer',
      price: 350,
      imageUrl: '/path/to/recent4.jpg'
    }
  ];

  // Filter out current product
  const filteredProducts = recentlyViewedProducts.filter(product => product.id !== currentProductId);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">Your Artistic Journey</h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">Artworks you've recently explored and contemplated</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <Link href={`/artwork/${product.id}`} key={product.id} className="block group">
              <div className="relative aspect-square mb-4 overflow-hidden rounded-lg shadow-md transition-all duration-500 group-hover:shadow-xl">
                <div className="absolute inset-0 bg-black/5 z-10 group-hover:bg-black/0 transition-colors duration-300"></div>
                
                {/* Background decorative frame */}
                <div className="absolute inset-4 border border-amber-200 rounded z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Image */}
                <div className="relative h-full w-full transform group-hover:scale-105 transition-transform duration-700">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Hover overlay with info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 z-20">
                  <h3 className="text-white font-serif font-medium">{product.title}</h3>
                  <p className="text-amber-300 text-sm">{product.artist}</p>
                </div>
              </div>
              
              {/* Info below the image */}
              <div className="px-1">
                <h3 className="font-serif font-medium text-gray-900 group-hover:text-amber-600 transition-colors duration-300">{product.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.artist}</p>
                <p className="text-amber-600 font-medium">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 font-serif italic">Continue exploring our gallery to discover more artistic treasures</p>
          </div>
        )}
        
        {filteredProducts.length > 0 && (
          <div className="mt-12 text-center">
            <Link href="/gallery" className="inline-flex items-center px-6 py-3 border border-amber-300 text-base font-medium rounded-full text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors duration-300">
              Explore Full Gallery
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};