// components/ProductHeader.jsx
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { getcategory } from '@/lib/firestore/categories/read_server';
import { getBrands } from '@/lib/firestore/brands/read_server';
import Link from 'next/link';

export const ProductHeader = ({ product }) => {
  const listedTime = product?.timestampcreate
    ? formatDistanceToNow(new Date(product.timestampcreate.toDate()), { addSuffix: true })
    : "";

  return (
    <div className="space-y-4 border-b border-gray-200 pb-6">
      <div className="flex flex-wrap items-center gap-2">
        {product?.categoryID && (
          <span className="animate-fade-in">
            <Category categoryId={product.categoryID} />
          </span>
        )}

        {product?.brandID && (
          <span className="animate-fade-in">
            <Brand brandId={product.brandID} />
          </span>
        )}

        {product?.isFeatured && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            Awarded
          </span>
        )}
      </div>

      {/* <div className="space-y-2">

      {product?.shortDescription || " "}

        </div>
 */}

      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight leading-tight">
          {product?.title || "Product Title"}
        </h1>

        <div className="flex flex-col gap-2">
          {/* <p className="text-sm text-gray-500">
            Listed {listedTime}
          </p> */}

          {product?.shortDescription && (
            <p className="text-base text-gray-700 leading-relaxed max-w-2xl">
              {product.shortDescription}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

async function Category({ categoryId }) {
  const category = await getcategory({ id: categoryId });

  if (!category) return null;

  return (
    <Link href={`/categories/${category.id}`} className="hover:opacity-80 transition-opacity">
      <div className="flex gap-1 items-center border border-gray-200 px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors">
        {category.imageUrl && (
          <img
            className="h-4 w-4 object-contain"
            src={category.imageUrl}
            alt={category.name || "Category"}
          />
        )}
        <h4 className="text-xs font-semibold text-blue-800">{category.name}</h4>
      </div>
    </Link>
  );
}

async function Brand({ brandId }) {
  const brand = await getBrands({ id: brandId });

  if (!brand) return null;

  return (
    <Link href={`/brands/${brand.id}`} className="hover:opacity-80 transition-opacity">
      <div className="flex gap-1 items-center border border-gray-200 px-3 py-1 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
        {brand.imageUrl && (
          <img
            className="h-4 w-4 object-contain"
            src={brand.imageUrl}
            alt={brand.name || "Brand"}
          />
        )}
        <h4 className="text-xs font-semibold text-gray-800">{brand.name}</h4>
      </div>
    </Link>
  );
}