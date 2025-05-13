import React from 'react';
import { Palette, Check, AlertCircle, CreditCard } from 'lucide-react';

export const ProductPricing = ({ product }) => {
  const discountPercentage = product?.salePrice && product?.price
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;
    
  // Format prices with commas for thousands
  const formatPrice = (price) => {
    // return price ? (price / 100).toLocaleString() : "0";
    return price;
  };

  const mainPrice = product?.salePrice || product?.price;
  const formattedMainPrice = formatPrice(mainPrice);
  const formattedOriginalPrice = formatPrice(product?.price);
  const installmentAmount = mainPrice ? Math.round(mainPrice / 400) / 25 : 0;
  
  // Check if it's considered a premium item
  const isPremiumArtwork = product?.price && product.price > 100000;

  return (
    <div className="space-y-4 md:space-y-6 relative">
      {/* Decorative watermark - adjusted for mobile */}
      <div className="absolute -right-1 md:-right-2 top-0 opacity-5 pointer-events-none">
        <Palette className="h-16 w-16 md:h-24 md:w-24" />
      </div>
      
      {/* Artist's valuation heading with decorative elements */}
      <div className="flex items-center space-x-2 mb-1">
        <h3 className="text-xs md:text-sm uppercase tracking-widest text-stone-500 font-serif">Artist's Valuation</h3>
        <div className="h-px flex-grow bg-gradient-to-r from-stone-200 to-transparent"></div>
      </div>
      
      {/* Price display with artistic styling - improved spacing for mobile */}
      <div className="flex items-baseline relative">
        {product?.salePrice ? (
          <>
            <div className="relative">
              <span className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-stone-800">
                ${formattedMainPrice}
              </span>
              {/* Gold accent underneath */}
              <div className="h-1 w-full bg-gradient-to-r from-amber-200 to-amber-400 mt-1"></div>
            </div>
            
            <div className="ml-3 md:ml-4 flex flex-col">
              <span className="text-lg md:text-xl text-stone-400 line-through font-serif">
                ${formattedOriginalPrice}
              </span>
              {discountPercentage > 0 && (
                <span className="font-serif text-xs text-amber-600 mt-1">
                  Collector's discount: {discountPercentage}%
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="relative">
            <span className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-stone-800">
              ${formattedMainPrice}
            </span>
            {/* Gold accent underneath */}
            <div className="h-1 w-full bg-gradient-to-r from-amber-200 to-amber-400 mt-1"></div>
          </div>
        )}
      </div>

      {/* Availability indicator with artistic styling - adjusted spacing */}
      <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-stone-100">
        {product?.stock > 0 ? (
          <div className="flex items-center">
            <div className="p-1 rounded-full bg-green-100 mr-2 md:mr-3">
              <Check className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
            </div>
            <div>
              <span className="font-serif font-medium text-sm md:text-base text-stone-800">
                Available for Collection
              </span>
              {product?.stock <= 3 && (
                <p className="text-xs font-serif text-amber-600 mt-1">
                  Only {product.stock} {product.stock === 1 ? 'piece' : 'pieces'} remaining in this collection
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="p-1 rounded-full bg-amber-100 mr-2 md:mr-3">
              <AlertCircle className="h-3 w-3 md:h-4 md:w-4 text-amber-600" />
            </div>
            <div>
              <span className="font-serif font-medium text-sm md:text-base text-stone-800">
                Masterpiece Acquired
              </span>
              <p className="text-xs font-serif text-stone-600 mt-1">
                Contact us to commission a similar piece from the artist
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Museum-worthy seal for premium items - adjusted padding for mobile */}
      {isPremiumArtwork && (
        <div className="mt-3 md:mt-4 inline-block border-2 border-amber-200 rounded-full px-3 md:px-4 py-1 text-xs font-serif text-amber-800 bg-amber-50">
          <span className="inline-block mr-1 transform -rotate-12">✦</span>
          Museum-Quality Acquisition
        </div>
      )}
      
      {/* Authentication mark for artwork - preserved */}
      <div className="flex items-center justify-center mt-6 md:mt-8">
        <div className="h-px w-8 md:w-12 bg-stone-200"></div>
        <div className="px-3 md:px-4 text-xs uppercase tracking-wider text-stone-400 font-serif">Authenticated</div>
        <div className="h-px w-8 md:w-12 bg-stone-200"></div>
      </div>
    </div>
  );
};