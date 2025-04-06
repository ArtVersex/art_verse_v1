// components/ProductPricing.jsx
import React from 'react';

export const ProductPricing = ({ product }) => {
  const discountPercentage = product?.salePrice && product?.price
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-baseline">
        {product?.salePrice ? (
          <>
            <span className="text-4xl font-bold text-gray-900">${product.salePrice}</span>
            <span className="text-xl text-gray-500 line-through ml-3">${product.price}</span>
            <span className="ml-3 px-2 py-1 text-sm font-semibold text-red-600 bg-red-50 rounded">
              Save {discountPercentage}%
            </span>
          </>
        ) : (
          <span className="text-4xl font-bold text-gray-900">${product?.price}</span>
        )}
      </div>

      {/* <p className="text-gray-600 text-sm">
        Pay in 4 interest-free installments of ${Math.round((product?.salePrice || product?.price) / 4)} with Afterpay
      </p> */}

      <div className="flex items-center mt-4">
        <div className={`w-3 h-3 rounded-full ${product?.stock > 0 ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
        <span className={`text-sm font-medium ${product?.stock <= 3 && product?.stock > 0 ? 'text-orange-600' : ''}`}>
          {product?.stock > 0
              ? `Available: Customize your own design`
            : "Sold Out: Contact us to request a custom design"}
        </span>
      </div>
    </div>
  );
};
