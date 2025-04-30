import React from 'react';
import { getcategory } from '@/lib/firestore/categories/read_server';
import { getBrands } from '@/lib/firestore/brands/read_server';
import Link from 'next/link';
import { Calendar, Brush, Frame } from 'lucide-react';

export const ProductHeader = ({ product }) => {
  return (
    <div className="space-y-6 md:space-y-8 pb-6 md:pb-10 relative">
      {/* Artistic canvas border frame - adjusted for mobile */}
      <div className="absolute -inset-3 md:-inset-6 border-2 border-stone-100 rounded-xl pointer-events-none"></div>
      <div className="absolute -inset-3 md:-inset-6 border-[1px] border-amber-100 rounded-xl pointer-events-none"></div>
      
      {/* Decorative brush stroke - adjusted size for mobile */}
      <div className="absolute -top-4 -left-3 md:-top-6 md:-left-6 text-amber-200 opacity-30">
        <Brush className="w-10 h-10 md:w-16 md:h-16 transform -rotate-12" />
      </div>
      
      {/* Title with artistic styling - responsive text sizes */}
      <div className="relative z-10 pt-3 md:pt-4">
        <div className="flex items-center space-x-2 mb-1 md:mb-2">
          <Frame className="h-4 w-4 md:h-5 md:w-5 text-amber-600" />
          <h3 className="text-xs md:text-sm uppercase tracking-widest text-stone-500 font-serif">Artist's Creation</h3>
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-stone-800 tracking-tight leading-tight">
          {product?.title || "Artist's Work"}
        </h1>
        
        {/* Artistic underline with gradient - responsive width */}
        <div className="h-1 w-24 md:w-32 mt-3 md:mt-4 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
      </div>

      {/* Tags with artistic styling - improved wrapping for mobile */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3 z-10 relative">
        {product?.categoryID && (
          <span className="animate-fade-in">
            <Category categoryId={product.categoryID} />
          </span>
        )}

        {product?.brandID && (
          <span className="animate-fade-in">
            <Brand brandId={product.brandID} />
          </span>
        )}
        
        {product?.isFeatured && (
          <span className="inline-flex items-center px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <span className="mr-1 text-amber-500">✦</span>
            Featured Work
          </span>
        )}
        
        {product?.formattedDate && (
          <span className="inline-flex items-center px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium bg-stone-50 text-stone-800 border border-stone-200">
            <Calendar className="mr-1 w-3 h-3" />
            Created {product.formattedDate}
          </span>
        )}
      </div>

      {/* Description with artistic paper texture styling - mobile padding */}
      {product?.shortDescription && (
        <div className="relative z-10 bg-stone-50/50 rounded-lg p-4 md:p-6 border border-stone-100 shadow-sm">
          {/* Decorative quote marks - adjusted position for mobile */}
          <span className="absolute top-1 left-2 md:top-2 md:left-3 text-3xl md:text-5xl font-serif text-amber-200">"</span>
          <span className="absolute bottom-1 right-2 md:bottom-2 md:right-3 text-3xl md:text-5xl font-serif text-amber-200">"</span>
          
          <p className="text-sm md:text-base text-stone-700 leading-relaxed max-w-2xl font-serif italic relative z-10 px-3">
            {product.shortDescription}
          </p>
        </div>
      )}
      
      {/* Artwork details - improved grid for mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-3 md:pt-4 border-t border-stone-100 z-10 relative">
        {product?.dimensions && (
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-serif mb-1">Dimensions</span>
            <span className="font-serif text-sm md:text-base text-stone-800">{product.dimensions}</span>
          </div>
        )}
        
        {product?.medium && (
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-serif mb-1">Medium</span>
            <span className="font-serif text-sm md:text-base text-stone-800">{product.medium}</span>
          </div>
        )}
        
        {product?.artist && (
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-serif mb-1">Artist</span>
            <span className="font-serif text-sm md:text-base text-stone-800">{product.artist}</span>
          </div>
        )}
      </div>
    </div>
  );
};

async function Category({ categoryId }) {
  const category = await getcategory({ id: categoryId });

  if (!category) return null;

  return (
    <Link href={`/categories/${category.id}`} className="hover:opacity-80 transition-opacity">
      <div className="flex gap-1 items-center border border-stone-200 px-2 py-1 md:px-3 md:py-1 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors shadow-sm">
        {category.imageUrl && (
          <img
            className="h-3 w-3 md:h-4 md:w-4 object-contain"
            src={category.imageUrl}
            alt={category.name || "Category"}
          />
        )}
        <h4 className="text-xs font-serif font-semibold text-blue-800">{category.name}</h4>
      </div>
    </Link>
  );
}

async function Brand({ brandId }) {
  const brand = await getBrands({ id: brandId });

  if (!brand) return null;

  return (
    <Link href={`/brands/${brand.id}`} className="hover:opacity-80 transition-opacity">
      <div className="flex gap-1 items-center border border-stone-200 px-2 py-1 md:px-3 md:py-1 rounded-full bg-stone-50 hover:bg-stone-100 transition-colors shadow-sm">
        {brand.imageUrl && (
          <img
            className="h-3 w-3 md:h-4 md:w-4 object-contain"
            src={brand.imageUrl}
            alt={brand.name || "Brand"}
          />
        )}
        <h4 className="text-xs font-serif font-semibold text-stone-800">{brand.name}</h4>
      </div>
    </Link>
  );
}