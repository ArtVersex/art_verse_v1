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
    <main className="max-w-7xl mx-auto p-5 md:p-10">
        {/* Collection Image (if available) */}
        {collection?.imageUrl && (
          <div className="w-full flex justify-center">
            <img 
              src={collection.imageUrl}
              alt={collection?.title || "Collection"}
              className="h-[200px] rounded-lg shadow-md"
            />
          </div>
        )}
      {/* Collection Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {collection?.title || "Collection"}
        </h1>
        {collection?.subTitle && (
          <p className="text-gray-600 max-w-3xl mb-4">
            {collection.subTitle}
          </p>
        )}
        <div className="h-1 w-20 bg-indigo-600 mt-2"></div>
      </div>
      
      
      {/* Products in Collection */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Products in this Collection
        </h2>
        
        {collectionProducts && collectionProducts.length > 0 ? (
          <ProductsGridView products={collectionProducts} />
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No products found in this collection.</p>
          </div>
        )}
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