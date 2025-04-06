// page.js (main page component)
import { getProduct } from "@/lib/firestore/products/read_server";
import { AnnouncementBar } from "./components/AnnouncementBar";
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
// import { RecentlyViewed } from "./components/RecentlyViewed";



export default async function ProductPage({ params }) {
  // Wait for params to be available
  const resolvedParams = await params;
  const productId = resolvedParams.productId;
  const product = await getProduct({ id: productId });

  const product_serialize = serializeFirestoreData(product);



  return (
    <div className="bg-white py-7">
      <AnnouncementBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb productTitle={product?.title} />

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div className="mb-10 lg:mb-0">
            <ProductImageGallery
              featureImageUrl={product?.featureImageUrl}
              imageList={product?.imageList}
              title={product?.title || ''}
            />
          </div>

          <div className="lg:pl-8">
            <ProductHeader product={product} />
            <ProductPricing product={product} />
            <AddToCartSection product={product_serialize} />
            {/* <AddToCartSection product={product} /> */}
          </div>
        </div>

        {/* <div className="grid gap-6 w-full md:grid-cols-2 md:gap-8">
  <div className="bg-gray-50 rounded-lg p-6 shadow-md">
    <ArtworkDetails />
  </div>
  <div className="bg-gray-50 rounded-lg p-6 shadow-md">
    <TrustBadges />
  </div>
</div>    */}

<div className="space-y-8 py-2">
            <ArtworkDetails product={product_serialize} />
            {/* <ArtworkDetails  /> */}
            <TrustBadges />
          </div>

     {/* Description, Reviews, and Related Sections */}
        <ProductDescription product={product_serialize} />
        <ProductReviews product={product} />
        <RelatedProducts categoryId={product?.categoryID} />
      </main>

      {/* <RecentlyViewed currentProductId={productId} /> */}
    </div>
  );
}



function serializeFirestoreData(data) {
  if (!data) return null;
  
  if (data instanceof Date) {
    return data.toISOString();
  }
  
  // Handle Firestore Timestamp objects
  if (data.seconds !== undefined && data.nanoseconds !== undefined) {
    // Convert to ISO string date
    return new Date(data.seconds * 1000).toISOString();
  }
  
  if (Array.isArray(data)) {
    return data.map(item => serializeFirestoreData(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    return Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] = serializeFirestoreData(value);
      return acc;
    }, {});
  }
  
  return data;
}
