"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, HeartIcon, Paintbrush, Sparkles, ChevronDown } from "lucide-react";
import { getBrands } from '@/lib/firestore/brands/read_server';

// Import client components for interactive elements
import FavoriteButton from "./FavoriteButton";
import AddToCartButton from "./AddToCartButton";
import BuyNowButton from "./BuyNowButton";
import AuthContextProvider from "@/contexts/AuthContext";

export default function ProductsGridView({ products, initialDisplayCount = 10, mobileGridColumns = 1 }) {
  const [productsWithBrands, setProductsWithBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [displayCount, setDisplayCount] = useState(initialDisplayCount);
  const [showViewMoreButton, setShowViewMoreButton] = useState(false);

  // Animation effect
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [isLoading]);

  // Fetch brand data when products change
  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        setIsLoading(true);
        
        if (!products || products.length === 0) {
          setProductsWithBrands([]);
          return;
        }

        // Create an array to store all products with brand names
        const enrichedProducts = await Promise.all(
          products.map(async (product) => {
            let brandName = null;
            
            if (product.brandID) {
              try {
                // Fetch brand data for each product that has a brandID
                const brandData = await getBrands({ id: product.brandID });
                brandName = brandData?.name || "Unknown Artist";
              } catch (error) {
                console.error(`Error fetching brand for ${product.brandID}:`, error);
                brandName = "Unknown Artist";
              }
            }
            
            // Return product with brand name
            return {
              ...product,
              brandName
            };
          })
        );
        
        setProductsWithBrands(enrichedProducts);
        
        // Check if we need to show View More button
        setShowViewMoreButton(enrichedProducts.length > initialDisplayCount);
      } catch (error) {
        console.error("Error fetching brand data:", error);
        // Fall back to products without brand data
        setProductsWithBrands(products.map(product => ({
          ...product,
          brandName: "Unknown Artist"
        })));
        
        // Check if we need to show View More button for fallback products
        setShowViewMoreButton(products.length > initialDisplayCount);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrandData();
  }, [products, initialDisplayCount]);

  // Handle View More button click
  const handleViewMore = () => {
    // Show more products (if available)
    if (displayCount + initialDisplayCount >= productsWithBrands.length) {
      // Show all products
      setDisplayCount(productsWithBrands.length);
      setShowViewMoreButton(false);
    } else {
      // Show next batch of products
      setDisplayCount(prevCount => prevCount + initialDisplayCount);
    }
  };

  // Calculate discount percentage
  const calculateDiscount = (price, salePrice) => {
    if (!price || !salePrice || price <= salePrice) return null;
    const discount = Math.round(((price - salePrice) / price) * 100);
    return discount > 0 ? discount : null;
  };

  // Generate random gradient for each product
  const getArtisticGradient = (index) => {
    const gradients = [
      "from-blue-50 via-indigo-50 to-white",
      "from-rose-50 via-orange-50 to-white",
      "from-amber-50 via-yellow-50 to-white",
      "from-emerald-50 via-teal-50 to-white",
      "from-violet-50 via-purple-50 to-white",
      "from-pink-50 via-fuchsia-50 to-white"
    ];
    return gradients[index % gradients.length];
  };

  // Show loading state with artistic loader
  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 min-h-[300px] flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-t-3 border-l-3 border-blue-400 rounded-full animate-spin"></div>
          <div className="absolute top-1 left-1 w-10 h-10 border-b-3 border-r-3 border-purple-400 rounded-full animate-spin-slow"></div>
          <div className="absolute top-3 left-3 w-6 h-6 border-t-3 border-l-3 border-indigo-400 rounded-full animate-ping"></div>
          <div className="absolute top-2 left-2 w-8 h-8 bg-white opacity-30 rounded-full animate-pulse"></div>
        </div>
        <p className="absolute mt-20 font-serif italic text-indigo-600 text-xs animate-pulse">Curating artworks...</p>
      </div>
    );
  }
  
  // Number of products to display
  const visibleProducts = productsWithBrands.slice(0, displayCount);
  const remainingCount = productsWithBrands.length - displayCount;

  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-white py-6 md:py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 md:h-64 bg-gradient-to-b from-blue-50 to-transparent opacity-50"></div>
      <div className="absolute top-10 md:top-20 left-0 w-32 md:w-64 h-32 md:h-64 rounded-full bg-indigo-50 opacity-30 blur-3xl"></div>
      <div className="absolute top-20 md:top-40 right-0 w-48 md:w-96 h-48 md:h-96 rounded-full bg-rose-50 opacity-30 blur-3xl"></div>
      
      {/* Gallery Header */}
      <div className="text-center mb-6 md:mb-12 relative z-10">
        <div className="flex items-center justify-center gap-2 md:gap-3 mb-2">
          <span className="h-px w-8 md:w-16 bg-gradient-to-r from-transparent to-blue-300"></span>
          <Paintbrush size={16} className="text-blue-500" />
          <span className="h-px w-8 md:w-16 bg-gradient-to-l from-transparent to-blue-300"></span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-serif italic text-gray-800 relative inline-block">
          Artistic Collection
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-200"></span>
        </h2>
        <p className="text-gray-500 mt-2 max-w-md mx-auto text-xs sm:text-sm px-4">
          Discover unique pieces crafted by our talented artists, each artwork telling its own story
        </p>
      </div>
      
      <div className="max-w-screen-xl mx-auto px-3 sm:px-4">
        <div 
          className={`grid grid-cols-${mobileGridColumns ? mobileGridColumns : 2} sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          {visibleProducts?.map((product, index) => {
            const discount = calculateDiscount(product.price, product.salePrice);
            const stockAvailable = product.stock || 0;
            const gradient = getArtisticGradient(index);
            const isHovered = hoverIndex === index;

            return (
              <div
                key={product.id}
                className="group relative overflow-hidden transform transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 hover:z-10"
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                {/* Artistic card with shadow and gradient */}
                <div className={`bg-gradient-to-br ${gradient} rounded-lg sm:rounded-xl md:rounded-2xl shadow-sm hover:shadow-lg overflow-hidden h-full flex flex-col border border-white transition-all duration-500`}>
                  
                  {/* Product Image with Artistic Frame */}
                  <div className="relative aspect-square overflow-hidden bg-white">
                    <Link href={`/products/${product.id}`} className="block h-full cursor-pointer">
                      {/* Art canvas frame effect */}
                      <div className="absolute inset-0 m-2 sm:m-3 border border-gray-100 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                      
                      {/* Subtle canvas texture */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-50"></div>
                      
                      {/* Image container with shadow effect */}
                      <div className="relative h-full p-2 sm:p-3 md:p-4 flex items-center justify-center">
                        <div className="absolute inset-0 bg-white shadow-inner rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                        <img
                          src={product.featureImageUrl || "/placeholder-product.png"}
                          alt={product.title}
                          className="max-h-full max-w-full object-contain transition-all duration-700 group-hover:scale-105 md:group-hover:scale-110 relative z-10"
                          style={{
                            filter: isHovered ? 'contrast(1.05) brightness(1.02)' : 'none'
                          }}
                        />
                        
                        {/* Highlight glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-100 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-lg"></div>
                      </div>
                    </Link>

                    {/* Discount Badge with Artistic Style */}
                    {discount && (
                      <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white text-xs px-2 py-0.5 sm:px-3 sm:py-1 rounded-full font-medium shadow-md transform -rotate-3 z-20">
                        <span className="flex items-center gap-0.5 sm:gap-1">
                          <Sparkles size={8} className="hidden sm:inline animate-pulse" />
                          -{discount}% 
                        </span>
                      </div>
                    )}

                    {/* Quick Action Buttons - Artistic Floating Style */}
                    <div className="absolute right-1 sm:right-2 top-1 sm:top-2 flex flex-col gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 z-20">
                      <AuthContextProvider>
                        <FavoriteButton productId={product?.id} />
                      </AuthContextProvider>

                      <AuthContextProvider>
                        <AddToCartButton
                          productId={product?.id}
                          variant="quick"
                          stock={stockAvailable}
                          disabled={stockAvailable <= 0}
                          className="bg-white shadow-md hover:shadow-lg overflow-visible cursor-pointer"
                        />
                      </AuthContextProvider>

                      <Link
                        href={`/products/${product.id}`}
                        className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
                      >
                        <Eye size={12} className="sm:hidden" />
                        <Eye size={16} className="hidden sm:inline" />
                      </Link>
                    </div>
                  </div>

                  {/* Product Information with Artistic Styling */}
                  <div className="p-2 sm:p-3 md:p-4 flex flex-col flex-grow relative">
                    {/* Decorative brush stroke element */}
                    <div className="absolute top-0 right-0 w-8 sm:w-16 h-8 sm:h-16 bg-white rounded-full opacity-20 transform -translate-x-4 sm:-translate-x-8 -translate-y-4 sm:-translate-y-8"></div>
                    <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 w-10 sm:w-20 h-2 sm:h-3 bg-gradient-to-r from-blue-100 to-transparent opacity-30 rounded-full"></div>
                    
                    {/* Artist Name with Artistic Styling */}
                    {product.brandName && (
                      <Link href={`/artists/${product.brandID}`} className="group/artist cursor-pointer z-30">
                        <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-1.5">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                            <Paintbrush size={8} className="text-white hidden sm:inline" />
                          </div>
                          <span className="text-xs text-gray-600 font-serif italic truncate max-w-full">
                            {product.brandName}
                          </span>
                        </div>
                        <span className="block w-0 h-0.5 bg-gradient-to-r from-blue-300 to-indigo-300 group-hover/artist:w-full transition-all duration-300"></span>
                      </Link>
                    )}

                    {/* Product Title with Artistic Styling */}
                    <Link href={`/products/${product.id}`} className="cursor-pointer z-30">
                      <h3 className="font-medium text-xs sm:text-sm line-clamp-2 mb-1 sm:mb-2 group-hover:text-blue-700 transition-colors mt-1 sm:mt-2 z-30">
                        {product.title}
                      </h3>
                    </Link>

                    {/* Rating with Artistic Heart Icons */}
                    <div className="flex items-center mb-2 sm:mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((heart) => (
                          <svg
                            key={heart}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-3 w-3 sm:h-3.5 sm:w-3.5 transition-colors duration-300 ${
                              heart <= 4 
                                ? "text-rose-400 fill-rose-400 group-hover:text-rose-500 group-hover:fill-rose-500" 
                                : "text-gray-200"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">(4.0)</span>
                    </div>

                    {/* Price Information with Artistic Styling */}
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-1 sm:gap-2">
                        {product.salePrice ? (
                          <>
                            <span className="font-serif italic font-bold text-xs sm:text-sm text-blue-700 bg-blue-50 px-1.5 sm:px-2 py-0.5 rounded-md">
                              ${product.salePrice}
                            </span>
                            <span className="text-xs text-gray-500 line-through">${product.price}</span>
                          </>
                        ) : (
                          <span className="font-serif italic font-bold text-xs sm:text-sm text-blue-700 bg-blue-50 px-1.5 sm:px-2 py-0.5 rounded-md">
                            ${product.price}
                          </span>
                        )}
                      </div>
                      
                      {/* Stock Status Badge with Artistic Styling */}
                      {stockAvailable > 0 ? (
                        <span className="text-xs text-emerald-600 bg-emerald-50 px-1.5 sm:px-2.5 py-0.5 rounded-full border border-emerald-100 whitespace-nowrap text-[10px] sm:text-xs">
                          Available
                        </span>
                      ) : (
                        <span className="text-xs text-rose-600 bg-rose-50 px-1.5 sm:px-2.5 py-0.5 rounded-full border border-rose-100 whitespace-nowrap text-[10px] sm:text-xs">
                          Sold Out
                        </span>
                      )}
                    </div>

                    {/* Action Buttons with Artistic Styling */}
                    <div className="mt-2 sm:mt-4 grid grid-cols-2 gap-1 sm:gap-2 relative">
                      {/* Decorative line */}
                      <div className="absolute -top-1 sm:-top-2 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                      
                      <AuthContextProvider>
                        <AddToCartButton
                          productId={product?.id}
                          stock={stockAvailable}
                          disabled={stockAvailable <= 0}
                          variant="outline"
                          size="sm"
                          buttonText={window.innerWidth < 640 ? "Add" : "Add to Cart"}
                          showIcon={true}
                          fullWidth={true}
                          className="rounded-full text-[10px] sm:text-xs border border-blue-200 hover:border-blue-400 overflow-visible cursor-pointer z-30 py-1 sm:py-2"
                        />
                      </AuthContextProvider>

                      <AuthContextProvider>
                        <BuyNowButton
                          productId={product?.id}
                          stock={stockAvailable}
                          disabled={stockAvailable <= 0}
                          variant="premium"
                          size="sm"
                          buttonText="Acquire"
                          showIcon={false}
                          fullWidth={true}
                          className="rounded-full text-[10px] sm:text-xs bg-gradient-to-r from-blue-500 to-indigo-600 overflow-visible cursor-pointer z-30 py-1 sm:py-2"
                        />
                      </AuthContextProvider>
                    </div>
                  </div>
                </div>
                
                {/* Subtle hover shadow/glow effect */}
                <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl bg-blue-400 opacity-0 group-hover:opacity-5 blur-lg transform scale-110 transition-all duration-500"></div>
              </div>
            );
          })}
        </div>
        
        {/* View More Button with Artistic Styling */}
        {showViewMoreButton && (
          <div className="mt-8 sm:mt-12 md:mt-16 text-center relative transition-all duration-500 hover:transform hover:scale-105">
            {/* Decorative elements for View More button */}
            <div className="absolute -top-4 sm:-top-6 left-1/2 transform -translate-x-1/2 w-20 sm:w-40 h-20 sm:h-40">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 sm:w-20 h-10 sm:h-20 bg-blue-50 opacity-20 rounded-full blur-xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 sm:w-16 h-8 sm:h-16 bg-indigo-50 opacity-30 rounded-full blur-lg"></div>
            </div>
            
            <button
              onClick={handleViewMore}
              className="group relative inline-flex items-center gap-1 sm:gap-2 px-4 sm:px-8 py-2 sm:py-3 overflow-visible rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md transition-all duration-500 hover:shadow-lg hover:from-blue-600 hover:to-indigo-700"
            >
              {/* Button inner glow/light effect */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-white to-transparent opacity-20 transform translate-y-3/4 group-hover:translate-y-0 transition-transform duration-500"></div>
              
              <span className="relative font-serif italic text-sm sm:text-base">
                Explore More Artworks
              </span>
              
              <span className="relative flex items-center justify-center w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-white bg-opacity-20">
                <ChevronDown size={12} className="text-white sm:hidden group-hover:animate-bounce" />
                <ChevronDown size={16} className="text-white hidden sm:inline group-hover:animate-bounce" />
              </span>
              
              {/* Show remaining count if available */}
              {remainingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center bg-white text-indigo-600 rounded-full text-[10px] sm:text-xs font-medium shadow-sm z-30">
                  {remainingCount < 100 ? remainingCount : '99+'}
                </span>
              )}
            </button>
            
            {/* Decorative brush stroke under the button */}
            <div className="relative mx-auto mt-2 sm:mt-3 w-16 sm:w-32 h-0.5 sm:h-1">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-60"></div>
            </div>
          </div>
        )}
        
        {/* Decorative bottom section */}
        <div className="mt-6 sm:mt-8 md:mt-12 text-center">
          <div className="h-px w-16 sm:w-32 bg-gradient-to-r from-transparent via-blue-200 to-transparent mx-auto"></div>
          <p className="text-gray-500 text-[10px] sm:text-xs font-serif italic mt-1 sm:mt-2">Each artwork is unique and handcrafted with passion</p>
        </div>
      </div>
      
      {/* Add global styles for animations and cursor styling */}
      <style jsx global>{`
        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        
        .hover-lift {
          transition: transform 0.3s ease-out;
        }
        
        .hover-lift:hover {
          transform: translateY(-5px);
        }
        
        /* Global cursor styles for interactive elements */
        a, button, 
        [role="button"],
        .clickable,
        Link {
          cursor: pointer !important;
        }
        
        /* Disabled buttons should show not-allowed cursor */
        button:disabled,
        [role="button"][disabled],
        .disabled {
          cursor: not-allowed !important;
        }
        
        /* Responsive text adjustment for Add to Cart button */
        @media (max-width: 639px) {
          .add-to-cart-text {
            display: none;
          }
          .add-to-cart-icon {
            display: inline-flex;
          }
        }
      `}</style>
    </div>
  );
}