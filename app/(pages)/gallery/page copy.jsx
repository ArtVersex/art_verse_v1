"use client";

import { useEffect, useState } from "react";
import { Paintbrush, Filter, XCircle, Palette, Framer, Brush, ShoppingBag } from "lucide-react";
import { getProducts } from "@/lib/firestore/products/read_server";
import ProductsGridView from "@/app/components/Products";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { getBrands } from '@/lib/firestore/brands/read_server';
import { getcategory } from '@/lib/firestore/categories/read_server';

export default function GalleryPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all', 'inStock', 'soldOut'
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  
  // Fetch products, brands and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all products
        const rawProducts = await getProducts({});
        const productsData = JSON.parse(JSON.stringify(rawProducts));
        setProducts(productsData);
        setFilteredProducts(productsData);
        
        // Fetch brands and categories
        await fetchBrandsAndCategories(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Function to fetch brands and categories
  const fetchBrandsAndCategories = async (productsData) => {
    try {
      // Get unique brand IDs from products
      const uniqueBrandIds = Array.from(
        new Set(productsData.map(p => p.brandID).filter(Boolean))
      );
      
      // Get unique category IDs from products
      const uniqueCategoryIds = Array.from(
        new Set(productsData.map(p => p.categoryID).filter(Boolean))
      );
      
      // Fetch brand details
      const brandsPromises = uniqueBrandIds.map(async (brandID) => {
        try {
          const brand = await getBrands({ id: brandID });
          return brand || { id: brandID, name: "Unknown Artist" };
        } catch (error) {
          console.error(`Error fetching brand ${brandID}:`, error);
          return { id: brandID, name: "Unknown Artist" };
        }
      });
      
      // Fetch category details
      const categoriesPromises = uniqueCategoryIds.map(async (categoryID) => {
        try {
          const category = await getcategory({ id: categoryID });
          return category || { id: categoryID, name: "Uncategorized" };
        } catch (error) {
          console.error(`Error fetching category ${categoryID}:`, error);
          return { id: categoryID, name: "Uncategorized" };
        }
      });
      
      // Wait for all promises to resolve
      const [fetchedBrands, fetchedCategories] = await Promise.all([
        Promise.all(brandsPromises),
        Promise.all(categoriesPromises)
      ]);
      
      // Add count to each category
      const categoriesWithCount = fetchedCategories.map(category => ({
        ...category,
        count: productsData.filter(p => p.categoryID === category.id).length
      }));
      
      // Add count to each brand
      const brandsWithCount = fetchedBrands.map(brand => ({
        ...brand,
        count: productsData.filter(p => p.brandID === brand.id).length
      }));
      
      setBrands(brandsWithCount.filter(Boolean));
      setCategories(categoriesWithCount.filter(Boolean));
    } catch (error) {
      console.error("Error fetching brands and categories:", error);
      return [];
    }
  };
  
  // Calculate filter count
  useEffect(() => {
    let count = 0;
    if (selectedBrands.length > 0) count++;
    if (selectedCategories.length > 0) count++;
    if (availabilityFilter !== 'all') count++;
    if (priceRange[0] > 0 || priceRange[1] < 1000) count++;
    
    setFilterCount(count);
  }, [selectedBrands, selectedCategories, availabilityFilter, priceRange]);
  
  // Apply filters
  useEffect(() => {
    if (products.length === 0) return;
    
    let result = [...products];
    
    // Filter by brand
    if (selectedBrands.length > 0) {
      result = result.filter(product => selectedBrands.includes(product.brandID));
    }
    
    // Filter by category
    if (selectedCategories.length > 0) {
      result = result.filter(product => selectedCategories.includes(product.categoryID));
    }
    
    // Filter by availability
    if (availabilityFilter === 'inStock') {
      result = result.filter(product => product.stock > 0);
    } else if (availabilityFilter === 'soldOut') {
      result = result.filter(product => !product.stock || product.stock <= 0);
    }
    
    // Filter by price range
    result = result.filter(product => {
      const price = product.salePrice || product.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    setFilteredProducts(result);
  }, [products, selectedBrands, selectedCategories, availabilityFilter, priceRange]);
  
  // Toggle brand selection
  const toggleBrand = (brandID) => {
    setSelectedBrands(prev => 
      prev.includes(brandID) 
        ? prev.filter(id => id !== brandID)
        : [...prev, brandID]
    );
  };
  
  // Toggle category selection
  const toggleCategory = (categoryID) => {
    setSelectedCategories(prev => 
      prev.includes(categoryID) 
        ? prev.filter(id => id !== categoryID)
        : [...prev, categoryID]
    );
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setAvailabilityFilter('all');
    setPriceRange([0, 1000]);
  };
  
  // Find max price for range slider
  const maxPrice = Math.max(...products.map(p => p.price || 0), 1000);
  
  // Helper function to get brand name by ID
  const getBrandNameById = (brandId) => {
    const brand = brands.find(b => b.id === brandId);
    return brand ? brand.name : "Unknown Artist";
  };
  
  // Helper function to get category name by ID
  const getCategoryNameById = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : "Uncategorized";
  };
  
  return (
    <main className="flex flex-col w-full overflow-x-hidden bg-stone-50 min-h-screen pt-4">
      <Header />

      {/* Artistic Hero Section - More compact for mobile */}
      <div className="bg-gradient-to-r from-amber-50 via-stone-50 to-amber-50 py-8 md:py-16 px-3 md:px-4 border-y-2 border-amber-100 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 h-16 md:h-24 w-16 md:w-24 opacity-10">
          <Brush className="h-full w-full text-amber-800" />
        </div>
        <div className="absolute bottom-0 right-0 h-16 md:h-24 w-16 md:w-24 opacity-10 transform rotate-45">
          <Palette className="h-full w-full text-amber-800" />
        </div>
        
        <div className="max-w-screen-xl mx-auto text-center relative z-10">
          <h1 className="text-2xl md:text-5xl font-serif italic mb-3 md:mb-6 text-stone-800 tracking-tight">
            Gallery of <span className="text-amber-700">Artistic</span> Treasures
          </h1>
          <div className="w-20 h-1 mx-auto bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 mb-3 md:mb-6"></div>
          <p className="text-sm md:text-base text-stone-600 max-w-lg mx-auto font-serif leading-relaxed">
            Browse our entire collection of unique artworks and artistic creations,
            each telling a story through the artist's vision and craftsmanship.
          </p>
        </div>
      </div>
      
      {/* Filter toggle button (mobile) - More compact */}
      <div className="md:hidden sticky top-0 z-30 bg-stone-50 shadow-sm p-2">
        <button
          onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          className="flex items-center justify-center gap-1 w-full py-1.5 px-3 rounded-full bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 font-serif text-sm"
        >
          <Filter size={16} />
          <span>Artistic Filters {filterCount > 0 && `(${filterCount})`}</span>
        </button>
      </div>

      <div className="max-w-screen-xl mx-auto px-2 md:px-4 py-4 md:py-8 flex flex-col md:flex-row">
        {/* Filter Panel - Artistic Style */}
        <aside className={`md:w-64 lg:w-72 flex-shrink-0 md:pr-8 transition-all duration-300 ${
          isFilterPanelOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 md:max-h-[2000px] opacity-0 md:opacity-100 overflow-hidden'
        }`}>
          <div className="sticky top-16 md:top-20 rounded-xl md:rounded-2xl shadow-md border-2 border-amber-100 overflow-hidden bg-white">
            {/* Filter Header - More compact */}
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-3 md:p-4 flex items-center justify-between border-b border-amber-200">
              <div className="flex items-center gap-1.5">
                <Palette size={16} className="text-amber-700" />
                <h3 className="font-serif italic text-base md:text-lg text-stone-800">Artistic Filters</h3>
              </div>
              
              <button
                onClick={resetFilters}
                className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1 font-serif"
              >
                <XCircle size={14} />
                Reset
              </button>
            </div>
            
            <div className="p-3 md:p-4 space-y-4 md:space-y-6">
              {/* Artist Filter */}
              <div className="space-y-2 md:space-y-3">
                <h4 className="font-serif font-medium text-sm text-stone-700 flex items-center gap-1.5 border-b border-amber-100 pb-1">
                  <Paintbrush size={14} className="text-amber-600" />
                  <span>Artists</span>
                </h4>
                <div className="max-h-40 md:max-h-48 overflow-y-auto pr-2 space-y-1.5 md:space-y-2">
                  {brands.length > 0 ? brands.map((brand) => (
                    <div 
                      key={brand.id} 
                      className="flex items-center gap-2"
                    >
                      <button
                        onClick={() => toggleBrand(brand.id)}
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                          selectedBrands.includes(brand.id)
                            ? 'border-amber-500 bg-amber-500'
                            : 'border-stone-300'
                        }`}
                      >
                        {selectedBrands.includes(brand.id) && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </button>
                      <label className="text-xs md:text-sm text-stone-700 font-serif italic cursor-pointer flex-1">{brand.name}</label>
                      <span className="text-xs text-stone-400 font-serif">
                        {brand.count || 0}
                      </span>
                    </div>
                  )) : (
                    <p className="text-xs text-stone-500 italic font-serif">Loading artists...</p>
                  )}
                </div>
              </div>
              
              {/* Category Filter */}
              <div className="space-y-2 md:space-y-3">
                <h4 className="font-serif font-medium text-sm text-stone-700 flex items-center gap-1.5 border-b border-amber-100 pb-1">
                  <Framer size={14} className="text-amber-600" />
                  <span>Categories</span>
                </h4>
                <div className="max-h-32 md:max-h-36 overflow-y-auto pr-2 space-y-1.5 md:space-y-2">
                  {categories.length > 0 ? categories.map((category) => (
                    <div 
                      key={category.id} 
                      className="flex items-center gap-2"
                    >
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          selectedCategories.includes(category.id)
                            ? 'border-amber-500 bg-amber-500'
                            : 'border-stone-300'
                        }`}
                      >
                        {selectedCategories.includes(category.id) && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </button>
                      <label className="text-xs md:text-sm text-stone-700 font-serif cursor-pointer flex-1">{category.name}</label>
                      <span className="text-xs text-stone-400 font-serif">{category.count}</span>
                    </div>
                  )) : (
                    <p className="text-xs text-stone-500 italic font-serif">Loading categories...</p>
                  )}
                </div>
              </div>
              
              {/* Price Range */}
              <div className="space-y-2 md:space-y-3">
                <h4 className="font-serif font-medium text-sm text-stone-700 flex items-center gap-1.5 border-b border-amber-100 pb-1">
                  <ShoppingBag size={14} className="text-amber-600" />
                  <span>Price Range</span>
                </h4>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-1.5 md:h-2 bg-amber-100 rounded-full appearance-none cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="w-1/3">
                    <input
                      type="number"
                      min="0"
                      max={priceRange[1]}
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full p-1 text-xs border border-amber-200 rounded-md bg-amber-50 font-serif"
                    />
                  </div>
                  <span className="text-stone-500 text-xs font-serif">to</span>
                  <div className="w-1/3">
                    <input
                      type="number"
                      min={priceRange[0]}
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full p-1 text-xs border border-amber-200 rounded-md bg-amber-50 font-serif"
                    />
                  </div>
                </div>
              </div>
              
              {/* Availability Filter */}
              <div className="space-y-2 md:space-y-3">
                <h4 className="font-serif font-medium text-sm text-stone-700 flex items-center gap-1.5 border-b border-amber-100 pb-1">
                  <Filter size={14} className="text-amber-600" />
                  <span>Availability</span>
                </h4>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  <button
                    onClick={() => setAvailabilityFilter('all')}
                    className={`px-2 md:px-3 py-0.5 md:py-1 text-xs rounded-full transition-all font-serif ${
                      availabilityFilter === 'all'
                        ? 'bg-amber-500 text-white'
                        : 'bg-amber-50 text-stone-600 hover:bg-amber-100'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setAvailabilityFilter('inStock')}
                    className={`px-2 md:px-3 py-0.5 md:py-1 text-xs rounded-full transition-all font-serif ${
                      availabilityFilter === 'inStock'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    In Stock
                  </button>
                  <button
                    onClick={() => setAvailabilityFilter('soldOut')}
                    className={`px-2 md:px-3 py-0.5 md:py-1 text-xs rounded-full transition-all font-serif ${
                      availabilityFilter === 'soldOut'
                        ? 'bg-rose-500 text-white'
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    Sold Out
                  </button>
                </div>
              </div>
              
              {/* Filter Status */}
              <div className="pt-1 md:pt-2 border-t border-amber-100">
                <p className="text-xs text-stone-500 font-serif italic">
                  Showing {filteredProducts.length} of {products.length} artworks
                </p>
              </div>
              
              {/* Close button (mobile only) */}
              <div className="md:hidden pt-1">
                <button
                  onClick={() => setIsFilterPanelOpen(false)}
                  className="w-full py-1.5 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 rounded-full text-sm font-serif"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Products Grid */}
        <div className="flex-1 md:pl-4">
          {/* Active Filter Pills - More compact on mobile */}
          {filterCount > 0 && (
            <div className="mb-3 md:mb-6 flex flex-wrap gap-1.5 md:gap-2">
              {selectedBrands.length > 0 && (
                <div className="bg-amber-50 text-amber-700 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs flex items-center gap-1.5 md:gap-2 border border-amber-200">
                  <span className="font-serif">
                    {selectedBrands.length === 1 
                      ? `Artist: ${getBrandNameById(selectedBrands[0])}` 
                      : `Artists: ${selectedBrands.length}`}
                  </span>
                  <button 
                    onClick={() => setSelectedBrands([])}
                    className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-amber-200 flex items-center justify-center hover:bg-amber-300"
                  >
                    <XCircle size={10} className="md:w-3 md:h-3" />
                  </button>
                </div>
              )}
              
              {selectedCategories.length > 0 && (
                <div className="bg-stone-50 text-stone-700 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs flex items-center gap-1.5 md:gap-2 border border-stone-200">
                  <span className="font-serif">
                    {selectedCategories.length === 1 
                      ? `Category: ${getCategoryNameById(selectedCategories[0])}` 
                      : `Categories: ${selectedCategories.length}`}
                  </span>
                  <button 
                    onClick={() => setSelectedCategories([])}
                    className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-stone-200 flex items-center justify-center hover:bg-stone-300"
                  >
                    <XCircle size={10} className="md:w-3 md:h-3" />
                  </button>
                </div>
              )}
              
              {availabilityFilter !== 'all' && (
                <div className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs flex items-center gap-1.5 md:gap-2 border ${
                  availabilityFilter === 'inStock' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  <span className="font-serif">
                    {availabilityFilter === 'inStock' ? 'In Stock' : 'Sold Out'}
                  </span>
                  <button 
                    onClick={() => setAvailabilityFilter('all')}
                    className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center ${
                      availabilityFilter === 'inStock' 
                        ? 'bg-emerald-200 hover:bg-emerald-300' 
                        : 'bg-rose-200 hover:bg-rose-300'
                    }`}
                  >
                    <XCircle size={10} className="md:w-3 md:h-3" />
                  </button>
                </div>
              )}
              
              {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                <div className="bg-stone-50 text-stone-700 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs flex items-center gap-1.5 md:gap-2 border border-stone-200">
                  <span className="font-serif">Price: ${priceRange[0]} - ${priceRange[1]}</span>
                  <button 
                    onClick={() => setPriceRange([0, maxPrice])}
                    className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-stone-200 flex items-center justify-center hover:bg-stone-300"
                  >
                    <XCircle size={10} className="md:w-3 md:h-3" />
                  </button>
                </div>
              )}
              
              <button 
                onClick={resetFilters}
                className="bg-stone-50 text-stone-500 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs flex items-center gap-1 hover:bg-stone-100 border border-stone-200"
              >
                <XCircle size={10} className="md:w-3 md:h-3" />
                <span className="font-serif">Clear all</span>
              </button>
            </div>
          )}
          
          {/* No Results Message */}
          {filteredProducts.length === 0 && !loading && (
            <div className="py-8 md:py-16 text-center">
              <div className="mb-3 md:mb-4 flex justify-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-amber-50 flex items-center justify-center border border-amber-200">
                  <Paintbrush size={20} className="md:w-6 md:h-6 text-amber-300" />
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-serif italic text-stone-700 mb-2">No Artworks Found</h3>
              <p className="text-sm md:text-base text-stone-500 max-w-md mx-auto mb-4 md:mb-6 font-serif">
                We couldn't find any artworks matching your filter criteria. Try adjusting your filters to see more of our artistic collection.
              </p>
              <button 
                onClick={resetFilters}
                className="px-4 md:px-6 py-1.5 md:py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full hover:from-amber-600 hover:to-amber-700 transition-all font-serif text-sm md:text-base"
              >
                Reset Filters
              </button>
            </div>
          )}
          
          {/* Products Grid View - Added CSS to make cards bigger on mobile */}
          {filteredProducts.length > 0 && (
            <section className="py-1">
              {/* 
                To make product cards bigger in the ProductsGridView component, 
                we'll pass a custom className prop that you can use to override 
                default sizing in your ProductsGridView component:
              */}
              <style jsx global>{`
                /* Custom styles for mobile product cards */
                @media (max-width: 768px) {
                  .product-grid {
                    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                    gap: 0.5rem !important;
                    padding: 0 0.25rem !important;
                  }
                  
                  .product-card {
                    aspect-ratio: 2/3 !important;
                  }
                  
                  .product-card-image {
                    height: 65% !important;
                  }
                  
                  .product-card-content {
                    padding: 0.5rem !important;
                  }
                  
                  .product-card-title {
                    font-size: 0.875rem !important;
                    line-height: 1.25rem !important;
                  }
                  
                  .product-card-price {
                    font-size: 0.75rem !important;
                  }
                }
              `}</style>
              <ProductsGridView 
                products={filteredProducts} 
                initialDisplayCount={8}
                className="product-grid"
                productClassName="product-card"
                imageClassName="product-card-image"
                contentClassName="product-card-content"
                titleClassName="product-card-title"
                priceClassName="product-card-price"
              />
            </section>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}