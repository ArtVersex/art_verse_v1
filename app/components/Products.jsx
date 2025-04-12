"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { getBrands } from '@/lib/firestore/brands/read_server';

// Import client components for interactive elements
import FavoriteButton from "./FavoriteButton";
import AddToCartButton from "./AddToCartButton";
import BuyNowButton from "./BuyNowButton";
import AuthContextProvider from "@/contexts/AuthContext";

export default function ProductsGridView({ products }) {
  const [productsWithBrands, setProductsWithBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      } catch (error) {
        console.error("Error fetching brand data:", error);
        // Fall back to products without brand data
        setProductsWithBrands(products.map(product => ({
          ...product,
          brandName: "Unknown Artist"
        })));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrandData();
  }, [products]);

  // Calculate discount percentage
  const calculateDiscount = (price, salePrice) => {
    if (!price || !salePrice || price <= salePrice) return null;
    const discount = Math.round(((price - salePrice) / price) * 100);
    return discount > 0 ? discount : null;
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-[#f8f8f8] min-h-[200px] flex items-center justify-center">
        <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f8f8]">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {productsWithBrands?.map((product) => {
            const discount = calculateDiscount(product.price, product.salePrice);
            const stockAvailable = product.stock || 0;

            return (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col group"
              >
                {/* Product Image with Overlay */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Link href={`/product/${product.id}`}>
                    <img
                      src={product.featureImageUrl || "/placeholder-product.png"}
                      alt={product.title}
                      className="w-full h-full object-contain p-4"
                    />
                  </Link>

                  {/* Discount Badge */}
                  {/* {discount && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                      -{discount}%
                    </div>
                  )} */}

                  {/* Quick Action Buttons - Appear on Hover */}
                  <div className="absolute inset-0 bg-black/5 flex items-center justify-center gap-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    <AuthContextProvider>
                      <FavoriteButton productId={product?.id} />
                    </AuthContextProvider>

                    <AuthContextProvider>
                      <AddToCartButton
                        productId={product?.id}
                        variant="quick"
                        stock={stockAvailable}
                        disabled={stockAvailable <= 0}
                      />
                    </AuthContextProvider>

                    <Link
                      href={`/products/${product.id}`}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-blue-500 hover:text-white transition-colors"
                    >
                      <Eye size={16} />
                    </Link>
                  </div>
                </div>

                {/* Product Information */}
                <div className="p-3 flex flex-col flex-grow">
                  {/* Brand Name instead of ID */}
                  {product.brandName && (
                    <span className="text-xs text-gray-500 mb-1">Artist: {product.brandName}</span>
                  )}

                  {/* Product Title */}
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-medium text-sm line-clamp-2 mb-1 hover:text-blue-600 transition-colors">
                      {product.title}
                    </h3>
                  </Link>

                  {/* Rating Static Display */}
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-3 w-3 ${star <= 4 ? "text-red-400 fill-red-400" : "text-gray-300"}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">(4.0)</span>
                  </div>

                  {/* Price Information */}
                  <div className="mt-auto flex items-center gap-2">
                    {product.salePrice ? (
                      <>
                        <span className="font-bold text-sm">${product.salePrice}</span>
                        <span className="text-xs text-gray-500 line-through">${product.price}</span>
                      </>
                    ) : (
                      <span className="font-bold text-sm">${product.price}</span>
                    )}
                  </div>

                  {/* Stock Information - Now visible */}
                  {/* <div className="mt-1 text-xs">
                    {stockAvailable > 0 ? (
                      <span className="text-green-600">In Stock ({stockAvailable})</span>
                    ) : (
                      <span className="text-red-600">Out of Stock</span>
                    )}
                  </div> */}

                  {/* Action Buttons - Side by side with enhanced premium design */}
                  <div className="mt-3 flex gap-2">
                    {/* Add to Cart Button */}
                    <AuthContextProvider>
                      <AddToCartButton
                        productId={product?.id}
                        stock={stockAvailable}
                        disabled={stockAvailable <= 0}
                        variant="outline"
                        size="sm"
                      />
                    </AuthContextProvider>

                    {/* Buy Now Button */}
                    <AuthContextProvider>
                      <BuyNowButton
                        productId={product?.id}
                        stock={stockAvailable}
                        disabled={stockAvailable <= 0}
                        variant="premium"
                        size="sm"
                      />
                    </AuthContextProvider>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 