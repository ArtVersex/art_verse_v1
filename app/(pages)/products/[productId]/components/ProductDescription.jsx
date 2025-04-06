"use client"
import React, { useEffect, useState } from 'react';
import { getBrands } from '@/lib/firestore/brands/read_server';
import Link from 'next/link';

export const ProductDescription = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [brand, setBrand] = useState(null);
  const [expanded, setExpanded] = useState(false);
  
  // Use useEffect to fetch the brand data
  useEffect(() => {
    const fetchBrand = async () => {
      if (product?.brandID) {
        const brandData = await getBrands({ id: product.brandID });
        setBrand(brandData);
      }
    };
    
    fetchBrand();
  }, [product?.brandID]);

  // Function to truncate text and add "Read more" if too long
  const TruncatableText = ({ text, maxLength = 150 }) => {
    if (!text || text.length <= maxLength || expanded) {
      return <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: text }} />;
    }
    
    const truncated = text.substring(0, maxLength) + '...';
    
    return (
      <div>
        <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: truncated }} />
        <button 
          onClick={() => setExpanded(true)}
          className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium transition duration-150 ease-in-out focus:outline-none focus:underline"
        >
          Read more
        </button>
      </div>
    );
  };

  return (
    <div className="mt-8 sm:mt-12 md:mt-16 border-t border-gray-200 pt-6 sm:pt-8 md:pt-10">
      {/* Premium Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex flex-wrap sm:flex-nowrap space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide" aria-label="Tabs">
          <a 
            href="#description" 
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('description');
            }}
            className={`whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-200 ${
              activeTab === 'description' 
                ? 'border-red-500 text-red-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Description
            </span>
          </a>

          <a 
            href="#shipping" 
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('shipping');
            }}
            className={`whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-200 ${
              activeTab === 'shipping' 
                ? 'border-red-500 text-red-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Shipping
            </span>
          </a>
          
          <a 
            href="#reviews" 
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('reviews');
            }}
            className={`whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-200 ${
              activeTab === 'reviews' 
                ? 'border-red-500 text-red-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Reviews
            </span>
          </a>
        </nav>
      </div>

      {/* Description Tab Content */}
      <div id="description" className={activeTab === 'description' ? 'py-6 sm:py-8 md:py-10' : 'hidden'}>
        <div className="prose prose-sm sm:prose max-w-3xl mx-auto">
          {/* About the Artist - with premium design */}
          <div className="mb-8 md:mb-12">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3 flex items-center">
              <span className="inline-block w-8 h-1 bg-red-500 mr-3"></span>
              About the Artist
            </h3>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border-l-4 border-red-500">
              <TruncatableText 
                text={product?.artistDescription || "Known for their distinctive style that blends traditional techniques with contemporary themes, our featured artist has established themselves as a noteworthy voice in the modern art scene. Each piece represents hours of meticulous craftsmanship and creative vision."} 
                maxLength={200}
              />
            </div>
          </div>

          {/* The Inspiration - with premium design */}
          <div className="mb-8 md:mb-12">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3 flex items-center">
              <span className="inline-block w-8 h-1 bg-red-500 mr-3"></span>
              Artwork Description
            </h3>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border-l-4 border-red-500">
              <TruncatableText 
                text={product?.description || "This particular piece draws inspiration from natural landscapes and urban environments, creating a harmonious dialogue between opposing worlds. The artist employs a unique color palette that evokes both tranquility and dynamism."} 
                maxLength={200}
              />
            </div>
          </div>

          {/* Display Recommendations - with premium design */}
          <div className="mb-8 md:mb-12">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3 flex items-center">
              <span className="inline-block w-8 h-1 bg-red-500 mr-3"></span>
              Display Recommendations
            </h3>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border-l-4 border-red-500">
              <TruncatableText 
                text={product?.displayRecommendations || "This artwork makes a striking impression in spaces with abundant natural light, where its rich colors and textures can be fully appreciated. Consider placing it in a living room, study, or entryway where it can serve as a conversation starter."} 
                maxLength={200}
              />
            </div>
          </div>

          {/* Authentication Section - Premium design */}
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3 flex items-center">
              <span className="inline-block w-8 h-1 bg-red-500 mr-3"></span>
              Certificate of Authenticity
            </h3>
            <div className="mt-4 bg-gray-50 p-4 sm:p-6 md:p-8 rounded-lg border border-gray-200 shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-baseline">
                    <span className="text-gray-500 w-32 text-sm mb-1 sm:mb-0 font-medium">Artist Name:</span>
                    <span className="font-semibold text-gray-800">{brand?.name || "Madhusudhan Sharma"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline">
                    <span className="text-gray-500 w-32 text-sm mb-1 sm:mb-0 font-medium">Title:</span>
                    <span className="font-semibold text-gray-800">{product?.title || "Untitled Artwork"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline">
                    <span className="text-gray-500 w-32 text-sm mb-1 sm:mb-0 font-medium">Date of Creation:</span>
                    <span className="font-semibold text-gray-800">{product?.year || "2025"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline">
                    <span className="text-gray-500 w-32 text-sm mb-1 sm:mb-0 font-medium">Medium:</span>
                    <span className="font-semibold text-gray-800">{product?.subcategory || "Oil on Canvas"}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-baseline">
                    <span className="text-gray-500 w-32 text-sm mb-1 sm:mb-0 font-medium">Dimensions:</span>
                    <span className="font-semibold text-gray-800">{product?.dimensions || "24 x 36 inches"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline">
                    <span className="text-gray-500 w-32 text-sm mb-1 sm:mb-0 font-medium">Edition Number:</span>
                    <span className="font-semibold text-gray-800">{product?.editionNumber || "1 of 1 (Original)"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline">
                    <span className="text-gray-500 w-32 text-sm mb-1 sm:mb-0 font-medium">Certificate No:</span>
                    <span className="font-semibold text-gray-800">{product?.certificateNumber || "COA-2025-0001"}</span>
                  </div>
                </div>
              </div>
              
              {/* Signature - Premium design */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <p className="text-gray-500 mb-3 text-sm font-medium">Signature:</p>
                <div className="border border-gray-300 p-4 sm:p-6 bg-white rounded-lg shadow-sm">
                  <div className="font-signature text-xl sm:text-2xl flex justify-center">
                    {product?.artistSignature || "______________________"}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center">Artist's Signature</p>
                </div>
                <div className="mt-6 flex justify-center">
                  <div className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 rounded-full text-xs sm:text-sm text-gray-600 shadow-sm">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Verified Authentic
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> 
      </div>

      {/* Shipping Tab Content - Premium design */}
      <div id="shipping" className={activeTab === 'shipping' ? 'py-6 sm:py-8 md:py-10' : 'hidden'}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white">
            <div className="mb-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="inline-block w-8 h-1 bg-red-500 mr-3"></span>
                Shipping Information
              </h3>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border-l-4 border-red-500">
                <p className="text-gray-600">
                  We take great care in packaging and shipping our artworks to ensure they arrive in pristine condition. 
                  Each piece is carefully wrapped and insured for its full value.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {/* Shipping Options */}
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800">Shipping Options</h4>
                </div>
                <ul className="space-y-3 text-sm sm:text-base text-gray-600">
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    <span>Standard: 5-7 business days</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    <span>Express: 2-3 business days</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                    <span>International: 7-14 business days</span>
                  </li>
                </ul>
              </div>
              
              {/* Packaging */}
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 p-2 rounded-full mr-3">  
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800">Packaging</h4>
                </div>
                <ul className="space-y-3 text-sm sm:text-base text-gray-600">
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    <span>Acid-free tissue paper</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    <span>Bubble wrap</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    <span>Rigid cardboard backing</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    <span>Sealed wooden crate for larger pieces</span>
                  </li>
                </ul>
              </div>
              
              {/* Tracking & Insurance */}
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800">Tracking & Insurance</h4>
                </div>
                <ul className="space-y-3 text-sm sm:text-base text-gray-600">
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                    <span>Full insurance coverage</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                    <span>Tracking number</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                    <span>Signature confirmation</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Shipping Policy Note - Premium design */}
            <div className="mt-8 sm:mt-10 p-4 sm:p-6 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 mt-0.5 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm sm:text-base text-gray-600">
                    <span className="font-medium">Note:</span> Shipping times may vary during holiday seasons and for custom orders. 
                    For specific shipping inquiries or special handling requests, please contact our customer service team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Tab Content - Premium design */}
      <div id="reviews" className={activeTab === 'reviews' ? 'py-6 sm:py-8 md:py-10' : 'hidden'}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="inline-block w-8 h-1 bg-red-500 mr-3"></span>
              Customer Reviews
            </h3>
            <div className="flex flex-col items-center justify-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600 mb-4">No reviews yet. Be the first to review this product!</p>
              <button className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 shadow-sm">
                Write a Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};