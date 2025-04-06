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
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-md">
      <h3 className="text-xl font-bold text-blue-800 mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Purchase Guarantee
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {trustBadges.map((badge, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-3 bg-white bg-opacity-60 hover:bg-opacity-90 transition rounded-lg shadow-sm hover:shadow"
          >
            <div className="bg-blue-100 p-2 rounded-full shadow">
              <badge.icon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {badge.title}
              </p>
              <p className="text-xs text-gray-600">{badge.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};