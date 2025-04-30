"use client";

import { Heart, ShoppingCart, CreditCard, Star } from "lucide-react";
import Link from "next/link";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import FavoriteButton from "./FavoriteButton";
import AuthContextProvider from "@/contexts/AuthContext";
import AddToCartButton from "./AddToCartButton";

export default function FeaturedProductSlider({ featuredProducts }) {
    const [isLoaded, setIsLoaded] = useState(false);
    
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Convert complex fields into plain values
    const updatedProducts = featuredProducts.map(product => ({
        ...product,
        // Convert timestamps to readable strings
        timestampUpdate: product.timestampUpdate
            ? `${product.timestampUpdate.seconds}.${product.timestampUpdate.nanoseconds}`
            : null,
        timestampcreate: product.timestampcreate
            ? `${product.timestampcreate.seconds}.${product.timestampcreate.nanoseconds}`
            : null,
    }));

    const settings = {
        dots: true,
        infinite: true,
        speed: 1500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        arrows: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    dots: true
                }
            }
        ],
        dotsClass: "slick-dots mt-3",
        swipeToSlide: true,
        cssEase: "cubic-bezier(0.7, 0, 0.3, 1)",
        fade: true
    };

    return (
        <div className={`w-full overflow-hidden transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"} relative bg-gradient-to-b from-white to-blue-50`}>
            {/* Artistic background elements */}
            <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-blue-100 blur-2xl opacity-30"></div>
            <div className="absolute bottom-1/4 right-1/6 w-24 h-24 rounded-full bg-purple-100 blur-2xl opacity-20"></div>
            <div className="absolute top-1/3 left-1/6 w-16 h-16 rounded-full bg-pink-100 blur-xl opacity-20"></div>
            
            <Slider {...settings}>
                {updatedProducts.map((product) => (
                    <div key={product.id}>
                        <div className="px-4 py-8 md:p-16 rounded-lg relative">
                            {/* Decorative elements */}
                            <div className="absolute top-1/2 left-1/2 w-4/5 h-4/5 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-tr from-blue-50 to-purple-50 rounded-full blur-3xl opacity-40"></div>
                            
                            <div className="flex flex-col md:flex-row md:gap-12 items-center relative z-10">
                                {/* Content Section */}
                                <div className="flex-1 flex flex-col gap-4 md:gap-6 text-center md:text-left mb-8 md:mb-0">
                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        <span className="text-xs sm:text-sm text-gray-500 font-serif italic tracking-wider">
                                            Featured Artwork
                                        </span>
                                    </div>
                                    
                                    <Link href={`/products/${product?.id}`}>
                                        <h1 className="font-serif font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-800 leading-tight hover:text-blue-700 transition-colors duration-300">
                                            {product.title}
                                        </h1>
                                    </Link>

                                    <p className="text-gray-600 text-xs sm:text-sm md:text-base md:max-w-lg line-clamp-2 sm:line-clamp-3 mx-auto md:mx-0 font-light">
                                        {product.shortDescription}
                                    </p>

                                    {/* Price row - with artistic styling */}
                                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 my-2">
                                        {product.price && (
                                            <span className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 relative">
                                                <span className="absolute -top-3 -left-2 text-xs text-gray-400">Price</span>
                                                ${product.price}
                                            </span>
                                        )}
                                        {product.originalPrice && (
                                            <span className="text-sm text-gray-400 line-through">
                                                ${product.originalPrice}
                                            </span>
                                        )}
                                        {product.discount && (
                                            <span className="ml-2 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs rounded-full">
                                                {product.discount}% OFF
                                            </span>
                                        )}
                                    </div>

                                    {/* Button container with artistic styling */}
                                    <div className="flex flex-wrap gap-3 sm:gap-4 justify-center items-center md:justify-start mt-3">
                                        <Link href={`/checkout?type=buynow&productId=${product?.id}`}>
                                            <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 sm:px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2 text-xs sm:text-sm">
                                                <CreditCard className="w-4 h-4" />
                                                Acquire
                                            </button>
                                        </Link>
                                        
                                        <div className="transform transition-transform hover:scale-105">
                                            <AuthContextProvider>
                                                <AddToCartButton 
                                                    productId={product?.id} 
                                                    variant="quick" 
                                                    stock={product?.stock}
                                                    disabled={product?.stock <= 0}
                                                    className="border border-blue-400 bg-white text-blue-500 hover:bg-blue-50"
                                                />
                                            </AuthContextProvider>
                                        </div>

                                        <div className="transform transition-transform hover:rotate-12">
                                            <AuthContextProvider>
                                                <FavoriteButton productId={product?.id} />
                                            </AuthContextProvider>
                                        </div>
                                    </div>
                                </div>

                                {/* Image Section - with artistic frame */}
                                <Link href={`/products/${product?.id}`}>
                                    <div className="flex-shrink-0 w-full flex justify-center md:w-auto group perspective">
                                        <div className="relative transform transition-all duration-500 group-hover:rotate-y-6 group-hover:scale-105">
                                            {/* Decorative frame */}
                                            <div className="absolute inset-0 border-2 border-blue-100 rounded-2xl -m-3 md:-m-6"></div>
                                            <div className="p-2 bg-white bg-opacity-80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
                                                <img
                                                    className="h-48 sm:h-64 md:h-80 object-contain filter drop-shadow-md"
                                                    src={product.featureImageUrl}
                                                    alt={product.title || 'Product Image'}
                                                />
                                            </div>
                                            {/* Subtle reflection */}
                                            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white to-transparent opacity-30"></div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}