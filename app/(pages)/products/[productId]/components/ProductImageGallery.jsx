"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ImageIcon, ExpandIcon, ChevronLeft, ChevronRight, XIcon, Eye, ZoomIn, ZoomOut } from "lucide-react";
import PaintingWall from "./PaintingWall"; // Import the PaintingWall component

export const ProductImageGallery = ({
  featureImageUrl,
  imageList = [],
  title,
  frameColor = '#5a3e2b', // Default frame color for PaintingWall
  wallSize = 'medium', // Default size for PaintingWall
}) => {
  const allImages = featureImageUrl
    ? [featureImageUrl, ...imageList]
    : imageList;

  // Initialize with Wall View as default
  const [isWallView, setIsWallView] = useState(true); 
  const [selectedImage, setSelectedImage] = useState(allImages[0] || "");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1); // New state for zoom level
  const [isZoomed, setIsZoomed] = useState(false); // Track if image is zoomed
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 }); // Track mouse position for zooming

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

  // Reset zoom level when changing images
  useEffect(() => {
    setZoomLevel(1);
    setIsZoomed(false);
  }, [selectedImage]);

  // Memoized navigation functions to prevent unnecessary re-renders
  const handlePrevImage = useCallback(() => {
    const currentIndex = allImages.indexOf(selectedImage);
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setSelectedImage(allImages[prevIndex]);
    setIsWallView(false); // Reset to normal view when navigating
  }, [allImages, selectedImage]);

  const handleNextImage = useCallback(() => {
    const currentIndex = allImages.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % allImages.length;
    setSelectedImage(allImages[nextIndex]);
    setIsWallView(false); // Reset to normal view when navigating
  }, [allImages, selectedImage]);

  // Handle image selection
  const handleImageSelect = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsWallView(false); // Reset to normal view when selecting directly
  };

  // Toggle full-screen view
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    // Reset zoom when entering/exiting fullscreen
    setZoomLevel(1);
    setIsZoomed(false);
  };

  // Toggle wall view
  const toggleWallView = () => {
    setIsWallView(!isWallView);
    // Reset zoom when switching views
    setZoomLevel(1);
    setIsZoomed(false);
  };

  // Zoom in function
  const zoomIn = () => {
    // Max zoom level of 3x
    if (zoomLevel < 3) {
      setZoomLevel(prev => Math.min(prev + 0.5, 3));
      setIsZoomed(true);
    }
  };

  // Zoom out function
  const zoomOut = () => {
    if (zoomLevel > 1) {
      setZoomLevel(prev => Math.max(prev - 0.5, 1));
      setIsZoomed(zoomLevel - 0.5 > 1);
    }
  };

  // Handle mouse move for zoomed image panning
  const handleMouseMove = (e) => {
    if (isZoomed) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - bounds.left) / bounds.width;
      const y = (e.clientY - bounds.top) / bounds.height;
      
      setZoomPosition({ x, y });
    }
  };

  // Reset zoom on mouse leave
  const handleMouseLeave = () => {
    if (!isMobile) {
      setZoomLevel(1);
      setIsZoomed(false);
    }
  };

  // Touch handlers for swipe functionality
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    // Only handle swipe if not zoomed
    if (zoomLevel === 1) {
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
    }
  };

  // Double tap/click to zoom
  const handleDoubleTap = () => {
    if (!isWallView) {
      if (!isZoomed) {
        setZoomLevel(2);
        setIsZoomed(true);
      } else {
        setZoomLevel(1);
        setIsZoomed(false);
      }
    }
  };

  // Double click handler for mobile
  const handleDoubleClick = () => {
    if (isFullScreen) {
      toggleFullScreen();
    } else {
      handleDoubleTap();
    }
  };

  // Wheel handler for zoom
  const handleWheel = (e) => {
    if (!isWallView && !isFullScreen) {
      e.preventDefault();
      if (e.deltaY < 0) {
        zoomIn();
      } else {
        zoomOut();
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
        onWheel={handleWheel}
      >
        {isWallView ? (
          <div className="flex items-center justify-center w-full h-full bg-stone-100 rounded-xl">
            <PaintingWall 
              paintingUrl={selectedImage} 
              frameColor={frameColor}
              size={wallSize}
            />
          </div>
        ) : (
          <>
            {/* Artistic Frame - smaller on mobile */}
            <div className="absolute inset-0 border-[8px] md:border-[16px] border-stone-100 rounded-xl shadow-md z-10 pointer-events-none"></div>
            
            <div 
              className="relative w-full h-full overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onDoubleClick={handleDoubleClick}
            >
              <div
                className={`
                  relative w-full h-full 
                  transition-transform duration-300 
                  ${isZoomed ? 'cursor-move' : 'cursor-zoom-in'}
                `}
                style={{
                  transform: isZoomed ? `scale(${zoomLevel})` : 'scale(1)',
                  transformOrigin: isZoomed ? `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%` : 'center center'
                }}
              >
                <Image
                  src={selectedImage}
                  alt={title || "Artwork Image"}
                  fill
                  priority
                  className="object-contain transition-transform duration-1000 ease-out group-hover:scale-105"
                  onClick={isZoomed ? null : toggleFullScreen}
                />
              </div>
            </div>
            
            {/* Artistic Overlay - Always visible but subtle on mobile */}
            <div className={`absolute inset-0 bg-gradient-to-b from-black/10 to-transparent ${isMobile ? 'opacity-30' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-500`}></div>
          </>
        )}

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
        
        {/* Display Mode Toggle Button */}
        <button
          onClick={toggleWallView}
          className={`absolute top-2 md:top-6 left-2 md:left-6 bg-white/90 p-2 md:p-3 rounded-full hover:bg-white transition-all shadow-lg ${isMobile ? 'opacity-70' : 'opacity-0 group-hover:opacity-100'} z-20 flex items-center`}
          aria-label="Toggle frame view"
        >
          {/* You can use a custom icon here or adjust as needed */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-4 h-4 md:w-5 md:h-5 text-stone-800"
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <rect x="7" y="7" width="10" height="10" rx="1" ry="1" />
          </svg>
          <span className="ml-2 text-xs md:text-sm font-serif italic hidden md:inline">
            {isWallView ? "Standard View" : "Wall View"}
          </span>
        </button>
        
        {/* Zoom controls - Only show in standard view and not in fullscreen */}
        {!isWallView && !isFullScreen && (
          <div className="absolute top-2 md:top-6 right-2 md:right-6 flex items-center space-x-2 z-20">
            {/* Zoom In Button */}
            <button
              onClick={zoomIn}
              disabled={zoomLevel >= 3}
              className={`bg-white/90 p-2 md:p-3 rounded-full hover:bg-white transition-all shadow-lg ${zoomLevel >= 3 ? 'opacity-50 cursor-not-allowed' : isMobile ? 'opacity-70' : 'opacity-0 group-hover:opacity-100'}`}
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4 md:w-5 md:h-5 text-stone-800" />
            </button>
            
            {/* Zoom Out Button - only show if zoomed in */}
            {zoomLevel > 1 && (
              <button
                onClick={zoomOut}
                className={`bg-white/90 p-2 md:p-3 rounded-full hover:bg-white transition-all shadow-lg ${isMobile ? 'opacity-70' : 'opacity-0 group-hover:opacity-100'}`}
                aria-label="Zoom out"
              >
                <ZoomOut className="w-4 h-4 md:w-5 md:h-5 text-stone-800" />
              </button>
            )}
          </div>
        )}
        
        {/* Full-Screen Toggle Button - Only show in standard view */}
        {!isWallView && (
          <button
            onClick={toggleFullScreen}
            className={`absolute bottom-2 md:bottom-6 right-2 md:right-6 bg-white/90 p-2 md:p-3 rounded-full hover:bg-white transition-all shadow-lg ${isMobile ? 'opacity-70' : 'opacity-0 group-hover:opacity-100'} z-20 flex items-center`}
            aria-label="View full screen"
          >
            <ExpandIcon className="w-4 h-4 md:w-5 md:h-5 text-stone-800" />
            <span className="ml-2 text-xs md:text-sm font-serif italic hidden md:inline">View Full</span>
          </button>
        )}
        
        {/* Zoom Level Indicator - Only show when zoomed */}
        {!isWallView && zoomLevel > 1 && (
          <div className="absolute top-14 md:top-20 right-2 md:right-6 bg-white/80 px-2 py-1 rounded-md text-xs md:text-sm text-stone-700 font-mono z-20">
            {Math.round(zoomLevel * 100)}%
          </div>
        )}
        
        {/* Image Counter - Smaller on mobile */}
        <div className={`absolute bottom-2 md:bottom-6 ${isWallView ? 'right-2 md:right-6' : 'left-2 md:left-6'} bg-white/90 px-3 md:px-4 py-1 md:py-2 rounded-full shadow-lg ${isMobile ? 'opacity-70' : 'opacity-0 group-hover:opacity-100'} z-20 flex items-center`}>
          <Eye className="w-3 h-3 md:w-4 md:h-4 text-stone-600 mr-1 md:mr-2" />
          <span className="text-xs md:text-sm font-serif">{allImages.indexOf(selectedImage) + 1} / {allImages.length}</span>
        </div>
        
        {/* Zoom instructions tooltip - only visible when hovering and not zoomed */}
        {!isWallView && !isZoomed && !isMobile && (
          <div className="absolute bottom-2 md:bottom-6 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-80 transition-opacity duration-300">
            Double-click to zoom • Scroll to zoom in/out
          </div>
        )}
      </div>

      {/* Thumbnail Gallery - Horizontally scrollable on mobile */}
      <div className="mt-4 md:mt-8">
        <h3 className="text-xs md:text-sm font-serif italic text-stone-600 mb-2 md:mb-3 ml-1">Gallery View</h3>
        <div className="flex space-x-3 md:space-x-4 overflow-x-auto pb-3 md:pb-4 px-1 scrollbar-thin scrollbar-thumb-stone-400 scrollbar-track-stone-100 snap-x">
          {/* Wall View Thumbnail - MOVED TO FIRST POSITION */}
          <button
            onClick={() => {
              setIsWallView(true);
            }}
            className={`
              relative w-16 h-16 md:w-24 md:h-24 flex-shrink-0
              rounded-md overflow-hidden snap-center
              ${
                isWallView
                  ? "ring-2 ring-amber-500 shadow-lg transform scale-105 z-10"
                  : "opacity-80 hover:opacity-100 shadow-sm"
              }
              transition-all duration-300 border border-stone-200 bg-stone-100
              flex items-center justify-center
            `}
            aria-label="View as wall painting"
          >
            <div className="w-10 h-10 md:w-16 md:h-16 border-4 border-stone-400 flex items-center justify-center">
              <div className="w-6 h-6 md:w-10 md:h-10 bg-stone-300"></div>
            </div>
            {isWallView && (
              <div className="absolute inset-0 border-2 border-white pointer-events-none"></div>
            )}
          </button>
          
          {/* Regular Image Thumbnails */}
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleImageSelect(image)}
              className={`
                relative w-16 h-16 md:w-24 md:h-24 flex-shrink-0
                rounded-md overflow-hidden snap-center
                ${
                  selectedImage === image && !isWallView
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
              {selectedImage === image && !isWallView && (
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
            onWheel={handleWheel}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onDoubleClick={handleDoubleClick}
          >
            <div
              className={`
                relative w-full h-full 
                transition-transform duration-300 
                ${isZoomed ? 'cursor-move' : 'cursor-zoom-in'}
              `}
              style={{
                transform: isZoomed ? `scale(${zoomLevel})` : 'scale(1)',
                transformOrigin: isZoomed ? `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%` : 'center center'
              }}
            >
              <Image
                src={selectedImage}
                alt={title || "Full Screen Image"}
                width={1200}
                height={1200}
                sizes="100vw"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
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
            
            {/* Zoom Controls in Full-Screen */}
            <div className="absolute top-1 md:top-4 left-1 md:left-4 flex items-center space-x-2">
              <button
                onClick={zoomIn}
                disabled={zoomLevel >= 3}
                className={`bg-white/80 p-2 md:p-3 rounded-full hover:bg-white shadow-xl ${zoomLevel >= 3 ? 'opacity-50 cursor-not-allowed' : 'opacity-70 hover:opacity-100'}`}
                aria-label="Zoom in"
              >
                <ZoomIn className="w-5 h-5 md:w-6 md:h-6 text-stone-800" />
              </button>
              
              {zoomLevel > 1 && (
                <button
                  onClick={zoomOut}
                  className="bg-white/80 p-2 md:p-3 rounded-full hover:bg-white transition-all opacity-70 hover:opacity-100 shadow-xl"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-5 h-5 md:w-6 md:h-6 text-stone-800" />
                </button>
              )}
              
              {zoomLevel > 1 && (
                <div className="bg-white/80 px-2 py-1 rounded-md text-sm md:text-base text-stone-700 font-mono">
                  {Math.round(zoomLevel * 100)}%
                </div>
              )}
            </div>
            
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