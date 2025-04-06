// components/RelatedProducts.js

import React from 'react';
import ProductsGridView from "@/app/components/Products"
import { getProductByCategory } from "@/lib/firestore/products/read_server"

export async function RelatedProducts({categoryId}) { 
  // Mock related products - in a real app, this would come from your backend

  const products = await getProductByCategory({categoryId: categoryId})


  return (
    <main className="mt-16 border-t border-gray-200 pt-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">You May Also Like</h2>
        <a 
          href="/gallery" 
          className="text-red-600 hover:text-red-800 font-medium flex items-center"
        >
          View All Collection
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 ml-1" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
        </a>
      </div>

<div>

      <ProductsGridView products = {products}/>
</div>


    </main>
  );
};