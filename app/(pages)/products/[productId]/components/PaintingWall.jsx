"use client";
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function PaintingWall({ 
  paintingUrl, 
  frameColor = '#5a3e2b', 
  size = 'medium',
  frameStyle = 'classic',
  wallTexture = 'plaster'
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Size classes based on the selected size
  const sizeClasses = {
    small: 'w-64 h-48',
    medium: 'w-80 h-60',
    large: 'w-96 h-72',
    extraLarge: 'w-96 h-72' // Using standard Tailwind classes
  };

  // Frame style configurations
  const frameStyles = {
    classic: {
      outer: "border-8 rounded",
      inner: "border-4",
      inset: "inset-4",
      shadow: "shadow-inner",
      cornerDecoration: false
    },
    ornate: {
      outer: "border-8 rounded-sm", // Changed from border-10 which is not standard
      inner: "border-2",
      inset: "inset-4", // Changed from inset-3 which is not standard
      shadow: "shadow-inner",
      cornerDecoration: true
    },
    modern: {
      outer: "border-4 rounded-none", // Changed from border-6 which is not standard
      inner: "border-0",
      inset: "inset-2",
      shadow: "shadow-md",
      cornerDecoration: false
    },
    floating: {
      outer: "border-4 rounded-xl",
      inner: "border-0",
      inset: "inset-4", // Changed from inset-6 which is not standard
      shadow: "shadow-xl",
      cornerDecoration: false
    }
  };

  // Wall texture backgrounds
  const wallBackgrounds = {
    plaster: "bg-gray-100",
    wood: "bg-amber-50",
    concrete: "bg-stone-300",
    wallpaper: "bg-stone-100"
  };

  // Apply selected styling from configuration objects
  const currentFrameStyle = frameStyles[frameStyle] || frameStyles.classic;
  const currentWallBackground = wallBackgrounds[wallTexture] || wallBackgrounds.plaster;

  // Animation effect when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`relative ${sizeClasses[size] || sizeClasses.medium} mx-auto transition-all duration-700 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Art gallery wall */}
      <div className={`absolute inset-0 ${currentWallBackground} rounded-lg shadow-lg overflow-hidden`}>
        {/* Wall texture overlay */}
        <div className="absolute inset-0 bg-white opacity-5 mix-blend-overlay pointer-events-none"></div>
        
        {/* Wall lighting */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
        
        {/* Picture nail/hanger */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4">
          <div className="absolute w-1 h-6 bg-gray-400 top-2 left-1/2 transform -translate-x-1/2 rounded-b"></div>
          <div className="absolute w-4 h-1.5 bg-gray-600 top-0 rounded-full shadow-sm"></div>
        </div>
        
        {/* Invisible string */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-3 bg-gray-400/30"></div>
        
        {/* Frame */}
        <div 
          className={`absolute ${currentFrameStyle.inset} ${currentFrameStyle.outer} ${currentFrameStyle.shadow} overflow-hidden transition-all duration-500 ease-in-out ${isHovered ? 'scale-105' : 'scale-100'}`}
          style={{ 
            borderColor: frameColor,
            boxShadow: isHovered ? `0 10px 25px rgba(0,0,0,0.2), 0 0 10px rgba(0,0,0,0.1)` : '',
          }}
        >
          {/* Painting */}
          <div className="relative w-full h-full overflow-hidden">
            <Image 
              src={paintingUrl} 
              alt="Artwork display" 
              fill
              className="object-contain transition-transform duration-1000 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              style={{
                transform: isHovered ? 'scale(1.03)' : 'scale(1)',
              }}
            />
            
            {/* Glass reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent opacity-70 pointer-events-none"></div>
          </div>
          
          {/* Inner frame decoration */}
          <div 
            className={`absolute inset-0 ${currentFrameStyle.inner} pointer-events-none`} 
            style={{ borderColor: `${frameColor}30` }}
          />
          
          {/* Corner decorations for ornate frame */}
          {currentFrameStyle.cornerDecoration && (
            <>
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-800/50"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-800/50"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-800/50"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-800/50"></div>
            </>
          )}
        </div>
        
        {/* Frame shadow on wall */}
        <div 
          className={`absolute ${currentFrameStyle.inset} shadow-2xl opacity-60 pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-80' : 'opacity-60'}`} 
          style={{
            filter: 'blur(8px)',
          }}
        />

        {/* Subtle ambient light reflection on wall */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
      </div>
      
      {/* Museum-style name plate (optional) */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-serif text-gray-600 italic shadow-sm opacity-0 transition-opacity duration-500 hover:opacity-100">
        Artwork Display
      </div>
    </div>
  );
}