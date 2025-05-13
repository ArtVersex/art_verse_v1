"use client";

import Link from "next/link";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import { Palette } from "lucide-react";

export default function Brands({ brands }) {
    const [isLoaded, setIsLoaded] = useState(false);
    
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        speed: 800,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3500,
        pauseOnHover: true,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 5, slidesToScroll: 1 } },
            { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 1 } },
            { breakpoint: 768, settings: { slidesToShow: 3, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        ],
        dotsClass: "slick-dots mt-3",
        swipeToSlide: true,
        cssEase: "cubic-bezier(0.7, 0, 0.3, 1)"
    };

    return (
        <div className={`w-full overflow-hidden py-12 px-4 sm:p-12 transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"} relative bg-gradient-to-r from-rose-50 to-amber-50`}>
            {/* Artistic background elements */}
            <div className="absolute top-1/3 right-1/4 w-28 h-28 rounded-full bg-rose-100 blur-3xl opacity-20"></div>
            <div className="absolute bottom-1/4 left-1/4 w-20 h-20 rounded-full bg-amber-100 blur-2xl opacity-20"></div>
            
            <div className="text-center mb-8 relative z-10">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="h-px w-10 bg-gradient-to-r from-transparent to-amber-300"></span>
                    <Palette size={18} className="text-amber-500" />
                    <span className="h-px w-10 bg-gradient-to-l from-transparent to-amber-300"></span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif italic text-gray-800 relative inline-block">
                    Featured Artists
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-rose-200 via-amber-300 to-rose-200"></span>
                </h2>
            </div>
            
            <div className="max-w-screen-xl mx-auto">
                <Slider {...settings}>
                    {brands.map((artist, index) => (
                        <div key={artist.id} className="px-3 py-4">
                            <Link href={`/artists/${artist.id}`}>
                                <div className="flex flex-col items-center gap-4 justify-center group">
                                    {/* Artistic image frame */}
                                    <div className="relative transform transition-transform duration-500 group-hover:rotate-3">
                                        {/* Decorative frame elements */}
                                        <div className="absolute -inset-3 bg-white rounded-full opacity-70"></div>
                                        <div className="absolute -inset-1 bg-gradient-to-br from-amber-100 to-rose-100 rounded-full opacity-90"></div>
                                        
                                        {/* Artist image with artistic border */}
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white shadow-lg relative z-10 flex items-center justify-center">
                                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <img
                                                className="w-full h-full object-cover"
                                                src={artist.imageUrl}
                                                alt={artist.name || 'Artist'}
                                            />
                                        </div>
                                        
                                        {/* Decorative dot elements */}
                                        <div className="absolute top-0 right-0 w-2 h-2 bg-amber-300 rounded-full opacity-80"></div>
                                        <div className="absolute bottom-1 left-1 w-2 h-2 bg-rose-300 rounded-full opacity-80"></div>
                                    </div>
                                    
                                    {/* Artist name with artistic styling */}
                                    <div className="text-center">
                                        <p className="font-serif italic text-sm sm:text-base text-gray-800 relative inline-block">
                                            {artist.name}
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-300 group-hover:w-full transition-all duration-300"></span>
                                        </p>
                                        {artist.specialty && (
                                            <p className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                {artist.specialty}
                                            </p>
                                        )}
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