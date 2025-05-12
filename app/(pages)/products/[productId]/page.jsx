// // page.js (main page component)
// import { getProduct } from "@/lib/firestore/products/read_server";
// import { AnnouncementBar } from "./components/AnnouncementBar";
// import { Breadcrumb } from "./components/Breadcrumb";
// import { ProductImageGallery } from "./components/ProductImageGallery";
// import { ArtworkDetails } from "./components/ArtworkDetails";
// import { ProductHeader } from "./components/ProductHeader";
// import { ProductPricing } from "./components/ProductPricing";
// import { AddToCartSection } from "./components/AddToCartSection";
// import { ProductDescription } from "./components/ProductDescription";
// import { ProductReviews } from "./components/ProductReviews";
// import { RelatedProducts } from "./components/RelatedProducts";
// import { TrustBadges } from "./components/TrustBadges";


// export default async function ProductPage({ params }) {
//   const resolvedParams = await params;
//   const productId = resolvedParams.productId;
//   const product = await getProduct({ id: productId });

//   const product_serialize = serializeFirestoreData(product);



//   return (
//     <div className="bg-white py-7">

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <Breadcrumb productTitle={product?.title} />

//         <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
//           <div className="mb-10 lg:mb-0">
//             <ProductImageGallery
//               featureImageUrl={product?.featureImageUrl}
//               imageList={product?.imageList}
//               title={product?.title || ''}
//             />
//           </div>

//           <div className="lg:pl-8">
//             <ProductHeader product={product_serialize} />
//             <ProductPricing product={product_serialize} />
//             <AddToCartSection product={product_serialize} />
//           </div>
//         </div>

// <div className="space-y-8 py-2">
//             <ArtworkDetails product={product_serialize} />
//             <TrustBadges />
//           </div>

//         <ProductDescription product={product_serialize} />
//         <ProductReviews product={product_serialize} />
//         <RelatedProducts categoryId={product?.categoryID} />
//       </main>

//     </div>
//   );
// }


// function serializeFirestoreData(data) {
//   if (!data) return null;
  
//   // Handle direct Firestore Timestamp objects
//   if (data && typeof data === 'object' && 'seconds' in data && 'nanoseconds' in data) {
//     return new Date(data.seconds * 1000).toISOString();
//   }
  
//   if (Array.isArray(data)) {
//     return data.map(item => serializeFirestoreData(item));
//   }
  
//   if (typeof data === 'object' && data !== null) {
//     const serialized = {};
//     for (const [key, value] of Object.entries(data)) {
//       serialized[key] = serializeFirestoreData(value);
//     }
//     return serialized;
//   }
  
//   return data;
// }

// page.js (Optimized Product Page Component)
import { Suspense } from 'react';
import { getProduct } from "@/lib/firestore/products/read_server";
import { Breadcrumb } from "./components/Breadcrumb";
import { ProductImageGallery } from "./components/ProductImageGallery";
import { ArtworkDetails } from "./components/ArtworkDetails";
import { ProductHeader } from "./components/ProductHeader";
import { ProductPricing } from "./components/ProductPricing";
import { AddToCartSection } from "./components/AddToCartSection";
import { ProductDescription } from "./components/ProductDescription";
import { ProductReviews } from "./components/ProductReviews";
import { RelatedProducts } from "./components/RelatedProducts";
import { TrustBadges } from "./components/TrustBadges";

// Utility function to serialize Firestore data
function serializeFirestoreData(data) {
  if (!data) return null;
  
  // Handle direct Firestore Timestamp objects
  if (data && typeof data === 'object' && 'seconds' in data && 'nanoseconds' in data) {
    return new Date(data.seconds * 1000).toISOString();
  }
  
  if (Array.isArray(data)) {
    return data.map(item => serializeFirestoreData(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const serialized = {};
    for (const [key, value] of Object.entries(data)) {
      serialized[key] = serializeFirestoreData(value);
    }
    return serialized;
  }
  
  return data;
}

// Loading skeleton for product page
function ProductPageSkeleton() {
  return (
    <div className="bg-white py-7">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            <div className="mb-10 lg:mb-0">
              <div className="bg-gray-300 w-full h-[500px] rounded"></div>
            </div>
            <div className="lg:pl-8">
              <div className="h-12 bg-gray-300 w-3/4 mb-4 rounded"></div>
              <div className="h-8 bg-gray-300 w-1/2 mb-4 rounded"></div>
              <div className="h-16 bg-gray-300 w-full mb-4 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Async component to fetch product data
async function ProductContent({ productId }) {
  try {
    const product = await getProduct({ id: productId });
    const product_serialize = serializeFirestoreData(product);

    return (
      <>
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div className="mb-10 lg:mb-0">
            <ProductImageGallery
              featureImageUrl={product?.featureImageUrl}
              imageList={product?.imageList}
              title={product?.title || ''}
            />
          </div>
          <div className="lg:pl-8">
            <ProductHeader product={product_serialize} />
            <ProductPricing product={product_serialize} />
            <AddToCartSection product={product_serialize} />
          </div>
        </div>
        <div className="space-y-8 py-2">
          <ArtworkDetails product={product_serialize} />
          <TrustBadges />
        </div>
        <ProductDescription product={product_serialize} />
        <ProductReviews product={product_serialize} />
        <RelatedProducts categoryId={product?.categoryID} />
      </>
    );
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return (
      <div className="text-red-500 text-center py-12">
        Failed to load product. Please try again later.
      </div>
    );
  }
}

// Main page component
export default async function ProductPage({ params }) {
  // Properly await and extract productId
  const { productId } = await params;

  return (
    <div className="bg-white py-7">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<ProductPageSkeleton />}>
          <Breadcrumb productTitle={productId} />
          <ProductContent productId={productId} />
        </Suspense>
      </main>
    </div>
  );
}
