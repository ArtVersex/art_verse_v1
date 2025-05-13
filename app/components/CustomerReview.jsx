"use client"

import { Heart } from "lucide-react";
import { useState, useEffect } from "react";

export default function CustomerReview() {
  const [activeReview, setActiveReview] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Handle window resize and initial detection of mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Captivating Emotional Depth",
      message: "The artwork I purchased exceeded my expectations. The colors are even more vibrant in person than they appeared online. The brushwork reveals layers of meaning that only become apparent when viewing the piece in different lighting throughout the day. It's now the centerpiece of my living room and sparks conversation with every visitor.",
      rating: 5,
      date: "March 15, 2025",
      image: "https://t4.ftcdn.net/jpg/10/54/09/27/240_F_1054092780_liObYQo10Pn2xOo4CmGYZMeWiw0P7CT2.jpg"
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Masterful Technique & Vision",
      message: "I've been following this artist for years and finally purchased my first piece. The attention to detail is remarkable—each stroke purposeful and deliberate. The composition achieves a perfect tension between chaos and structure, inviting repeated viewing. The shipping was fast and secure, with thoughtful packaging that showed great care for the work.",
      rating: 5,
      date: "March 10, 2025",
      image: "https://t4.ftcdn.net/jpg/10/54/09/27/240_F_1054092780_liObYQo10Pn2xOo4CmGYZMeWiw0P7CT2.jpg"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      title: "Evocative Visual Poetry",
      message: "Beautiful work that captures emotion perfectly. The interplay of light and shadow creates a narrative that unfolds gradually. I find myself discovering new elements each time I engage with the piece. The artist was also very responsive to my questions before purchase, providing context that deepened my appreciation.",
      rating: 4,
      date: "February 28, 2025",
      image: "https://t4.ftcdn.net/jpg/10/54/09/27/240_F_1054092780_liObYQo10Pn2xOo4CmGYZMeWiw0P7CT2.jpg"
    },
    {
      id: 4,
      name: "David Wilson",
      title: "Distinctive Artistic Voice",
      message: "Unique style that stands out from other contemporary artists. The bold use of negative space and unexpected color combinations create a visual language that's immediately recognizable. The piece arrived slightly later than expected, but was well packaged and in perfect condition. Worth the wait for such an impactful addition to my collection.",
      rating: 4,
      date: "February 20, 2025",
      image: "https://t4.ftcdn.net/jpg/10/54/09/27/240_F_1054092780_liObYQo10Pn2xOo4CmGYZMeWiw0P7CT2.jpg"
    }
  ];

  // Calculate the average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  // Function to render hearts based on rating
  const renderHearts = (rating, size = 18) => {
    return Array(5).fill(0).map((_, i) => (
      <Heart 
        key={i}
        size={size} 
        className={`transition-all ${i < Math.round(rating) ? "text-amber-500 fill-amber-500" : "text-gray-200"}`}
      />
    ));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      {/* Artistic header with decorative elements */}
      <div className="mb-12 sm:mb-16 text-center relative">
        <div className="absolute left-0 right-0 top-8 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent opacity-70"></div>
        <div className="absolute left-1/4 -top-2 w-6 h-6 border border-amber-200 rotate-45 opacity-50"></div>
        <div className="absolute right-1/4 -top-2 w-6 h-6 border border-amber-200 rotate-45 opacity-50"></div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-wide mb-4 relative inline-block">
          <span className="text-amber-800 opacity-20 absolute -left-3 -top-3">Collector</span>
          <span className="relative z-10">Collector</span>
          <span className="block text-xl sm:text-2xl md:text-3xl mt-1 font-light tracking-widest text-gray-600">IMPRESSIONS</span>
        </h2>
        
        <p className="text-gray-600 font-light text-sm sm:text-base italic max-w-md mx-auto mt-4">
          Critical perspectives from our distinguished collectors, curated for your consideration
        </p>
      </div>
      
      <div className="relative overflow-hidden">
        {/* Navigation indicators styled as gallery markers */}
        <div className="flex justify-center mb-8">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveReview(index)}
              className={`mx-1 transition-all duration-300 group`}
              aria-label={`View review ${index + 1}`}
            >
              <div className={`w-2 h-8 sm:h-10 ${
                activeReview === index 
                  ? "bg-amber-600" 
                  : "bg-gray-200 group-hover:bg-amber-300"
              }`}></div>
              <div className={`text-xs mt-1 transition-opacity ${
                activeReview === index
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-70"
              }`}>{index + 1}</div>
            </button>
          ))}
        </div>
        
        {/* Main review display with artistic framing */}
        <div className="transition-all duration-700 transform">
          <div className="relative p-8 sm:p-10 border-t border-l border-r border-b-0 border-amber-100 bg-gradient-to-b from-amber-50/40 to-white rounded-t-lg shadow-md">
            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-amber-300 -translate-x-1 -translate-y-1"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-amber-300 translate-x-1 -translate-y-1"></div>
            
            <div className="flex flex-col md:flex-row md:gap-8 items-center md:items-start">
              {/* Reviewer image with artistic frame */}
              <div className="relative mb-6 md:mb-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 p-1 bg-white border border-amber-200 shadow-sm relative z-10">
                  <img 
                    src={reviews[activeReview].image} 
                    alt={reviews[activeReview].name} 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-white rounded-full p-1 shadow border border-amber-100 z-20">
                  <div className="flex">{renderHearts(reviews[activeReview].rating, isMobile ? 14 : 16)}</div>
                </div>
                <div className="absolute -bottom-2 -right-2 -left-2 -top-2 border border-amber-100 -z-10"></div>
              </div>
              
              {/* Review content with typographic styling */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-serif tracking-wide mb-2 text-amber-800">
                  {reviews[activeReview].title}
                </h3>
                <p className="text-gray-700 italic mb-6 leading-relaxed text-sm sm:text-base font-light border-l-4 pl-4 border-amber-100">
                  "{reviews[activeReview].message}"
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <p className="font-medium tracking-wider text-gray-800">{reviews[activeReview].name}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{reviews[activeReview].date}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Artistic border bottom */}
          <div className="h-2 bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 rounded-b-lg shadow-md"></div>
        </div>
        
        {/* Navigation arrows styled */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setActiveReview((activeReview - 1 + reviews.length) % reviews.length)}
            className="text-amber-700 hover:text-amber-500 transition-colors text-sm sm:text-base flex items-center group"
            aria-label="Previous review"
          >
            <span className="w-6 h-px bg-amber-300 transform scale-x-0 group-hover:scale-x-100 origin-right transition-transform mr-2"></span>
            Previous
          </button>
          <button
            onClick={() => setActiveReview((activeReview + 1) % reviews.length)}
            className="text-amber-700 hover:text-amber-500 transition-colors text-sm sm:text-base flex items-center group"
            aria-label="Next review"
          >
            Next
            <span className="w-6 h-px bg-amber-300 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform ml-2"></span>
          </button>
        </div>
      </div>
      
      {/* Gallery statistics with artistic styling */}
      <div className="mt-12 sm:mt-16 text-center">
        <div className="inline-block relative">
          <h3 className="text-base sm:text-lg font-serif tracking-wide mb-3 text-gray-700 relative z-10">
            Collector Satisfaction
          </h3>
          <div className="absolute -bottom-1 left-0 right-0 h-2 bg-amber-100 -z-10"></div>
        </div>
        <div className="flex justify-center mb-2">
          {renderHearts(averageRating, isMobile ? 18 : 24)}
        </div>
        <p className="text-xs sm:text-sm text-gray-500 font-light tracking-wider">
          — {reviews.length} distinguished perspectives —
        </p>
      </div>
    </div>
  );
}