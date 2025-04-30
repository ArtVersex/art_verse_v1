"use client";
import React, { useState } from 'react';
import { ChevronRight, Menu } from 'lucide-react';

export const Breadcrumb = ({ productTitle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Truncate title for mobile display
  const truncatedTitle = productTitle.length > 20 
    ? productTitle.substring(0, 18) + '...' 
    : productTitle;
  
  return (
    <div className="mb-4 sm:mb-8 relative">
      {/* Mobile breadcrumb with dropdown */}
      <div className="flex items-center justify-between sm:hidden">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center text-stone-600 font-serif italic text-sm"
        >
          <span>Gallery</span>
          <ChevronRight className="w-4 h-4 mx-1 text-stone-400" />
          <span className="font-medium text-stone-900">{truncatedTitle}</span>
          <Menu className="ml-1 w-4 h-4 text-amber-600" />
        </button>
        
        {/* Mobile breadcrumb dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-md z-10 py-2 border border-gray-100">
            <a href="/" className="block px-4 py-2 text-stone-600 hover:bg-amber-50">
              Home
            </a>
            <a href="/" className="block px-4 py-2 text-stone-600 hover:bg-amber-50">
              Gallery
            </a>
            <div className="px-4 py-2 text-stone-900 font-medium bg-amber-50">
              {productTitle}
            </div>
          </div>
        )}
      </div>
      
      {/* Desktop breadcrumb */}
      <nav className="hidden sm:block font-serif italic text-sm">
        <ol className="flex items-center flex-wrap">
          <li>
            <a href="/" className="text-stone-600 hover:text-amber-700 transition-colors duration-300">
              Home
            </a>
          </li>
          <li className="mx-2 text-stone-400">
            <ChevronRight className="w-4 h-4" />
          </li>
          <li>
            <a href="/" className="text-stone-600 hover:text-amber-700 transition-colors duration-300">
              Gallery
            </a>
          </li>
          <li className="mx-2 text-stone-400">
            <ChevronRight className="w-4 h-4" />
          </li>
          <li className="text-stone-900 font-medium relative group">
            <span className="relative">
              {productTitle}
              <span className="absolute -bottom-1 left-0 w-full h-px bg-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </span>
          </li>
        </ol>
      </nav>
    </div>
  );
};