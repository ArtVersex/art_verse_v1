import React from "react";
import { getBrands } from '@/lib/firestore/brands/read_server';

export const ArtworkDetails = async ({ product }) => {
  // Fetch the brand/artist information
  const brand = product?.brandID ? await getBrands({ id: product.brandID }) : null;
  
  // Details with proper field mapping from your schema
  const details = {
    artist: brand?.name || "Alexander Visionary",
    medium: product?.subcategory || "Acrylic on Canvas", // Using subcategory as medium
    dimensions: product?.dimensions || "24\" × 36\" (61cm × 91cm)",
    year: product?.year || "2025",
    framing: product?.framing || "Unframed",
    certificate: product?.certificateNumber ? `Certificate #${product.certificateNumber}` : "Includes Authentication",
    edition: product?.editionNumber || "Original (1 of 1)"
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6 md:p-8 hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        Artwork Details
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-1 sm:space-y-2 border-b sm:border-b-0 pb-3 sm:pb-0 sm:border-r border-gray-100 pr-0 sm:pr-4">
          <p className="text-xs sm:text-sm font-semibold text-gray-500">Artist</p>
          <p className="text-base sm:text-lg font-medium text-gray-900">{details.artist}</p>
        </div>
        <div className="space-y-1 sm:space-y-2 border-b pb-3 sm:pb-4">
          <p className="text-xs sm:text-sm font-semibold text-gray-500">Medium</p>
          <p className="text-base sm:text-lg font-medium text-gray-900">{details.medium}</p>
        </div>
        <div className="space-y-1 sm:space-y-2 border-b sm:border-b-0 pb-3 sm:pb-0 sm:border-r border-gray-100 pr-0 sm:pr-4">
          <p className="text-xs sm:text-sm font-semibold text-gray-500">Dimensions</p>
          <p className="text-base sm:text-lg font-medium text-gray-900">{details.dimensions}</p>
        </div>
        <div className="space-y-1 sm:space-y-2 border-b pb-3 sm:pb-4">
          <p className="text-xs sm:text-sm font-semibold text-gray-500">Year</p>
          <p className="text-base sm:text-lg font-medium text-gray-900">{details.year}</p>
        </div>
        <div className="space-y-1 sm:space-y-2 border-b sm:border-b-0 pb-3 sm:pb-0 sm:border-r border-gray-100 pr-0 sm:pr-4">
          <p className="text-xs sm:text-sm font-semibold text-gray-500">Framing</p>
          <p className="text-base sm:text-lg font-medium text-gray-900">{details.framing}</p>
        </div>
        <div className="space-y-1 sm:space-y-2 border-b pb-3 sm:pb-4">
          <p className="text-xs sm:text-sm font-semibold text-gray-500">Edition</p>
          <p className="text-base sm:text-lg font-medium text-gray-900">{details.edition}</p>
        </div>
        <div className="space-y-1 sm:space-y-2 col-span-1 sm:col-span-2 pt-1">
          <p className="text-xs sm:text-sm font-semibold text-gray-500">Certificate</p>
          <p className="text-base sm:text-lg font-medium text-gray-900">{details.certificate}</p>
        </div>
      </div>
    </div>
  );
};