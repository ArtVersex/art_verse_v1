import React from 'react';
import ProductsGridView from "@/app/components/Products";
import { getProductByCategory } from "@/lib/firestore/products/read_server";
import { ArrowRightCircle } from "lucide-react";

// This is a server component that can be async
export async function RelatedProducts({ categoryId }) {
  // Fetch related products by category
  const products = await getProductByCategory({ categoryId: categoryId });
  
  // Limit to maximum 4 products for related section
  const limitedProducts = products?.slice(0, 4) || [];
  
  return (
    <div className="relative mt-12 sm:mt-16 mb-10 sm:mb-12">
      {/* Decorative background element */}
      <div className="absolute -top-6 sm:-top-8 left-0 w-16 sm:w-24 h-16 sm:h-24 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 opacity-60 blur-lg"></div>
      
      {/* Section header with artistic elements */}
      <div className="relative flex items-center justify-between mb-6 sm:mb-8 border-b border-gray-100 pb-3 sm:pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
          <span className="inline-block w-1 h-6 sm:h-8 bg-indigo-500 mr-2 sm:mr-3 rounded-full"></span>
          You May Also Like
        </h2>
        <a href="/collections" className="flex items-center text-sm sm:text-base text-indigo-600 hover:text-indigo-800 transition-colors font-medium">
          <span className="hidden sm:inline">View All Collection</span>
          <span className="sm:hidden">View All</span>
          <ArrowRightCircle className="ml-1 sm:ml-2 w-4 h-4" />
        </a>
      </div>
      
      {/* Products grid container - using ProductsGridView for both mobile and desktop */}
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute -right-4 bottom-12 w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-gradient-to-r from-pink-100 to-indigo-100 opacity-60 blur-md"></div>
        
        {/* Use ProductsGridView component for both mobile and desktop */}
        <div className="relative z-10">
          {/* Pass limited products and set initialDisplayCount to match the number of products */}
          <ProductsGridView 
            products={limitedProducts} 
            initialDisplayCount={limitedProducts.length} 
          />
          
          {/* View more link for mobile - if needed */}
          {products?.length > 4 && (
            <div className="sm:hidden flex justify-center mt-4">
              <a 
                href="/gallery" 
                className="inline-flex items-center text-sm text-indigo-600 font-medium bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-100 transition-colors"
              >
                View More
                <ArrowRightCircle className="ml-1 w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}