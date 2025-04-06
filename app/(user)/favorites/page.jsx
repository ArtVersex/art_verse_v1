"use client";
import { useState, useEffect } from "react";
import ProductsGridView from "@/app/components/Products";
import { useAuth } from "@/contexts/AuthContext";
import { getProduct } from "@/lib/firestore/products/read";
import { useUser } from "@/lib/firestore/user/read";
import Link from "next/link";

export default function Page() {
    const { user } = useAuth();
    const { user: userData, isLoading, error } = useUser(user?.uid);
    const [likedProducts, setLikedProducts] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(true);
    
    useEffect(() => {
        const fetchLikedProducts = async () => {
            try {
                if (userData?.favorites && userData.favorites.length > 0) {
                    console.log("Found favorites:", userData.favorites);
                    
                    // Fetch individual products by their IDs
                    const productPromises = userData.favorites.map((productId) => {
                        console.log("Fetching product:", productId);
                        return getProduct(productId);
                    });
                    
                    const fetchedProducts = await Promise.all(productPromises);
                    console.log("Fetched products:", fetchedProducts);
                    
                    // Filter valid products
                    const validProducts = fetchedProducts.filter((product) => product);
                    console.log("Valid products:", validProducts);
                    setLikedProducts(validProducts);
                } else {
                    console.log("No favorites found in user data");
                }
            } catch (err) {
                console.error("Error fetching favorite products:", err);
            } finally {
                setLoadingFavorites(false);
            }
        };
        
        if (userData?.favorites) {
            fetchLikedProducts();
        } else {
            setLoadingFavorites(false); // No favorites exist
        }
    }, [userData]);
    
    if (isLoading || loadingFavorites) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                <p className="mt-4 text-lg text-gray-600">Loading your favorites...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
                    <p>Error fetching favorites. Please try again later.</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 py-15">
            <h1 className="text-3xl font-bold mb-6">Favorites</h1>
            
            {(!likedProducts || likedProducts.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50 rounded-lg">
                    <svg 
                        className="w-16 h-16 text-gray-400 mb-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                    <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
                    <p className="text-gray-600 text-center mb-6">
                        Items you favorite will appear here. Start exploring to find products you love!
                    </p>
                    <Link 
                        href="/" 
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Explore Products
                    </Link>
                </div>
            ) : (
                <ProductsGridView products={likedProducts} />
            )}
        </div>
    );
}