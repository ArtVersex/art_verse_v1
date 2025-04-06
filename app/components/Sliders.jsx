"use client";

import { Heart, ShoppingCart, CreditCard } from "lucide-react";
import Link from "next/link";
import Slider from "react-slick";
import FavoriteButton from "./FavoriteButton";
import AuthContextProvider from "@/contexts/AuthContext";
import AddToCartButton from "./AddToCartButton";

export default function FeaturedProductSlider({ featuredProducts }) {
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
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
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


    };

    return (
        <div className="w-full overflow-hidden bg-[#f8f8f8]">
            <Slider {...settings}>
                {updatedProducts.map((product) => (
                    <div key={product.id}>
                        <div className="px-4 py-6 md:p-12 rounded-lg">
                            <div className="flex flex-col md:flex-row md:gap-8 items-center">
                                {/* Content Section */}
                                <div className="flex-1 flex flex-col gap-3 md:gap-5 text-center md:text-left mb-6 md:mb-0">
                                    <span className="text-xs sm:text-sm text-gray-400 font-medium tracking-wider">
                                        Awarded
                                    </span>
                                    <Link href={`/products/${product?.id}`}>

                                        <h1 className="font-semibold text-2xl sm:text-3xl md:text-4xl text-gray-700 leading-tight">
                                            {product.title}
                                        </h1>
                                    </Link>

                                    <p className="text-gray-600 text-xs sm:text-sm md:max-w-lg line-clamp-2 sm:line-clamp-3 mx-auto md:mx-0">
                                        {product.shortDescription}
                                    </p>

                                    {/* Price row - mobile friendly */}
                                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 my-2">
                                        {product.price && (
                                            <span className="text-lg sm:text-xl font-bold text-blue-600">
                                                ${product.price}
                                            </span>
                                        )}
                                        {product.originalPrice && (
                                            <span className="text-sm text-gray-500 line-through">
                                                ${product.originalPrice}
                                            </span>
                                        )}
                                        {product.discount && (
                                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                                {product.discount}% OFF
                                            </span>
                                        )}
                                    </div>

                                    {/* Button container */}
                                    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center items-center md:justify-start mt-2">
                                        <Link href={`/checkout?type=buynow&productId=${product?.id}`}>
                                        
                                        <button className="bg-blue-500 text-white px-3 sm:px-5 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                                            <CreditCard className="w-4 h-4" />
                                            Buy Now
                                        </button>
                                        </Link>
                                        {/* <button className="bg-white border border-blue-500 text-blue-500 px-3 sm:px-5 py-2 rounded-lg hover:bg-blue-100 transition flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                                            <ShoppingCart className="w-4 h-4" />
                                            Add to Cart
                                        </button> */}
                                        <div>
                                            <AuthContextProvider>

                                                                      <AddToCartButton 
                                                                        productId={product?.id} 
                                                                        variant="quick" 
                                                                        stock={product?.stock}
                                                                        disabled={product?.stock <= 0}
                                                                      />
                                                
                                            </AuthContextProvider>

                                        </div>
                                        {/* <button className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 border border-pink-500 text-pink-500 rounded-full hover:bg-pink-500 hover:text-white transition-all">
                                            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button> */}

                                        <AuthContextProvider>

                                            <FavoriteButton productId={product?.id} />
                                        </AuthContextProvider>
                                    </div>
                                </div>

                                {/* Image Section */}

                                <Link href={`/products/${product?.id}`}>

                                    <div className="flex-shrink-0 w-full flex justify-center md:w-auto">
                                        <img
                                            className="h-48 sm:h-64 md:h-80 object-contain"
                                            src={product.featureImageUrl}
                                            alt={product.title || 'Product Image'}
                                        />
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