import { getCollection } from "@/lib/firestore/collections/read_server";
import { getProduct } from "@/lib/firestore/products/read_server";
import ProductsGridView from "@/app/components/Products";

// Helper function to convert Firestore documents to plain objects
function convertToPlainObject(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => convertToPlainObject(item));
  }
  
  // Handle timestamp objects
  if (obj.seconds !== undefined && obj.nanoseconds !== undefined) {
    // Convert to JavaScript Date or just timestamp value
    return new Date(obj.seconds * 1000);
    // Alternatively: return obj.seconds;
  }
  
  // Handle regular objects
  const plainObject = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      plainObject[key] = convertToPlainObject(obj[key]);
    }
  }
  
  return plainObject;
}

export default async function CollectionPage({ params }) {
  const resolvedParams = await params;
  const collectionId = resolvedParams.collectionId;
  
  // Fetch collection details
  const collectionData = await getCollection({ id: collectionId });
  // Convert to plain object
  const collection = convertToPlainObject(collectionData);
  
  // Fetch all products in this collection by their IDs
  let collectionProducts = [];
  
  if (collection && collection.products && collection.products.length > 0) {
    // Create an array of promises to fetch each product
    const productPromises = collection.products.map(productId =>
      getProduct({ id: productId })
    );
    
    // Wait for all product fetch operations to complete
    const fetchedProducts = await Promise.all(productPromises);
    
    // Filter out any null/undefined products and convert to plain objects
    collectionProducts = fetchedProducts
      .filter(product => product)
      .map(product => convertToPlainObject(product));
  }
  
  return (
    // <main className="max-w-5xl mx-auto p-10 md:p-10 relative">
    <main className="mx-auto p-10 md:p-10 relative">
    {/* Artistic Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute -bottom-32 right-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 -left-4 w-72 h-72 bg-rose-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      
      {/* Collection Image with Artistic Frame */}
      {collection?.imageUrl && (
        <div className="w-full flex justify-center mb-12 relative">
          <div className="relative inline-block">
            {/* Decorative corners for the frame */}
            <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-indigo-400"></div>
            <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-indigo-400"></div>
            <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-indigo-400"></div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-indigo-400"></div>
            
            {/* The image with shadow and slight rotation for artistic effect */}
            <div className="p-2 bg-white shadow-lg transform rotate-1 transition-transform hover:rotate-0 duration-300">
              <img 
                src={collection.imageUrl}
                alt={collection?.title || "Collection"}
                className="h-[240px] object-cover rounded-sm"
              />
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-6 right-4 h-10 w-10">
              <svg viewBox="0 0 24 24" className="w-full h-full text-indigo-200 opacity-60" fill="currentColor">
                <circle cx="12" cy="12" r="8" />
              </svg>
            </div>
          </div>
        </div>
      )}
      
      {/* Collection Header - Artistic Version */}
      <div className="mb-12 relative z-10">
        <div className="relative inline-block">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 relative z-10">
            {collection?.title || "Collection"}
          </h1>
          <div className="h-3 w-full bg-indigo-100 absolute bottom-1 left-0 -z-10 transform -rotate-1"></div>
        </div>
        
        {collection?.subTitle && (
          <p className="text-gray-600 max-w-3xl mt-4 text-lg leading-relaxed font-light italic">
            {collection.subTitle}
          </p>
        )}
        
        <div className="mt-6 flex items-center">
          <div className="h-px w-16 bg-gray-300"></div>
          <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mx-3 rounded-full"></div>
          <div className="h-px w-16 bg-gray-300"></div>
        </div>
      </div>
      
      {/* Products in Collection - Artistic Version */}
      <div className="mb-16 relative z-1">
        {/* <div className="flex items-center mb-10">
          <svg className="w-6 h-6 text-indigo-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <h2 className="text-2xl font-medium text-gray-800">
            Artworks in this Collection
          </h2>
        </div> */}
        
        {collectionProducts && collectionProducts.length > 0 ? (
          <div className="relative">
            {/* Decorative corner patterns */}
            <div className="absolute -top-6 -right-6 w-12 h-12 border-t-2 border-r-2 border-gray-200 opacity-70"></div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 border-b-2 border-l-2 border-gray-200 opacity-70"></div>
            
            {/* Masonry-style grid view with hover effects */}
            <div className="relative group">
              <ProductsGridView products={collectionProducts} />
              
              {/* Optional overlay animation on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <p className="mt-4 text-gray-500 font-light text-lg italic">This collection is currently empty.</p>
          </div>
        )}
      </div>
      
      {/* Collection Information Section */}
      {collection?.description && (
        <div className="mb-12 relative z-10">
          <div className="bg-white border border-gray-100 rounded-lg p-8 shadow-sm relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-indigo-50 rounded-full opacity-70"></div>
            <div className="absolute bottom-0 right-12 w-24 h-24 bg-rose-50 rounded-full opacity-50"></div>
            
            <h3 className="text-xl font-medium text-gray-800 mb-4 relative z-10">About this Collection</h3>
            <p className="text-gray-600 leading-relaxed relative z-10">{collection.description}</p>
            
            {/* Creation date if available */}
            {collection.createdAt && (
              <div className="mt-6 text-sm text-gray-500 italic relative z-10">
                Curated on {collection.createdAt.toDateString()}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Artistic Footer Element */}
      <div className="w-full flex justify-center mb-12 relative z-10">
        <div className="flex items-center">
          <div className="w-1 h-1 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400 mx-2"></div>
          <div className="w-1 h-1 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </main>
  );
}

// The product function has been fixed as well
async function product({productId}) {
  const productData = await getProduct({id: productId});
  const plainProduct = convertToPlainObject(productData);
  return <ProductsGridView products={plainProduct} />;
}