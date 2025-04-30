"use client";
import React from "react";
import {
  Award,
  Package,
  Truck,
  RefreshCw,
} from "lucide-react";

export const TrustBadges = () => {
  const trustBadges = [
    {
      icon: Award,
      title: "Certificate of Authenticity",
      description: "Verified original artwork",
    },
    {
      icon: Package,
      title: "Carefully Packaged",
      description: "Secure professional packaging",
    },
    {
      icon: Truck,
      title: "Free Worldwide Shipping",
      description: "Complimentary art delivery",
    },
    {
      icon: RefreshCw,
      title: "30-Day Returns",
      description: "Hassle-free return policy",
    },
  ];

  return (
    <div className="mt-8 md:mt-10 mb-8 md:mb-12 px-4 md:px-0">
      {/* Artistic heading with decorative elements */}
      <div className="flex items-center justify-center mb-6 md:mb-8">
        <div className="h-px w-8 md:w-16 bg-gradient-to-r from-transparent to-red-400"></div>
        <h3 className="text-xl md:text-2xl font-serif mx-3 md:mx-4 text-gray-800 italic">Our Promise</h3>
        <div className="h-px w-8 md:w-16 bg-gradient-to-l from-transparent to-red-400"></div>
      </div>

      {/* Trust badges in an artistic container */}
      <div className="bg-gradient-to-br from-stone-50 to-amber-50 rounded-lg p-4 md:p-6 border border-amber-100 shadow-md relative overflow-hidden">
        {/* Decorative corner elements - hidden on smallest screens */}
        <div className="hidden sm:block absolute top-0 left-0 w-16 md:w-20 h-16 md:h-20 border-t-2 border-l-2 border-red-300 rounded-tl-lg"></div>
        <div className="hidden sm:block absolute bottom-0 right-0 w-16 md:w-20 h-16 md:h-20 border-b-2 border-r-2 border-red-300 rounded-br-lg"></div>
        
        {/* Header with gold accents */}
        <div className="text-center mb-6 md:mb-8 relative">
          <h4 className="text-lg md:text-xl font-serif font-medium text-amber-800 flex items-center justify-center">
            <span className="inline-block w-6 md:w-8 h-1 bg-amber-400 mr-2 md:mr-3"></span>
            Purchase Guarantee
            <span className="inline-block w-6 md:w-8 h-1 bg-amber-400 ml-2 md:ml-3"></span>
          </h4>
          <div className="mt-2 text-amber-700 text-xs md:text-sm font-light italic">Every purchase is backed by our dedication to artistic excellence</div>
        </div>
        
        {/* Trust badges grid with more artistic styling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5">
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center p-3 md:p-4 bg-white bg-opacity-70 hover:bg-opacity-90 transition-all duration-300 rounded-lg shadow-sm hover:shadow border border-amber-100 group"
            >
              <div className="mr-3 md:mr-4 bg-gradient-to-br from-amber-50 to-amber-100 p-2 md:p-3 rounded-full shadow-inner border border-amber-200 group-hover:from-amber-100 group-hover:to-amber-200 transition-all duration-300">
                <badge.icon className="w-5 h-5 md:w-6 md:h-6 text-amber-700" />
              </div>
              <div>
                <p className="font-serif text-xs md:text-sm font-medium text-amber-900 group-hover:text-red-700 transition-colors duration-300">
                  {badge.title}
                </p>
                <p className="text-xs text-amber-700 font-light mt-0.5 md:mt-1">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Decorative bottom signature */}
        <div className="mt-6 md:mt-8 flex justify-center">
          <div className="font-serif text-amber-800 italic text-xs md:text-sm opacity-80">
            — Curated with artistry —
          </div>
        </div>
      </div>
    </div>
  );
};