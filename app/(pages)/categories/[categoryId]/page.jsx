import ProductsGridView from "@/app/components/Products";
import { getProductByCategory } from "@/lib/firestore/products/read_server";
import { getcategory } from "@/lib/firestore/categories/read_server";
import RelatedProducts from "../../products1/[productId]/components/RelatedProduct";
import { motion } from "framer-motion";

export default async function CategoryPage({ params }) {
  const resolvedParams = await params;
  const categoryId = resolvedParams.categoryId;
  
  // Fetch products by category
  const products = await getProductByCategory({ categoryId: categoryId });
  
  // Fetch category details to display name
  const category = await getcategory({ id: categoryId });
  
  return (
    <main className="max-w-7xl mx-auto p-5 md:p-10 relative">
      {/* Artistic Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -left-4 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      
      {/* Category Header Section - Artistic Version */}
      <div className="mb-16 relative z-10">
        <div className="relative">
          <svg className="absolute -top-12 -left-12 text-gray-100 w-24 h-24 opacity-60" viewBox="0 0 100 100" fill="currentColor">
            <path d="M95.5,15.5 C95.5,7.2 88.8,0.5 80.5,0.5 C72.2,0.5 65.5,7.2 65.5,15.5 C65.5,23.8 72.2,30.5 80.5,30.5 C88.8,30.5 95.5,23.8 95.5,15.5 Z M65.5,84.5 C65.5,76.2 58.8,69.5 50.5,69.5 C42.2,69.5 35.5,76.2 35.5,84.5 C35.5,92.8 42.2,99.5 50.5,99.5 C58.8,99.5 65.5,92.8 65.5,84.5 Z M35.5,15.5 C35.5,7.2 28.8,0.5 20.5,0.5 C12.2,0.5 5.5,7.2 5.5,15.5 C5.5,23.8 12.2,30.5 20.5,30.5 C28.8,30.5 35.5,23.8 35.5,15.5 Z" />
          </svg>
          <div className="inline-block relative">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 relative z-10">
              {category?.name || "Category"}
            </h1>
            <div className="h-3 w-full bg-yellow-200 absolute bottom-1 left-0 -z-10 transform -rotate-1"></div>
          </div>
        </div>
        
        {category?.description && (
          <p className="text-gray-600 max-w-3xl mt-6 text-lg leading-relaxed font-light italic">
            {category.description}
          </p>
        )}
        
        <div className="mt-8 flex items-center">
          <div className="h-px w-16 bg-gray-300"></div>
          <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mx-3 rounded-full"></div>
          <div className="h-px w-16 bg-gray-300"></div>
        </div>
      </div>
      
      {/* Products Grid - Artistic Version */}
      <div className="mb-20 relative z-10">
        {/* <div className="flex items-center mb-10">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
          </div>
          <h2 className="text-2xl font-serif font-medium text-gray-800">
            Artistic Collection
          </h2>
        </div> */}
        
        {products && products.length > 0 ? (
          <div className="relative">
            {/* Decorative element */}
            <div className="absolute -top-6 -right-6 w-12 h-12 border-t-2 border-r-2 border-gray-200"></div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 border-b-2 border-l-2 border-gray-200"></div>
            
            <ProductsGridView products={products} />
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <p className="mt-4 text-gray-500 font-light text-lg italic">No artworks found in this collection.</p>
          </div>
        )}
      </div>
      
      {/* Artistic Footer Element */}
      <div className="w-full flex justify-center mb-12">
        <div className="flex space-x-3">
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </main>
  );
}