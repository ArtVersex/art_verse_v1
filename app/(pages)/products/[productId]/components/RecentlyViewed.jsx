// components/RecentlyViewed.js
import React from 'react';
import Image from 'next/image';

export const RecentlyViewed = ({ currentProductId }) => {
  // Mock recently viewed products - in a real app, this would come from your backend or local storage
  const recentlyViewedProducts = [
    {
      id: 'recent1',
      title: 'Mystic Forest',
      price: 38,
      imageUrl: '/path/to/recent1.jpg'
    },
    {
      id: 'recent2',
      title: 'Urban Landscape',
      price: 42,
      imageUrl: '/path/to/recent2.jpg'
    },
    {
      id: 'recent3',
      title: 'Celestial Dreams',
      price: 55,
      imageUrl: '/path/to/recent3.jpg'
    },
    {
      id: 'recent4',
      title: 'Geometric Patterns',
      price: 35,
      imageUrl: '/path/to/recent4.jpg'
    },
    {
      id: 'recent5',
      title: 'Sunset Boulevard',
      price: 45,
      imageUrl: '/path/to/recent5.jpg'
    },
    {
      id: 'recent6',
      title: 'Mountain Serenity',
      price: 50,
      imageUrl: '/path/to/recent6.jpg'
    }
  ];

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Recently Viewed</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
          {recentlyViewedProducts
            .filter(product => product.id !== currentProductId)
            .map((product) => (
              <div key={product.id} className="group relative">
                <div className="aspect-w-1 aspect-h-1 bg-white rounded-lg overflow-hidden shadow-sm">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:opacity-75 transition-opacity"
                  />
                </div>
                <div className="mt-2">
                  <h3 className="text-xs text-gray-700 truncate">{product.title}</h3>
                  <p className="text-xs font-medium text-gray-900">${product.price}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};