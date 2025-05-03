import React from "react";
import { getBrands } from '@/lib/firestore/brands/read_server';

export const ArtworkDetails = async ({ product }) => {
  // Fetch the brand/artist information
  const brand = product?.brandID ? await getBrands({ id: product.brandID }) : null;
  
  // Details with proper field mapping from your schema
  const details = {
    artist: brand?.name || "Madhusudhan Sharma",
    medium: product?.subcategory || "Not Specified", // Using subcategory as medium
    dimensions: product?.dimensions || "Not Specified",
    year: product?.year || "2025",
    framing: product?.framing || "Unframed",
    certificate: product?.certificateNumber ? `Certificate #${product.certificateNumber}` : "Includes Authentication",
    edition: <span> {product?.editionNumber} / {product?.totalEditionNumber}  </span> || "Original (1 of 1)"

  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 md:p-10 hover:shadow-xl transition-shadow duration-500">
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 md:mb-8 flex items-center">
        <span className="block w-6 sm:w-8 h-1 bg-amber-500 mr-2 sm:mr-3"></span>
        Artwork Specifications
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Artist */}
        <div className="group relative overflow-hidden rounded-lg bg-white p-3 sm:p-4 shadow-sm border-l-4 border-amber-500 transition-all duration-300 hover:shadow-md">
          <div className="absolute -right-12 -top-12 w-24 h-24 rounded-full bg-amber-50 opacity-30 group-hover:scale-150 transition-transform duration-500"></div>
          <p className="text-xs uppercase tracking-wider text-amber-600 mb-1">Artist</p>
          <p className="text-sm sm:text-base md:text-xl font-serif font-medium text-gray-800">{details.artist}</p>
        </div>
        
        {/* Medium */}
        <div className="group relative overflow-hidden rounded-lg bg-white p-3 sm:p-4 shadow-sm border-l-4 border-indigo-500 transition-all duration-300 hover:shadow-md">
          <div className="absolute -right-12 -top-12 w-24 h-24 rounded-full bg-indigo-50 opacity-30 group-hover:scale-150 transition-transform duration-500"></div>
          <p className="text-xs uppercase tracking-wider text-indigo-600 mb-1">Medium</p>
          <p className="text-sm sm:text-base md:text-xl font-serif font-medium text-gray-800">{details.medium}</p>
        </div>
        
        {/* Dimensions */}
        <div className="group relative overflow-hidden rounded-lg bg-white p-3 sm:p-4 shadow-sm border-l-4 border-emerald-500 transition-all duration-300 hover:shadow-md">
          <div className="absolute -right-12 -top-12 w-24 h-24 rounded-full bg-emerald-50 opacity-30 group-hover:scale-150 transition-transform duration-500"></div>
          <p className="text-xs uppercase tracking-wider text-emerald-600 mb-1">Dimensions</p>
          <p className="text-sm sm:text-base md:text-xl font-serif font-medium text-gray-800">{details.dimensions}</p>
        </div>
        
        {/* Year */}
        <div className="group relative overflow-hidden rounded-lg bg-white p-3 sm:p-4 shadow-sm border-l-4 border-rose-500 transition-all duration-300 hover:shadow-md">
          <div className="absolute -right-12 -top-12 w-24 h-24 rounded-full bg-rose-50 opacity-30 group-hover:scale-150 transition-transform duration-500"></div>
          <p className="text-xs uppercase tracking-wider text-rose-600 mb-1">Year</p>
          <p className="text-sm sm:text-base md:text-xl font-serif font-medium text-gray-800">{details.year}</p>
        </div>
        
        {/* Framing */}
        <div className="group relative overflow-hidden rounded-lg bg-white p-3 sm:p-4 shadow-sm border-l-4 border-blue-500 transition-all duration-300 hover:shadow-md">
          <div className="absolute -right-12 -top-12 w-24 h-24 rounded-full bg-blue-50 opacity-30 group-hover:scale-150 transition-transform duration-500"></div>
          <p className="text-xs uppercase tracking-wider text-blue-600 mb-1">Framing</p>
          <p className="text-sm sm:text-base md:text-xl font-serif font-medium text-gray-800">{details.framing}</p>
        </div>
        
        {/* Edition */}
        <div className="group relative overflow-hidden rounded-lg bg-white p-3 sm:p-4 shadow-sm border-l-4 border-purple-500 transition-all duration-300 hover:shadow-md">
          <div className="absolute -right-12 -top-12 w-24 h-24 rounded-full bg-purple-50 opacity-30 group-hover:scale-150 transition-transform duration-500"></div>
          <p className="text-xs uppercase tracking-wider text-purple-600 mb-1">Edition</p>
          <p className="text-sm sm:text-base md:text-xl font-serif font-medium text-gray-800">{details.edition}</p>
        </div>
      </div>
      
      {/* Certificate */}
      <div className="mt-6 sm:mt-8 relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-50 to-white p-4 sm:p-6 shadow-sm border border-amber-200 transition-all duration-300 hover:shadow-md">
        <div className="absolute -right-16 -bottom-16 w-32 h-32 rounded-full bg-amber-100 opacity-30"></div>
        <div className="absolute right-2 top-2 sm:right-4 sm:top-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 text-amber-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <p className="text-xs uppercase tracking-wider text-amber-700 mb-1">Certificate of Authenticity</p>
        <p className="text-sm sm:text-base md:text-xl font-serif font-medium text-gray-800">{details.certificate}</p>
        <p className="mt-2 text-xs italic text-gray-500">Each artwork includes a signed certificate verifying its originality and provenance</p>
      </div>
      
      {/* New: Zoom feature for mobile */}
      <div className="mt-6 text-center">
        <button className="inline-flex items-center justify-center text-sm bg-white text-gray-700 py-2 px-4 rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m4-3h-6" />
          </svg>
          View Detailed Close-Up
        </button>
      </div>
    </div>
  );
};