import { getProduct } from "@/lib/firestore/products/read_server";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
// import { useState } from "react";

export default async function Page({ params }) {
  // Wait for params to be available
  const resolvedParams = await params;
  const productId = resolvedParams.productId;
  const product = await getProduct({ id: productId });

  // Calculate discount percentage if there's a sale
  const discountPercentage = product?.salePrice && product?.price
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  // Format the timestamp to relative time (e.g., "3 days ago")
  const listedTime = product?.timestampcreate
    ? formatDistanceToNow(new Date(product.timestampcreate.toDate()), { addSuffix: true })
    : "";

  return (
    <div className="bg-white">
      {/* Announcement Bar */}
      <div className="bg-gray-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm font-medium">
          Free worldwide shipping on all original artwork • Secure payment • 30-day returns
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8 text-sm text-gray-500">
          <ol className="flex items-center space-x-2">
            <li><a href="/" className="hover:text-gray-900 transition-colors">Home</a></li>
            <li><span>/</span></li>
            <li><a href="/gallery" className="hover:text-gray-900 transition-colors">Gallery</a></li>
            <li><span>/</span></li>
            <li className="text-gray-900 font-medium">{product?.title}</li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* Gallery Section */}
          <div className="mb-10 lg:mb-0">
            {/* Featured Image Section */}
            <div className="aspect-w-1 aspect-h-1 bg-gray-50 rounded-lg overflow-hidden mb-6">
              {product?.featureImageUrl && (
                <div className="relative w-full h-full" style={{ height: '600px' }}>
                  <Image
                    src={product.featureImageUrl}
                    alt={product.title}
                    fill
                    priority
                    className="object-contain transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-5 gap-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden ring-2 ring-red-500 relative">
                {product?.featureImageUrl && (
                  <Image
                    src={product.featureImageUrl}
                    alt={`${product.title} - Main View`}
                    fill
                    className="object-cover hover:opacity-90 transition-opacity"
                  />
                )}
              </div>

              {product?.imageList && product.imageList.map((image, index) => (
                <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-gray-300 transition-all relative">
                  <Image
                    src={image}
                    alt={`${product.title} - View ${index + 1}`}
                    fill
                    className="object-cover hover:opacity-90 transition-opacity"
                  />
                </div>
              ))}
            </div>

            {/* Art Details Panel */}
            <div className="mt-10 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Artwork Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Artist</p>
                  <p className="font-medium">Alexander Visionary</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Medium</p>
                  <p className="font-medium">Acrylic on Canvas</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Dimensions</p>
                  <p className="font-medium">24" × 36" (61cm × 91cm)</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="font-medium">2025</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Framing</p>
                  <p className="font-medium">Unframed</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Certificate</p>
                  <p className="font-medium">Includes Authentication</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information Section */}
          <div className="lg:pl-8">
            {/* Title section with badges */}
            <div className="space-y-2 border-b border-gray-200 pb-6">
              <div className="flex flex-wrap items-center gap-2">
                {product?.isFeatured && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Featured
                  </span>
                )}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Original Artwork
                </span>
                {product?.stock <= 1 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    One of a Kind
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{product?.title}</h1>
              <p className="text-sm text-gray-500">Listed {listedTime} • Product ID: {product?.id}</p>
            </div>

            {/* Price Section */}
            <div className="mt-6 space-y-4">
              <div className="flex items-baseline">
                {product?.salePrice ? (
                  <>
                    <span className="text-4xl font-bold text-gray-900">${product.salePrice}</span>
                    <span className="text-xl text-gray-500 line-through ml-3">${product.price}</span>
                    <span className="ml-3 px-2 py-1 text-sm font-semibold text-red-600 bg-red-50 rounded">
                      Save {discountPercentage}%
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-bold text-gray-900">${product?.price}</span>
                )}
              </div>

              {/* Payment options */}
              <p className="text-gray-600 text-sm">
                Pay in 4 interest-free installments of ${Math.round((product?.salePrice || product?.price) / 4)} with Afterpay
              </p>

              {/* Stock indicator */}
              <div className="flex items-center mt-4">
                <div className={`w-3 h-3 rounded-full ${product?.stock > 0 ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                <span className={`text-sm font-medium ${product?.stock <= 3 && product?.stock > 0 ? 'text-orange-600' : ''}`}>
                  {product?.stock > 0
                    ? product?.stock <= 3
                      ? `Only ${product?.stock} left in stock - order soon`
                      : `In Stock (${product?.stock} available)`
                    : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8 border-t border-b border-gray-200 py-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">About This Artwork</h3>
              <div className="prose prose-sm text-gray-700">
                <p>{product?.shortDescription || "This unique piece captures the essence of contemporary expression through vibrant colors and thoughtful composition. The artist's distinctive style invites viewers to discover new details with each viewing."}</p>
                <p className="mt-4">Each artwork is carefully packaged to ensure safe delivery to your doorstep. Our pieces arrive ready to display in your space.</p>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="mt-8 space-y-4">
              {/* Quantity Selector */}
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <select
                  id="quantity"
                  name="quantity"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                  defaultValue="1"
                  disabled={product?.stock <= 0}
                >
                  {[...Array(Math.min(product?.stock || 0, 5)).keys()].map((i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add to Cart Button */}
              <button
                className={`w-full flex items-center justify-center px-8 py-4 rounded-md font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors
                  ${product?.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={product?.stock <= 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                </svg>
                Add to Cart
              </button>

              {/* Wishlist and Share Buttons */}
              <div className="flex space-x-4">
                <button className="flex-1 py-3 px-4 flex items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  Wishlist
                </button>
                <button className="flex-1 py-3 px-4 flex items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  Share
                </button>
              </div>
            </div>

            {/* Trust Badges and Benefits */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">Fast Delivery</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm">Secure Payment</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                  </svg>
                  <span className="text-sm">Certificate of Authenticity</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-sm">30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Section for Additional Information */}
        <div className="mt-16 border-t border-gray-200 pt-10">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <a href="#description" className="border-red-500 text-red-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Description
              </a>
              <a href="#shipping" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Shipping
              </a>
              <a href="#reviews" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Reviews
              </a>
            </nav>
          </div>

          {/* Tab Content */}
          <div id="description" className="py-10">
            <div className="prose prose-sm max-w-3xl mx-auto">
              <h3>About the Artist</h3>
              <p>
                Known for their distinctive style that blends traditional techniques with contemporary themes, our featured artist has established themselves as a noteworthy voice in the modern art scene. Each piece represents hours of meticulous craftsmanship and creative vision.
              </p>
              <h3 className="mt-8">The Inspiration</h3>
              <p>
                This particular piece draws inspiration from natural landscapes and urban environments, creating a harmonious dialogue between opposing worlds. The artist employs a unique color palette that evokes both tranquility and dynamism.
              </p>
              <h3 className="mt-8">Display Recommendations</h3>
              <p>
                This artwork makes a striking impression in spaces with abundant natural light, where its rich colors and textures can be fully appreciated. Consider placing it in a living room, study, or entryway where it can serve as a conversation starter.
              </p>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section id="reviews" className="mt-16 border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

          {/* Overall Rating Summary */}
          <div className="flex items-center mb-8">
            <div className="flex items-center mr-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${star <= 4 ? 'text-red-500' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-lg font-medium text-gray-900">4.0 out of 5 stars</p>
            <span className="ml-3 text-sm text-gray-500">(12 reviews)</span>
          </div>

          {/* Review Form Placeholder */}
          <div className="mb-10 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Share Your Experience</h3>
            <p className="text-gray-600 mb-4">If you've purchased this artwork, please take a moment to share your thoughts.</p>
            <button className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
              Write a Review
            </button>
          </div>

          {/* Insert your CustomerReview component here */}
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews yet for this specific artwork. Be the first to share your experience!</p>
          </div>
        </section>

        {/* You May Also Like Section */}
        <section className="mt-16 border-t border-gray-200 pt-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">You May Also Like</h2>
            <a href="/" className="text-[#000080] hover:text-[#000080] font-medium flex items-center">
              View All Collection
              {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg> */}
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder items for similar products */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="group relative">
                <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
                  <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">Similar Artwork {item}</h3>
                    <p className="mt-1 text-sm text-gray-500">Abstract Collection</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">$45</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Recently Viewed */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Recently Viewed</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="group relative">
                <div className="aspect-w-1 aspect-h-1 bg-white rounded-lg overflow-hidden shadow-sm">
                  <div className="w-full h-32 bg-gray-200 animate-pulse"></div>
                </div>
                <div className="mt-2">
                  <h3 className="text-xs text-gray-700 truncate">Artwork Example {item}</h3>
                  <p className="text-xs font-medium text-gray-900">$38</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}