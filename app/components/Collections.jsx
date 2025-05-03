"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import Slider from "react-slick";
import { useEffect, useState } from "react";

export default function Collections({ collections }) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const updatedProducts = collections.map(product => ({
    ...product,
    timestampUpdate: product.timestampUpdate
      ? `${product.timestampCreate.seconds}.${product.timestampUpdate.nanoseconds}`
      : null,
    timestampCreate: product.timestampCreate
      ? `${product.timestampCreate.seconds}.${product.timestampCreate.nanoseconds}`
      : null,
  }));

  const settings = {
    dots: true,
    infinite: true,
    speed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1, dots: true } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1, dots: true, arrows: false } }
    ],
    autoplay: true,
    autoplaySpeed: 1500,
    pauseOnHover: true,
    arrows: true,
    dotsClass: "slick-dots mt-4",
    swipeToSlide: true,
    fade: false,
    cssEase: "cubic-bezier(0.7, 0, 0.3, 1)"
  };

  // Instead of randomly choosing gradients at render time,
  // use consistent gradients based on array index
  const getGradientByIndex = (index) => {
    const gradients = [
      "from-fuchsia-100 to-cyan-100",
      "from-rose-100 to-teal-100",
      "from-amber-100 to-blue-100",
      "from-emerald-100 to-violet-100",
      "from-fuchsia-100 to-cyan-100"
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="w-full overflow-hidden py-6 px-2 sm:p-12 relative bg-gradient-to-b from-white to-gray-50">
      {/* Artistic background elements */}
      <div className="absolute top-0 left-0 w-16 h-16 rounded-full bg-pink-100 blur-xl opacity-60"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full bg-blue-100 blur-xl opacity-60"></div>
      <div className="absolute top-1/3 right-1/4 w-12 h-12 rounded-full bg-yellow-100 blur-xl opacity-50"></div>
      
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 font-serif italic text-gray-800">
        <span className="relative inline-block">
          Our Collection
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500"></span>
        </span>
      </h2>
      
      <div className={`transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <Slider {...settings}>
          {updatedProducts.map((product, index) => {
            // Use consistent gradient based on index
            const gradient = getGradientByIndex(index);
            return (
              <div key={product.id} className="px-2 py-3">
                <div className={`bg-gradient-to-tr ${gradient} p-4 sm:p-6 rounded-2xl shadow-lg relative overflow-hidden group`}>
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-16 h-16 -mt-8 -mr-8 rounded-full bg-white opacity-10"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 -mb-6 -ml-6 rounded-full bg-white opacity-10"></div>
                  
                  <div className="flex flex-col gap-3 sm:gap-4 relative z-10">
                    {/* Image with artistic border - visible on all screen sizes */}
                    <div className="w-full flex justify-center mb-3">
                      <div className="p-1 bg-white rounded-lg shadow-md transform transition-transform group-hover:scale-102 overflow-hidden">
                        <img
                          className="w-full h-32 sm:h-40 rounded-lg object-cover"
                          src={product.imageUrl}
                          alt={product.title || 'Artistic Collection'}
                          style={{ backdropFilter: "blur(5px)" }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:gap-3 items-start">
                      <h1 className="font-serif italic font-semibold text-base sm:text-lg text-gray-800 line-clamp-2">
                        {product.title}
                      </h1>
                      <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 font-light">
                        {product.subTitle}
                      </p>
                      <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-3 w-full">
                        <Link href={`collections/${product?.id}`} className="flex-1">
                          <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 sm:px-5 py-2 text-xs sm:text-sm rounded-full hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
                            Explore
                          </button>
                        </Link>
                        <button className="flex items-center justify-center min-w-8 w-8 h-8 sm:w-10 sm:h-10 border border-pink-400 text-pink-500 rounded-full hover:bg-pink-400 hover:text-white transition duration-300 transform hover:rotate-12">
                          <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
}