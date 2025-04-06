// components/ProductReviews.js
import React from 'react';

export const ProductReviews = ({ product }) => {
  // Mock review data - in a real app, this would come from your backend
  const reviews = [
    {
      id: 1,
      name: "Emily R.",
      rating: 5,
      date: "2 weeks ago",
      text: "Absolutely stunning piece! The colors are even more vibrant in person. Exceeded my expectations.",
      verified: true
    },
    {
      id: 2,
      name: "Michael T.",
      rating: 4,
      date: "1 month ago",
      text: "Great artwork, shipped quickly and arrived in perfect condition. Highly recommend.",
      verified: true
    }
  ];

  return (
    <section id="reviews" className="mt-16 border-t border-gray-200 pt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

      {/* Overall Rating Summary */}
      <div className="flex items-center mb-8">
        <div className="flex items-center mr-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-5 h-5 ${star <= 4 ? 'text-red-500' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-lg font-medium text-gray-900">4.0 out of 5 stars</p>
        <span className="ml-3 text-sm text-gray-500">(12 reviews)</span>
      </div>

      {/* Review Form Placeholder */}
      <div className="mb-10 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Share Your Experience</h3>
        <p className="text-gray-600 mb-4">If you've purchased this artwork, please take a moment to share your thoughts.</p>
        <button className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
          Write a Review
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6">
            <div className="flex items-center mb-2">
              <div className="flex items-center mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${star <= review.rating ? 'text-red-500' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm font-medium">{review.name}</p>
              <span className="ml-2 text-xs text-gray-500">{review.date}</span>
              {review.verified && (
                <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                  Verified Purchase
                </span>
              )}
            </div>
            <p className="text-gray-700">{review.text}</p>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No reviews yet for this specific artwork. Be the first to share your experience!</p>
        </div>
      )}
    </section>
  );
};