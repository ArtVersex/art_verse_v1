"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import Slider from "react-slick";

export default function Collections({ collections }) {
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
            { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
        autoplay: true,
        autoplaySpeed: 1000,
        pauseOnHover: true,
        arrows: true,
        dotsClass: "slick-dots mt-4",
        swipeToSlide: true,
    };

    return (
        <div className="w-full overflow-hidden py-4 px-2 sm:p-6 md:p-8 bg-[#f8f8f8]">
            <Slider {...settings}>
                {updatedProducts.map((product) => (
                    <div key={product.id} className="px-2 sm:px-3 md:px-4 pb-2">
                        <div className="bg-gradient-to-tr to-[#d9e2f1] from-[#cce7f5] p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
                            <div className="flex flex-col gap-4">
                                {/* Image on top for mobile, with full display */}
                                <div className="w-full md:hidden flex justify-center mb-2">
                                    <img
                                        className="w-full h-auto max-h-48 rounded-lg object-contain"
                                        src={product.imageUrl}
                                        alt={product.title || 'Product Image'}
                                    />
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center">
                                    <div className="flex-1 flex flex-col gap-3">
                                        <h1 className="font-semibold text-base sm:text-lg text-gray-800 line-clamp-2">
                                            {product.title}
                                        </h1>
                                        <p className="text-gray-600 text-xs sm:text-sm line-clamp-3">
                                            {product.subTitle}
                                        </p>
                                        <div className="flex gap-3 mt-1">

                                            <Link href={`collections/${product?.id}`}>
                                                <button className="bg-blue-500 text-white px-3 sm:px-5 py-1.5 sm:py-2 text-sm rounded-lg hover:bg-blue-600 transition">
                                                    View Now
                                                </button>

                                            </Link>
                                            <button className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 border border-pink-500 text-pink-500 rounded-full hover:bg-pink-500 hover:text-white transition">
                                                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Image on the right for tablet/desktop */}
                                    <div className="hidden md:block flex-shrink-0">
                                        <img
                                            className="h-36 w-36 rounded-lg object-cover"
                                            src={product.imageUrl}
                                            alt={product.title || 'Product Image'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}