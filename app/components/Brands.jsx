"use client";

import Link from "next/link";
import Slider from "react-slick";

export default function Brands({ brands }) {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 5, slidesToScroll: 1 } },
            { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 1 } },
            { breakpoint: 768, settings: { slidesToShow: 3, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 3, slidesToScroll: 1 } },
        ],
        dotsClass: "slick-dots mt-3",
        swipeToSlide: true
    };

    return (
        <div className="w-full overflow-hidden py-6 px-4 sm:p-6 md:p-8 bg-[#f8f8f8]">
            <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">View By Artists</h2>
            </div>
            
            <Slider {...settings}>
                {brands.map((category) => (
                    <div key={category.id} className="px-2 py-2">
                        <Link href={'/c'}>
                            <div className="flex flex-col items-center gap-2 sm:gap-3 justify-center">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center bg-white">
                                    <img
                                        className="w-full h-full object-contain p-2"
                                        src={category.imageUrl}
                                        alt={category.name || 'Category'}
                                    />
                                </div>
                                <p className="font-medium text-xs sm:text-sm text-gray-700 text-center line-clamp-2">
                                    {category.name}
                                </p>
                            </div>
                        </Link>
                    </div>
                ))}
            </Slider>
        </div>
    );
}