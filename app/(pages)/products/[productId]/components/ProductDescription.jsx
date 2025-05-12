"use client"
import React, { useEffect, useState } from 'react';
import { getBrands } from '@/lib/firestore/brands/read_server';
import Link from 'next/link';

export const ProductDescription = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [brand, setBrand] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    artist: false,
    artwork: false,
    display: false
  });
  
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

  // Function to toggle expansion state for a specific section
  const toggleExpanded = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Function to render text with optional "Read more" button
  const TruncatableText = ({ text, maxLength = 150, section }) => {
    // If no text or expanded or text is short enough, just render it
    if (!text || text.length <= maxLength || expandedSections[section]) {
      return <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: text || '' }} />;
    }
    
    // Otherwise, truncate and add "Read more" button
    const truncated = text.substring(0, maxLength) + '...';
    
    return (
      <div>
        <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: truncated }} />
        <button 
          onClick={() => toggleExpanded(section)}
          className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium transition duration-150 ease-in-out focus:outline-none focus:underline"
        >
          Read more
        </button>
      </div>
    );
  };

  // Artistic design elements
  const ArtisticDivider = () => (
    <div className="flex items-center justify-center my-4 md:my-8">
      <div className="w-12 md:w-16 h-px bg-gray-300"></div>
      <div className="mx-2 md:mx-3">
        <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
        </svg>
      </div>
      <div className="w-12 md:w-16 h-px bg-gray-300"></div>
    </div>
  );

  return (
    <div className="mt-6 md:mt-8 lg:mt-16 border-t border-gray-200 pt-4 md:pt-6 lg:pt-10">
      {/* Artistic Header */}
      <div className="mb-6 md:mb-8 text-center">
        <h2 className="font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-800 mb-2 md:mb-3">{product?.title || "Untitled Artwork"}</h2>
        <p className="text-xs md:text-sm text-gray-500 font-light tracking-wider uppercase">{brand?.name || "Artist Name"} • {product?.year || "2025"}</p>
      </div>
      
      {/* Premium Tab Navigation with Artistic Styling - Mobile Optimized */}
      <div className="border-b border-gray-200 relative">
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-70"></div>
        <nav className="-mb-px flex overflow-x-auto scrollbar-hide py-1" aria-label="Tabs">
          <a 
            href="#description" 
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('description');
            }}
            className={`whitespace-nowrap py-2 md:py-3 lg:py-4 px-3 border-b-2 font-serif text-xs md:text-sm tracking-wide transition-colors duration-300 mr-4 md:mr-8 flex-shrink-0 ${
              activeTab === 'description' 
                ? 'border-red-500 text-red-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              The Artwork
            </span>
          </a>

          <a 
            href="#shipping" 
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('shipping');
            }}
            className={`whitespace-nowrap py-2 md:py-3 lg:py-4 px-3 border-b-2 font-serif text-xs md:text-sm tracking-wide transition-colors duration-300 mr-4 md:mr-8 flex-shrink-0 ${
              activeTab === 'shipping' 
                ? 'border-red-500 text-red-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
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
            className={`whitespace-nowrap py-2 md:py-3 lg:py-4 px-3 border-b-2 font-serif text-xs md:text-sm tracking-wide transition-colors duration-300 flex-shrink-0 ${
              activeTab === 'reviews' 
                ? 'border-red-500 text-red-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Collector Reviews
            </span>
          </a>
        </nav>
      </div>

      {/* Description Tab Content - Artistic Design - Mobile Optimized */}
      <div id="description" className={activeTab === 'description' ? 'py-6 md:py-8 lg:py-12' : 'hidden'}>
        <div className="prose prose-sm sm:prose max-w-3xl mx-auto">
          {/* About the Artist - with artistic design */}
          <div className="mb-8 md:mb-12">
            <h3 className="font-serif text-lg md:text-xl lg:text-2xl text-gray-800 mb-3 md:mb-4 flex items-center italic">
              <span className="inline-block w-6 md:w-10 h-0.5 bg-gradient-to-r from-red-400 to-red-600 mr-2 md:mr-3"></span>
              About the Artist
            </h3>
            <div className="bg-gray-50 p-4 md:p-6 lg:p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="relative pl-3 md:pl-4 border-l-2 border-red-200 text-justify">
                <TruncatableText 
                  text={brand?.artistStatement || "Known for their distinctive style that blends traditional techniques with contemporary themes, our featured artist has established themselves as a noteworthy voice in the modern art scene. Each piece represents hours of meticulous craftsmanship and creative vision."} 
                  maxLength={220}
                  section="artist"
                />
              </div>
            </div>
          </div>

          <ArtisticDivider />

          {/* Artwork Description - with artistic design */}
          <div id="section1" className="mb-8 md:mb-12">
            <h3 className="font-serif text-lg md:text-xl lg:text-2xl text-gray-800 mb-3 md:mb-4 flex items-center italic">
              <span className="inline-block w-6 md:w-10 h-0.5 bg-gradient-to-r from-red-400 to-red-600 mr-2 md:mr-3"></span>
              The Creative Vision
            </h3>
            <div className="bg-gray-50 p-4 md:p-6 lg:p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="relative pl-3 md:pl-4 border-l-2 border-red-200 text-justify">
                <TruncatableText 
                  text={product?.description || "This particular piece draws inspiration from natural landscapes and urban environments, creating a harmonious dialogue between opposing worlds. The artist employs a unique color palette that evokes both tranquility and dynamism."} 
                  maxLength={220}
                  section="artwork"
                />
              </div>
            </div>
          </div>

          <ArtisticDivider />

          {/* Display Recommendations - with artistic design */}
          <div className="mb-8 md:mb-12">
            <h3 className="font-serif text-lg md:text-xl lg:text-2xl text-gray-800 mb-3 md:mb-4 flex items-center italic">
              <span className="inline-block w-6 md:w-10 h-0.5 bg-gradient-to-r from-red-400 to-red-600 mr-2 md:mr-3"></span>
              Presentation &amp; Display
            </h3>
            <div className="bg-gray-50 p-4 md:p-6 lg:p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="relative pl-3 md:pl-4 border-l-2 border-red-200 text-justify">
                <TruncatableText 
                  text={product?.displayRecommendations || "This artwork makes a striking impression in spaces with abundant natural light, where its rich colors and textures can be fully appreciated. Consider placing it in a living room, study, or entryway where it can serve as a conversation starter."} 
                  maxLength={220}
                  section="display"
                />
              </div>
            </div>
          </div>

          <ArtisticDivider />

          {/* Authentication Section - Artistic design - Mobile Optimized */}
          <div>
            <h3 className="font-serif text-lg md:text-xl lg:text-2xl text-gray-800 mb-3 md:mb-4 flex items-center italic">
              <span className="inline-block w-6 md:w-10 h-0.5 bg-gradient-to-r from-red-400 to-red-600 mr-2 md:mr-3"></span>
              Certificate of Authenticity
            </h3>
            <div className="mt-4 bg-gray-50 p-4 md:p-6 lg:p-8 rounded-lg border border-gray-100 shadow-sm overflow-hidden relative">
              {/* Decorative artistic elements */}
              <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 -mt-8 -mr-8 md:-mt-10 md:-mr-10 bg-red-50 rounded-full opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-16 md:w-24 h-16 md:h-24 -mb-6 -ml-6 md:-mb-8 md:-ml-8 bg-red-50 rounded-full opacity-20"></div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 relative z-10">
                <div className="space-y-3 md:space-y-5">
                  <div className="flex flex-row items-baseline">
                    <span className="text-gray-500 w-24 md:w-32 text-xs md:text-sm font-medium italic">Artist:</span>
                    <span className="font-serif font-semibold text-gray-800 text-sm md:text-base">{brand?.name || "Madhusudhan Sharma"}</span>
                  </div>
                  <div className="flex flex-row items-baseline">
                    <span className="text-gray-500 w-24 md:w-32 text-xs md:text-sm font-medium italic">Title:</span>
                    <span className="font-serif font-semibold text-gray-800 text-sm md:text-base">{product?.title || "Untitled Artwork"}</span>
                  </div>
                  <div className="flex flex-row items-baseline">
                    <span className="text-gray-500 w-24 md:w-32 text-xs md:text-sm font-medium italic">Created:</span>
                    <span className="font-serif font-semibold text-gray-800 text-sm md:text-base">{product?.year || "2025"}</span>
                  </div>
                  <div className="flex flex-row items-baseline">
                    <span className="text-gray-500 w-24 md:w-32 text-xs md:text-sm font-medium italic">Medium:</span>
                    <span className="font-serif font-semibold text-gray-800 text-sm md:text-base">{product?.subcategory || "Oil on Canvas"}</span>
                  </div>
                </div>
                <div className="space-y-3 md:space-y-5">
                  <div className="flex flex-row items-baseline">
                    <span className="text-gray-500 w-24 md:w-32 text-xs md:text-sm font-medium italic">Dimensions:</span>
                    <span className="font-serif font-semibold text-gray-800 text-sm md:text-base">{product?.dimensions || "24 x 36 inches"}</span>
                  </div>
                  <div className="flex flex-row items-baseline">
                    <span className="text-gray-500 w-24 md:w-32 text-xs md:text-sm font-medium italic">Edition:</span>
                    <span className="font-serif font-semibold text-gray-800 text-sm md:text-base">
                      {product?.editionNumber && product?.totalEditionNumber ? 
                        `${product.editionNumber} / ${product.totalEditionNumber}` : 
                        "1 of 1 (Original)"}
                    </span>
                  </div>
                  <div className="flex flex-row items-baseline">
                    <span className="text-gray-500 w-24 md:w-32 text-xs md:text-sm font-medium italic">Certificate:</span>
                    <span className="font-serif font-semibold text-gray-800 text-sm md:text-base">{product?.certificateNumber || "COA-2025-0001"}</span>
                  </div>
                </div>
              </div>
              
              {/* Signature - Artistic design - Mobile Optimized */}
              <div className="mt-8 md:mt-10 border-t border-gray-200 pt-6 md:pt-8">
                <p className="text-gray-500 mb-3 md:mb-4 text-xs md:text-sm font-medium italic text-center">Artist's Signature</p>
                <div className="border border-gray-200 p-4 md:p-6 lg:p-8 bg-white rounded-lg shadow-sm mx-auto max-w-xs md:max-w-sm">
                  <div className="font-signature text-xl md:text-2xl lg:text-3xl flex justify-center">
                    {product?.artistSignature || "______________________"}
                  </div>
                </div>
                <div className="mt-4 md:mt-6 flex justify-center">
                  <div className="inline-flex items-center justify-center px-3 md:px-4 py-1.5 md:py-2 bg-gray-50 rounded-full text-xs text-gray-600 shadow-sm border border-gray-100">
                    <svg className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

      {/* Shipping Tab Content - Artistic design - Mobile Optimized */}
      <div id="shipping" className={activeTab === 'shipping' ? 'py-6 md:py-8 lg:py-12' : 'hidden'}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white">
            <div className="mb-6 md:mb-10 text-center">
              <h3 className="font-serif text-lg md:text-xl lg:text-3xl text-gray-800 mb-3 md:mb-4 italic">Artwork Delivery</h3>
              <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
                We treat each piece with the reverence it deserves throughout its journey to your collection.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 md:gap-8 lg:gap-10">
              {/* Shipping Options - Artistic card */}
              <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-red-50 rounded-full flex items-center justify-center mb-3 md:mb-4 group-hover:bg-red-100 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-base md:text-lg font-serif font-medium text-gray-800 mb-2 md:mb-3">Delivery Options</h4>
                  <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-600">
                    <li>
                      <span className="font-medium">Standard:</span> 5-7 business days
                    </li>
                    <li>
                      <span className="font-medium">Express:</span> 2-3 business days
                    </li>
                    <li>
                      <span className="font-medium">International:</span> 7-14 business days
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Packaging - Artistic card */}
              <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-red-50 rounded-full flex items-center justify-center mb-3 md:mb-4 group-hover:bg-red-100 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <h4 className="text-base md:text-lg font-serif font-medium text-gray-800 mb-2 md:mb-3">Archival Packaging</h4>
                  <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-600">
                    <li>Acid-free tissue paper</li>
                    <li>Archival bubble wrap</li>
                    <li>Rigid protective backing</li>
                    <li>Custom wooden crates for larger works</li>
                  </ul>
                </div>
              </div>
              
              {/* Security - Artistic card */}
              <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-red-50 rounded-full flex items-center justify-center mb-3 md:mb-4 group-hover:bg-red-100 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="text-base md:text-lg font-serif font-medium text-gray-800 mb-2 md:mb-3">Peace of Mind</h4>
                  <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-600">
                    <li>Full insurance coverage</li>
                    <li>Real-time tracking</li>
                    <li>Signature confirmation</li>
                    <li>Safe arrival guarantee</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Shipping Policy Note - Artistic design - Mobile Optimized */}
            <div className="mt-6 md:mt-10 p-4 md:p-6 border border-gray-100 rounded-lg bg-gray-50 shadow-sm">
              <div className="flex items-start">
                <div className="bg-blue-50 p-1.5 md:p-2 rounded-full mr-3 md:mr-4 mt-0.5 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs md:text-sm leading-relaxed text-gray-600">
                    <span className="font-medium">Note:</span> Our art handling specialists may adjust shipping timelines for custom framing requests or oversized pieces. For special handling requirements or white-glove installation services, please contact our art concierge team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Tab Content - Artistic design - Mobile Optimized */}
      <div id="reviews" className={activeTab === 'reviews' ? 'py-6 md:py-8 lg:py-12' : 'hidden'}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-50 p-5 md:p-8 rounded-lg shadow-sm border border-gray-100 text-center">
            <h3 className="font-serif text-lg md:text-xl lg:text-2xl text-gray-800 mb-4 md:mb-6 italic">Collector Experiences</h3>
            <div className="flex flex-col items-center justify-center py-4 md:py-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-3 md:mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4 md:mb-6 font-serif italic text-sm md:text-base">Be the first to share your experience with this artwork.</p>
              <button className="px-4 md:px-6 py-1.5 md:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm font-medium tracking-wide text-xs md:text-sm">
                Share Your Story
              </button>
            </div>
          </div>
        </div>
      </div>
      
{/* Artistic Footer */}
<div className="mt-8 md:mt-12 lg:mt-16 text-center opacity-60">
        <svg className="w-6 h-6 md:w-8 md:h-8 mx-auto text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
        </svg>
      </div>
    </div>
  );
};
