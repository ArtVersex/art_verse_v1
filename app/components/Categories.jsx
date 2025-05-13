"use client";

import Link from "next/link";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import { Paintbrush } from "lucide-react";

export default function Categories({ categories }) {
    const [isLoaded, setIsLoaded] = useState(false);
    
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        speed: 800,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 5, slidesToScroll: 1 } },
            { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 1 } },
            { breakpoint: 768, settings: { slidesToShow: 3, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 1, centerMode: true, centerPadding: '30px' } },
        ],
        dotsClass: "slick-dots mt-3",
        swipeToSlide: true,
        cssEase: "cubic-bezier(0.7, 0, 0.3, 1)"
    };

    return (
        <div className={`w-full overflow-hidden py-8 px-3 sm:p-12 transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"} relative bg-gradient-to-r from-blue-50 to-indigo-50`}>
            {/* Artistic background elements */}
            <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-purple-100 blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 right-1/3 w-24 h-24 rounded-full bg-blue-100 blur-2xl opacity-20"></div>
            
            <div className="text-center mb-6 sm:mb-8 relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="h-px w-4 sm:w-8 bg-gradient-to-r from-transparent to-indigo-300"></span>
                    <Paintbrush size={14} className="text-indigo-400" />
                    <span className="h-px w-4 sm:w-8 bg-gradient-to-l from-transparent to-indigo-300"></span>
                </div>
                <h2 className="text-lg sm:text-2xl font-serif italic text-gray-800 relative inline-block">
                    Explore by Category
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-200"></span>
                </h2>
            </div>
            
            <div className="max-w-screen-xl mx-auto px-1 sm:px-0">
                <Slider {...settings}>
                    {categories.map((category, index) => (
                        <div key={category.id} className="px-1 sm:px-2 py-2 sm:py-3">
                            <Link href={`/categories/${category.id}`}>
                                <div className="flex flex-col items-center gap-2 sm:gap-4 justify-center group transform transition-transform duration-300 hover:translate-y-1">
                                    {/* Artistic image container */}
                                    <div className="relative">
                                        {/* Background decorative circles */}
                                        <div className="absolute -inset-1 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-80 blur-sm group-hover:blur-md transition-all duration-300"></div>
                                        
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden shadow-md flex items-center justify-center bg-white relative z-10 border border-white group-hover:shadow-lg transition-all duration-300">
                                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <img
                                                className="w-full h-full object-contain p-2 sm:p-3 relative z-10 transition-transform duration-300 group-hover:scale-110"
                                                src={category.imageUrl}
                                                alt={category.name || 'Artistic Category'}
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Category name with artistic underline */}
                                    <div className="relative">
                                        <p className="font-medium text-xs text-gray-700 text-center line-clamp-1 group-hover:text-indigo-700 transition-colors duration-300">
                                            {category.name}
                                        </p>
                                        <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-indigo-300 transform -translate-x-1/2 group-hover:w-full transition-all duration-300"></span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}