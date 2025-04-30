"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ImageIcon, ExpandIcon, ChevronLeft, ChevronRight, XIcon, Eye } from "lucide-react";

export const ProductImageGallery = ({
  featureImageUrl,
  imageList = [],
  title,
}) => {
  const allImages = featureImageUrl
    ? [featureImageUrl, ...imageList]
    : imageList;

  const [selectedImage, setSelectedImage] = useState(allImages[0] || "");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);

  // Check for mobile device on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Add a small delay for animation effects
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Memoized navigation functions to prevent unnecessary re-renders
  const handlePrevImage = useCallback(() => {
    const currentIndex = allImages.indexOf(selectedImage);
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setSelectedImage(allImages[prevIndex]);
  }, [allImages, selectedImage]);

  const handleNextImage = useCallback(() => {
    const currentIndex = allImages.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % allImages.length;
    setSelectedImage(allImages[nextIndex]);
  }, [allImages, selectedImage]);

  // Handle image selection
  const handleImageSelect = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // Toggle full-screen view
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Touch handlers for swipe functionality
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const difference = touchStart - touchEnd;
    
    // Threshold to determine if swipe was intentional
    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        // Swipe left, go to next image
        handleNextImage();
      } else {
        // Swipe right, go to previous image
        handlePrevImage();
      }
    }
  };

  if (allImages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-64 bg-stone-50 rounded-xl border border-stone-200">
        <div className="p-6 bg-white rounded-full shadow-md">
          <ImageIcon className="w-12 h-12 text-stone-400" />
        </div>
        <p className="mt-6 text-stone-600 font-serif italic">No artwork images available</p>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-4 md:space-y-6 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Featured/Selected Image Section */}
      <div 
        className="relative w-full aspect-square group rounded-xl overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Artistic Frame - smaller on mobile */}
        <div className="absolute inset-0 border-[8px] md:border-[16px] border-stone-100 rounded-xl shadow-md z-10 pointer-events-none"></div>
        
        <Image
          src={selectedImage}
          alt={title || "Artwork Image"}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover cursor-pointer transition-transform duration-1000 ease-out group-hover:scale-105"
          onClick={toggleFullScreen}
          onDoubleClick={() => isFullScreen && toggleFullScreen()}
        />
        
        {/* Artistic Overlay - Always visible but subtle on mobile */}
        <div className={`absolute inset-0 bg-gradient-to-b from-black/10 to-transparent ${isMobile ? 'opacity-30' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-500`}></div>
        
        {/* Navigation Buttons - Always visible on mobile */}
        <button
          onClick={handlePrevImage}
          className={`absolute left-2 md:left-6 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 md:p-3 rounded-full hover:bg-white transition-all shadow-lg ${isMobile ? 'opacity-70' : 'opacity-0 group-hover:opacity-100'} z-20`}
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-stone-800" />
        </button>
        <button
          onClick={handleNextImage}
          className={`absolute right-2 md:right-6 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 md:p-3 rounded-full hover:bg-white transition-all shadow-lg ${isMobile ? 'opacity-70' : 'opacity-0 group-hover:opacity-100'} z-20`}
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-stone-800" />
        </button>
        
        {/* Full-Screen Toggle Button - Smaller on mobile */}
        <button
          onClick={toggleFullScreen}
          className={`absolute bottom-2 md:bottom-6 right-2 md:right-6 bg-white/90 p-2 md:p-3 rounded-full hover:bg-white transition-all shadow-lg ${isMobile ? 'opacity-70' : 'opacity-0 group-hover:opacity-100'} z-20 flex items-center`}
          aria-label="View full screen"
        >
          <ExpandIcon className="w-4 h-4 md:w-5 md:h-5 text-stone-800" />
          <span className="ml-2 text-xs md:text-sm font-serif italic hidden md:inline">View Full</span>
        </button>
        
        {/* Image Counter - Smaller on mobile */}
        <div className={`absolute bottom-2 md:bottom-6 left-2 md:left-6 bg-white/90 px-3 md:px-4 py-1 md:py-2 rounded-full shadow-lg ${isMobile ? 'opacity-70' : 'opacity-0 group-hover:opacity-100'} z-20 flex items-center`}>
          <Eye className="w-3 h-3 md:w-4 md:h-4 text-stone-600 mr-1 md:mr-2" />
          <span className="text-xs md:text-sm font-serif">{allImages.indexOf(selectedImage) + 1} / {allImages.length}</span>
        </div>
      </div>

      {/* Thumbnail Gallery - Horizontally scrollable on mobile */}
      <div className="mt-4 md:mt-8">
        <h3 className="text-xs md:text-sm font-serif italic text-stone-600 mb-2 md:mb-3 ml-1">Gallery View</h3>
        <div className="flex space-x-3 md:space-x-4 overflow-x-auto pb-3 md:pb-4 px-1 scrollbar-thin scrollbar-thumb-stone-400 scrollbar-track-stone-100 snap-x">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleImageSelect(image)}
              className={`
                relative w-16 h-16 md:w-24 md:h-24 flex-shrink-0
                rounded-md overflow-hidden snap-center
                ${
                  selectedImage === image
                    ? "ring-2 ring-amber-500 shadow-lg transform scale-105 z-10"
                    : "opacity-80 hover:opacity-100 shadow-sm"
                }
                transition-all duration-300 border border-stone-200
              `}
              aria-label={`Select image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 64px, 96px"
                className="object-cover"
              />
              {selectedImage === image && (
                <div className="absolute inset-0 border-2 border-white pointer-events-none"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Full Screen Overlay - Better mobile layout */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 md:p-6 backdrop-blur-sm">
          {/* Artistic Frame for Full Screen - Hidden on smaller screens */}
          <div className="absolute inset-6 md:inset-12 border border-white/20 rounded-xl pointer-events-none hidden md:block"></div>
          
          {/* Full-Screen Image */}
          <div 
            className="relative max-w-full max-h-full"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={selectedImage}
              alt={title || "Full Screen Image"}
              width={1200}
              height={1200}
              sizes="100vw"
              className="max-w-full max-h-full object-contain"
              onDoubleClick={toggleFullScreen}
            />
            
            {/* Navigation Buttons in Full-Screen - Smaller on mobile */}
            <button
              onClick={handlePrevImage}
              className="absolute left-1 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 md:p-3 rounded-full hover:bg-white transition-all opacity-70 hover:opacity-100 shadow-xl"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-stone-800" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-1 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 md:p-3 rounded-full hover:bg-white transition-all opacity-70 hover:opacity-100 shadow-xl"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-stone-800" />
            </button>
            
            {/* Close Button - Smaller on mobile */}
            <button
              onClick={toggleFullScreen}
              className="absolute top-1 md:top-4 right-1 md:right-4 bg-white/80 p-2 md:p-3 rounded-full hover:bg-white shadow-xl"
              aria-label="Close fullscreen view"
            >
              <XIcon className="w-5 h-5 md:w-6 md:h-6 text-stone-800" />
            </button>
            
            {/* Image Info - More compact on mobile */}
            <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-serif">
              <p className="text-center text-sm md:text-base">
                <span className="text-amber-300">{allImages.indexOf(selectedImage) + 1}</span>
                <span className="mx-1 md:mx-2">/</span>
                <span>{allImages.length}</span>
                {title && <span className="ml-2 md:ml-4 italic text-white/80 text-xs md:text-sm">{title}</span>}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};