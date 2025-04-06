"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ImageIcon, ExpandIcon, ChevronLeft, ChevronRight, XIcon } from "lucide-react";

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

  // Handle image selection
  const handleImageSelect = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // Navigate to previous image
  const handlePrevImage = () => {
    const currentIndex = allImages.indexOf(selectedImage);
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setSelectedImage(allImages[prevIndex]);
  };

  // Navigate to next image
  const handleNextImage = () => {
    const currentIndex = allImages.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % allImages.length;
    setSelectedImage(allImages[nextIndex]);
  };

  // Toggle full-screen view
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  if (allImages.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-64 bg-gray-100 rounded-lg">
        <ImageIcon className="w-16 h-16 text-gray-400" />
        <p className="ml-4 text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Featured/Selected Image Section */}
      <div className="relative w-full aspect-square group">
        <Image
          src={selectedImage}
          alt={title || "Product Image"}
          fill
          priority
          className="object-cover rounded-lg shadow-md cursor-pointer group-hover:scale-105 transition-transform"
          onClick={toggleFullScreen}
          onDoubleClick={() => isFullScreen && toggleFullScreen()} // Double-click to exit
        />
        {/* Navigation Buttons */}
        <button
          onClick={handlePrevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <button
          onClick={handleNextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-all"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
        {/* Full-Screen Toggle Button */}
        <button
          onClick={toggleFullScreen}
          className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white transition-all"
        >
          <ExpandIcon className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Thumbnail Gallery */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {allImages.map((image, index) => (
          <button
            key={index}
            onClick={() => handleImageSelect(image)}
            className={`
              relative w-20 h-20 flex-shrink-0
              rounded-lg overflow-hidden shadow-sm
              ${
                selectedImage === image
                  ? "ring-2 ring-blue-500"
                  : "hover:opacity-75"
              }
              transition-all
            `}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              fill
              loading="lazy"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Full Screen Overlay */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          {/* Full-Screen Image */}
          <div className="relative max-w-full max-h-full">
            <Image
              src={selectedImage}
              alt={title || "Full Screen Image"}
              width={1200}
              height={1200}
              className="max-w-full max-h-full object-contain"
              onDoubleClick={toggleFullScreen} // Double-click to exit
            />
            {/* Navigation Buttons in Full-Screen */}
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white transition-all"
            >
              <ChevronLeft className="w-8 h-8 text-gray-700" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white transition-all"
            >
              <ChevronRight className="w-8 h-8 text-gray-700" />
            </button>
            {/* Close Button */}
            <button
              onClick={toggleFullScreen}
              className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white"
            >
              <XIcon className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};