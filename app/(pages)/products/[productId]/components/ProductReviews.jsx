"use client";
import React, { useState } from 'react';

export const ProductReviews = ({ product }) => {
  // State for toggling review visibility
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  // State for artistic insights
  const [showAllInsights, setShowAllInsights] = useState(false);
  // State for active insight
  const [activeInsight, setActiveInsight] = useState(null);

  // Mock critique data - in a real app, this would come from your backend
  const critiques = [
    {
      id: 1,
      name: "Emily R.",
      role: "Art Collector",
      avatar: "/path/to/avatar1.jpg",
      rating: 5,
      date: "2 weeks ago",
      text: "Absolutely stunning piece! The colors are even more vibrant in person. The artist's technique demonstrates exceptional mastery of light and shadow, creating a sense of depth that draws the viewer into the narrative. The juxtaposition of warm and cool tones evokes a contemplative atmosphere that reveals new details with each viewing.",
      verified: true
    },
    {
      id: 2,
      name: "Michael T.",
      role: "Gallery Curator",
      avatar: "/path/to/avatar2.jpg",
      rating: 4,
      date: "1 month ago",
      text: "Great artwork with compelling composition. The balance between abstract elements and representational forms creates an engaging visual dialogue. The brushwork shows confidence and intentionality, while the thematic elements resonate with contemporary discourse on human connection and isolation.",
      verified: true
    }
  ];

  // Artistic insights data from product
  // Check if product has the necessary insights properties
  const artisticInsights = [];
  
  // Add technique highlight if available
  if (product?.techniqueHighlight) {
    artisticInsights.push({
      id: 1,
      type: "Technique Highlight",
      typeClass: "text-amber-700",
      bgClass: "bg-gradient-to-r from-amber-50 to-white border-amber-100",
      iconClass: "text-amber-600",
      text: product.techniqueHighlight
    });
  }
  
  // Add historical context if available
  if (product?.historicalContext) {
    artisticInsights.push({
      id: 2,
      type: "Historical Context",
      typeClass: "text-indigo-700",
      bgClass: "bg-gradient-to-r from-indigo-50 to-white border-indigo-100",
      iconClass: "text-indigo-600",
      text: product.historicalContext
    });
  }
  
  // Add color analysis if available
  if (product?.colorAnalysis) {
    artisticInsights.push({
      id: 3,
      type: "Color Analysis",
      typeClass: "text-emerald-700",
      bgClass: "bg-gradient-to-r from-emerald-50 to-white border-emerald-100",
      iconClass: "text-emerald-600",
      text: product.colorAnalysis
    });
  }
  
  // Add Symbolism if available
  if (product?.Symbolism) {
    artisticInsights.push({
      id: 4,
      type: "Symbolism",
      typeClass: "text-rose-700",
      bgClass: "bg-gradient-to-r from-rose-50 to-white border-rose-100",
      iconClass: "text-rose-600",
      text: product.Symbolism
    });
  }

  // Add Composition Analysis as new insight type
  if (product?.compositionAnalysis) {
    artisticInsights.push({
      id: 5,
      type: "Composition Analysis",
      typeClass: "text-blue-700",
      bgClass: "bg-gradient-to-r from-blue-50 to-white border-blue-100",
      iconClass: "text-blue-600",
      text: product.compositionAnalysis
    });
  }

  // Add Cultural Significance as new insight type
  if (product?.culturalSignificance) {
    artisticInsights.push({
      id: 6,
      type: "Cultural Significance",
      typeClass: "text-purple-700",
      bgClass: "bg-gradient-to-r from-purple-50 to-white border-purple-100",
      iconClass: "text-purple-600",
      text: product.culturalSignificance
    });
  }

  // Fallback to default insights if none are provided in the product
  const defaultInsights = [
    {
      id: 1,
      type: "Technique Highlight",
      typeClass: "text-amber-700",
      bgClass: "bg-gradient-to-r from-amber-50 to-white border-amber-100",
      iconClass: "text-amber-600",
      text: "Notice the impasto technique used in the upper right corner, creating texture that catches the light in different ways depending on viewing angle."
    },
    {
      id: 2,
      type: "Historical Context",
      typeClass: "text-indigo-700",
      bgClass: "bg-gradient-to-r from-indigo-50 to-white border-indigo-100",
      iconClass: "text-indigo-600",
      text: "This piece draws inspiration from the post-impressionist movement while incorporating contemporary symbolic elements."
    },
    {
      id: 3,
      type: "Color Analysis",
      typeClass: "text-emerald-700",
      bgClass: "bg-gradient-to-r from-emerald-50 to-white border-emerald-100",
      iconClass: "text-emerald-600",
      text: "The artist's use of complementary colors creates visual tension while the muted palette invokes a sense of nostalgia."
    },
    {
      id: 4,
      type: "Symbolism",
      typeClass: "text-rose-700",
      bgClass: "bg-gradient-to-r from-rose-50 to-white border-rose-100",
      iconClass: "text-rose-600",
      text: "Recurring motifs throughout the composition suggest themes of transience and the passage of time."
    },
    {
      id: 5,
      type: "Composition Analysis",
      typeClass: "text-blue-700",
      bgClass: "bg-gradient-to-r from-blue-50 to-white border-blue-100",
      iconClass: "text-blue-600",
      text: "The artist employs the golden ratio in the positioning of key elements, creating a harmonious balance that naturally guides the viewer's eye through the work."
    },
    {
      id: 6,
      type: "Cultural Significance",
      typeClass: "text-purple-700",
      bgClass: "bg-gradient-to-r from-purple-50 to-white border-purple-100",
      iconClass: "text-purple-600",
      text: "This artwork addresses contemporary social dialogues about identity and belonging, reflecting broader cultural shifts in how we understand community and connection."
    }
  ];

  // Use product insights if available, otherwise use defaults
  const insightsToUse = artisticInsights.length > 0 ? artisticInsights : defaultInsights;

  // Determine which reviews to show based on toggle state
  const visibleReviews = showAllReviews ? critiques : critiques.slice(0, 1);

  // Determine which insights to show
  const visibleInsights = showAllInsights ? insightsToUse : insightsToUse.slice(0, 3);

  // Function to render artistic rating symbols (paint palette)
  const renderRating = (rating) => {
    const palettes = [];
    for (let i = 0; i < 5; i++) {
      palettes.push(
        <span key={i} className={i < rating ? "text-amber-500" : "text-gray-300"}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 inline" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
            <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
          </svg>
        </span>
      );
    }
    return palettes;
  };

  // Filter buttons for mobile
  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'verified', label: 'Verified Only' },
    { id: 'recent', label: 'Recent' }
  ];

  // Icons for insights
  const insightIcons = {
    "Technique Highlight": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    "Historical Context": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    "Color Analysis": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    "Symbolism": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    "Composition Analysis": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    "Cultural Significance": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  return (
    <section id="critiques" className="mt-12 sm:mt-16 border-t border-gray-200 pt-6 sm:pt-10">
      <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-1 sm:mb-2">Artistic Perspectives</h2>
      <p className="text-gray-600 italic text-sm mb-6 sm:mb-8">Critical analyses and viewer impressions</p>

      {/* Artistic Insights section - Moved to top */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-serif font-medium text-gray-800">Artistic Insights</h3>
          {insightsToUse.length > 3 && (
            <button 
              className="text-xs sm:text-sm text-amber-600 hover:text-amber-700 font-medium"
              onClick={() => setShowAllInsights(!showAllInsights)}
            >
              {showAllInsights ? "Show Less" : "View All"}
            </button>
          )}
        </div>
        
        {/* New insight cards grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleInsights.length > 0 ? (
            visibleInsights.map(insight => (
              <div 
                key={insight.id} 
                className={`${insight.bgClass} p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer`}
                onClick={() => setActiveInsight(activeInsight === insight.id ? null : insight.id)}
              >
                <div className="flex items-center mb-2">
                  <span className={`${insight.iconClass} mr-2`}>
                    {insightIcons[insight.type]}
                  </span>
                  <p className={`text-xs uppercase tracking-wider ${insight.typeClass} font-medium`}>{insight.type}</p>
                </div>
                <p className="text-sm font-serif italic text-gray-700">
                  "{insight.text}"
                </p>
                {activeInsight === insight.id && (
                  <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
                    <p>Tap anywhere on this card to collapse this extended insight.</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500 italic">No artistic insights available for this artwork.</p>
            </div>
          )}
        </div>

        {/* Art detail visualizer - New feature */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <h4 className="font-serif font-medium text-gray-800 mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Artistic Detail Visualizer
          </h4>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-full hover:bg-gray-50 text-gray-700 transition-colors duration-200">
              Brushwork Detail
            </button>
            <button className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-full hover:bg-gray-50 text-gray-700 transition-colors duration-200">
              Color Temperature Map
            </button>
            <button className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-full hover:bg-gray-50 text-gray-700 transition-colors duration-200">
              Composition Lines
            </button>
            <button className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-full hover:bg-gray-50 text-gray-700 transition-colors duration-200">
              Light & Shadow Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Mobile filter tabs */}
      <div className="flex mb-6 overflow-x-auto scrollbar-hide sm:hidden">
        {filterOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setActiveFilter(option.id)}
            className={`whitespace-nowrap px-4 py-2 mr-2 rounded-full text-xs font-medium transition-colors ${
              activeFilter === option.id 
                ? 'bg-amber-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Overall Rating Summary */}
      <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-10 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <p className="text-base sm:text-lg font-medium text-gray-800 mb-2">Critical Reception</p>
            <div className="flex items-center mb-2">
              <div className="mr-2 flex">
                {renderRating(4)}
              </div>
              <p className="text-sm font-medium text-gray-700">4.5/5</p>
              <span className="ml-2 text-xs text-gray-500">(12 perspectives)</span>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <button className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2 px-4 sm:px-6 rounded-full font-medium text-sm hover:from-amber-600 hover:to-amber-700 shadow-sm hover:shadow transition-all duration-300">
              Share Your Interpretation
            </button>
          </div>
        </div>
      </div>

      {/* Critiques List */}
      <div className="space-y-4 sm:space-y-8">
        {visibleReviews.map((critique) => (
          <div key={critique.id} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
            <div className="flex items-start">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full overflow-hidden mr-3 sm:mr-4 flex-shrink-0">
                {critique.avatar ? (
                  <img src={critique.avatar} alt={critique.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    {critique.name.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base">{critique.name}</h4>
                    <p className="text-xs text-gray-500 italic">{critique.role}</p>
                  </div>
                  <div className="mt-1 sm:mt-0 flex items-center">
                    <div className="flex mr-2">
                      {renderRating(critique.rating)}
                    </div>
                    <span className="text-xs text-gray-500">{critique.date}</span>
                  </div>
                </div>
                
                <div className="prose prose-sm max-w-none text-gray-700">
                  <p className="italic font-serif text-sm leading-relaxed">{critique.text}</p>
                </div>
                
                {critique.verified && (
                  <div className="mt-3 sm:mt-4 flex items-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      <svg className="mr-1 h-2 w-2 text-emerald-400" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                      Verified Viewing
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show more/less perspectives button - Now visible on all screen sizes */}
      {critiques.length > 1 && (
        <div className="flex justify-center mt-6">
          <button 
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="flex items-center justify-center text-amber-600 font-medium text-sm sm:text-base border border-amber-200 rounded-full px-4 py-2 sm:px-6 sm:py-2.5 hover:bg-amber-50 transition-colors duration-300"
          >
            {showAllReviews ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Show Less
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                View All {critiques.length} Perspectives
              </>
            )}
          </button>
        </div>
      )}

      {/* Empty state */}
      {critiques.length === 0 && (
        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <p className="font-serif text-gray-600 italic">This artwork awaits its first critical perspective.</p>
          <p className="text-gray-500 text-sm mt-2">Share your interpretation and be the first to contribute to the artistic dialogue.</p>
        </div>
      )}
    </section>
  );
};