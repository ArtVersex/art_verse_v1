// components/Breadcrumb.jsx
import React from 'react';

export const Breadcrumb = ({ productTitle }) => (
  <nav className="mb-8 text-sm text-gray-500">
    <ol className="flex items-center space-x-2">
      <li><a href="/" className="hover:text-gray-900 transition-colors">Home</a></li>
      <li><span>/</span></li>
      <li><a href="/" className="hover:text-gray-900 transition-colors">Gallery</a></li>
      <li><span>/</span></li>
      <li className="text-gray-900 font-medium">{productTitle}</li>
    </ol>
  </nav>
);
