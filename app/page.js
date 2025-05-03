export const dynamic = 'force-dynamic';
import { getFeaturedProducts, getProducts } from "@/lib/firestore/products/read_server";
import Header from "./components/Header";
import FeaturedProductSlider from "./components/Sliders";
import Collections from "./components/Collections";
import { getCollections } from "@/lib/firestore/collections/read_server";
import Categories from "./components/Categories";
import { getCategories } from "@/lib/firestore/categories/read_server";
import ProductsGridView from "./components/Products";
import CustomerReview from "./components/CustomerReview";
import Brands from "./components/Brands";
import { getAllBrands } from "@/lib/firestore/brands/read_server";
import Footer from "./components/Footer";
import Link from "next/link";
import { Paintbrush, ChevronRight, Sparkles } from "lucide-react";

export default async function Home() {
  // Execute all requests concurrently
  const [
    rawFeaturedProducts,
    rawCollections,
    rawCategories,
    rawProducts,
    rawBrands
  ] = await Promise.all([
    getFeaturedProducts(),
    getCollections(),
    getCategories(),
    getProducts({ limit: 8 }), // Reduced from 10 to 6 for better mobile performance
    getAllBrands()
  ]);

  // Serialize the data
  const featuredProducts = JSON.parse(JSON.stringify(rawFeaturedProducts));
  const collections = JSON.parse(JSON.stringify(rawCollections));
  const categories = JSON.parse(JSON.stringify(rawCategories));
  const products = JSON.parse(JSON.stringify(rawProducts));
  const brands = JSON.parse(JSON.stringify(rawBrands));

  return (
    <main className="flex flex-col w-full overflow-x-hidden">
      <Header />
      <section className="pt-4 sm:pt-10"> {/* Reduced top padding on mobile */}
        <FeaturedProductSlider featuredProducts={featuredProducts} />
        <Collections collections={collections} />
        <Categories categories={categories} />
        <ProductsGridView products={products} initialDisplayCount={8} /> {/* Reduced initial display count */}
        
        {/* Artistic Gallery Link Section - Mobile Optimized */}
        <div className="max-w-screen-xl mx-auto px-4 py-8 sm:py-16 relative">
          {/* Decorative elements - adjusted for mobile */}
          <div className="absolute top-0 left-1/4 w-24 sm:w-32 h-24 sm:h-32 bg-blue-50 opacity-30 rounded-full blur-xl sm:blur-2xl"></div>
          <div className="absolute bottom-0 right-1/4 w-32 sm:w-48 h-32 sm:h-48 bg-indigo-50 opacity-30 rounded-full blur-2xl sm:blur-3xl"></div>
          
          <div className="text-center relative z-10">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
              <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-blue-300"></span>
              <Paintbrush size={16} className="text-blue-500" /> {/* Smaller icon on mobile */}
              <span className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-blue-300"></span>
            </div>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif italic text-gray-800 mb-3 sm:mb-4 relative inline-block">
              Discover Our Collection
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-200"></span>
            </h2>
            
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-xs sm:max-w-md mx-auto px-2">
              Explore our gallery of handcrafted artworks by talented artists worldwide
            </p>
            
            <Link 
              href="/gallery" 
              className="group relative inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-2 sm:py-3 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md transition-all duration-500 hover:shadow-lg hover:from-blue-600 hover:to-indigo-700"
            >
              {/* Button inner glow effect */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-white to-transparent opacity-20 transform translate-y-3/4 group-hover:translate-y-0 transition-transform duration-500"></div>
              
              <span className="relative flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white bg-opacity-20">
                <Sparkles size={14} className="text-white" /> {/* Smaller icon on mobile */}
              </span>
              
              <span className="relative text-sm sm:text-base font-serif italic">
                View Gallery
              </span>
              
              <ChevronRight size={16} className="relative text-white transition-transform duration-300 group-hover:translate-x-1" /> {/* Smaller icon on mobile */}
              
              {/* Decorative paint splatter */}
              <div className="absolute top-0 right-0 -mt-1 -mr-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full opacity-70"></div>
              <div className="absolute bottom-0 left-0 -mb-1 -ml-1 w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full opacity-30"></div>
            </Link>
            
            {/* Decorative brush stroke under the button */}
            <div className="relative mx-auto mt-4 sm:mt-5 w-24 sm:w-32 h-0.5 sm:h-1">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-60"></div>
            </div>
          </div>
        </div>
        
        <Brands brands={brands} />
        <CustomerReview />
        <Footer/>
      </section>
    </main>
  );
}