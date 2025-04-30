"use client"
import React, { useState, useRef, useEffect } from 'react';

export const ShareButton = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle native sharing if available
  const handleShare = () => {
    // Check if the Web Share API is available
    if (navigator.share) {
      navigator.share({
        title: product?.title || 'Check out this artwork',
        text: product?.shortDescription || 'Take a look at this beautiful piece!',
        url: window.location.href
      })
      .catch(error => console.log('Error sharing:', error));
    } else {
      // Open dropdown if native sharing isn't available
      setIsOpen(!isOpen);
    }
  };

  // Share to specific platforms
  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const shareToTwitter = () => {
    const text = `Discovered "${product?.title || 'this artwork'}" - a stunning piece!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const shareToWhatsApp = () => {
    const text = `I found this amazing artwork: "${product?.title || 'Take a look'}": ${window.location.href}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsOpen(false);
    // You could add a toast notification here
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={handleShare}
        className="w-full py-3 px-4 flex items-center justify-center rounded-md border border-amber-200 text-amber-800 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 transition-all duration-300 group font-serif"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600 group-hover:text-amber-800 transition-colors duration-300" viewBox="0 0 20 20" fill="currentColor">
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
        </svg>
        <span className="group-hover:tracking-wider transition-all duration-300">Share this Artwork</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-amber-100 overflow-hidden">
          {/* Decorative top border */}
          <div className="h-1 w-full bg-gradient-to-r from-amber-200 via-red-300 to-amber-200"></div>
          
          <button onClick={shareToFacebook} className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-amber-50 transition-colors duration-200">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-3 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="font-serif">Facebook</span>
            </div>
          </button>
          <button onClick={shareToTwitter} className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-amber-50 transition-colors duration-200">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-3 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/>
              </svg>
              <span className="font-serif">Twitter</span>
            </div>
          </button>
          <button onClick={shareToWhatsApp} className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-amber-50 transition-colors duration-200">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-3 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="font-serif">WhatsApp</span>
            </div>
          </button>
          <button onClick={copyLink} className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-amber-50 transition-colors duration-200">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-3 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              <span className="font-serif">Copy Link</span>
            </div>
          </button>
          
          {/* Decorative bottom border */}
          <div className="h-1 w-full bg-gradient-to-r from-amber-200 via-red-300 to-amber-200 mt-1"></div>
        </div>
      )}
    </div>
  );
};