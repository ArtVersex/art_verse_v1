"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ProductsGridView from "@/app/components/Products";
import ArtisticHero from "./components/ArtisticHero";
import FilterPanel from "./components/FilterPanel";
import FilterPills from "./components/FilterPills";
import NoResultsMessage from "./components/NoResultsMessage";

import { getProducts } from "@/lib/firestore/products/read_server";
import { getBrands } from '@/lib/firestore/brands/read_server';
import { getcategory } from '@/lib/firestore/categories/read_server';
import { Filter, ArrowUpDown, Loader2 } from "lucide-react";

export default function GalleryPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterApplying, setFilterApplying] = useState(false);
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  
  // Sorting states
  const [sortOption, setSortOption] = useState('default');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  
  // Fetch products, brands and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all products
        const rawProducts = await getProducts({});
        const productsData = JSON.parse(JSON.stringify(rawProducts));
        setProducts(productsData);
        setFilteredProducts(productsData); // Initially show all products
        
        // Set initial price range based on actual product prices
        const prices = productsData.map(p => p.price || 0).filter(Boolean);
        if (prices.length > 0) {
          const minPrice = Math.floor(Math.min(...prices));
          const maxPrice = Math.ceil(Math.max(...prices));
          setPriceRange([minPrice, maxPrice]);
        }
        
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
      
      // Sort brands and categories alphabetically
      setBrands(brandsWithCount.filter(Boolean).sort((a, b) => a.name.localeCompare(b.name)));
      setCategories(categoriesWithCount.filter(Boolean).sort((a, b) => a.name.localeCompare(b.name)));
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
    if (searchQuery.trim().length > 0) count++;
    
    // Only count price range if it's different from the min/max product prices
    const allPrices = products.map(p => p.price || 0).filter(Boolean);
    const minProductPrice = allPrices.length > 0 ? Math.floor(Math.min(...allPrices)) : 0;
    const maxProductPrice = allPrices.length > 0 ? Math.ceil(Math.max(...allPrices)) : 1000;
    
    if (priceRange[0] > minProductPrice || priceRange[1] < maxProductPrice) {
      count++;
    }
    
    setFilterCount(count);
  }, [selectedBrands, selectedCategories, availabilityFilter, priceRange, searchQuery, products]);
  
  // Apply filters and sorting with debounce
  const applyFilters = useCallback(() => {
    setFilterApplying(true);
    
    // Use setTimeout to prevent UI freezing for large datasets
    setTimeout(() => {
      if (products.length === 0) {
        setFilterApplying(false);
        return;
      }
      
      let result = [...products];
      
      // Apply text search filter
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        result = result.filter(product => {
          return (
            (product.title && product.title.toLowerCase().includes(query)) ||
            (product.description && product.description.toLowerCase().includes(query))
          );
        });
      }
      
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
        const price = product.salePrice || product.price || 0;
        return price >= priceRange[0] && price <= priceRange[1];
      });
      
      // Apply sorting
      switch (sortOption) {
        case 'priceHighToLow':
          result.sort((a, b) => {
            const priceA = a.salePrice || a.price || 0;
            const priceB = b.salePrice || b.price || 0;
            return priceB - priceA;
          });
          break;
        case 'priceLowToHigh':
          result.sort((a, b) => {
            const priceA = a.salePrice || a.price || 0;
            const priceB = b.salePrice || b.price || 0;
            return priceA - priceB;
          });
          break;
        case 'newestToOldest':
          result.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            return dateB - dateA;
          });
          break;
        case 'oldestToNewest':
          result.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            return dateA - dateB;
          });
          break;
        case 'nameAZ':
          result.sort((a, b) => {
            return (a.title || '').localeCompare(b.title || '');
          });
          break;
        case 'nameZA':
          result.sort((a, b) => {
            return (b.title || '').localeCompare(a.title || '');
          });
          break;
        default:
          // Default sorting (could be by popularity or featured)
          break;
      }
      
      setFilteredProducts(result);
      setFilterApplying(false);
      
      // Close filter panel on mobile after applying filters
      if (window.innerWidth < 768) {
        setIsFilterPanelOpen(false);
      }
    }, 10);
  }, [products, selectedBrands, selectedCategories, availabilityFilter, priceRange, sortOption, searchQuery]);
  
  // Apply filters whenever filter settings change
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 300); // 300ms debounce
    
    return () => clearTimeout(timer);
  }, [applyFilters]);
  
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
    setSearchQuery('');
    setSelectedBrands([]);
    setSelectedCategories([]);
    setAvailabilityFilter('all');
    
    // Reset price range to product min/max
    const allPrices = products.map(p => p.price || 0).filter(Boolean);
    const minPrice = allPrices.length > 0 ? Math.floor(Math.min(...allPrices)) : 0;
    const maxPrice = allPrices.length > 0 ? Math.ceil(Math.max(...allPrices)) : 1000;
    setPriceRange([minPrice, maxPrice]);
    
    setSortOption('default');
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
  
  // Remove a single price filter
  const removePriceFilter = () => {
    const allPrices = products.map(p => p.price || 0).filter(Boolean);
    const minPrice = allPrices.length > 0 ? Math.floor(Math.min(...allPrices)) : 0;
    const maxPrice = allPrices.length > 0 ? Math.ceil(Math.max(...allPrices)) : 1000;
    setPriceRange([minPrice, maxPrice]);
  };

  return (
    <main className="flex flex-col w-full overflow-x-hidden bg-stone-50 min-h-screen pt-4">
      <Header />

      <ArtisticHero />
      
      {/* Search and Filter Bar */}
      <div className="sticky top-0 z-30 bg-stone-50 shadow-sm p-2 border-b border-amber-100">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-2">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              {/* <input
                type="text"
                placeholder="Search artworks by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-1.5 pl-3 pr-8 rounded-full bg-white border border-amber-200 text-sm font-serif"
              /> */}
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <XCircle size={16} />
                </button>
              )}
            </div>
          </div>
          
          {/* Filter toggle button (mobile) */}
          <div className="md:hidden">
            <button
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className="flex items-center justify-center gap-1 w-full py-1.5 px-3 rounded-full bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 font-serif text-sm"
            >
              <Filter size={16} />
              <span>Filters {filterCount > 0 && `(${filterCount})`}</span>
            </button>
          </div>
          
          {/* View Toggle and Sort (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <select 
              value={sortOption} 
              onChange={(e) => setSortOption(e.target.value)}
              className="text-sm bg-white border border-amber-200 rounded-full py-1.5 px-3 font-serif text-stone-700 cursor-pointer"
            >
              <option value="default">Default Sorting</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="newestToOldest">Newest to Oldest</option>
              <option value="oldestToNewest">Oldest to Newest</option>
              <option value="nameAZ">Name: A-Z</option>
              <option value="nameZA">Name: Z-A</option>
            </select>
            
            {/* View Toggle */}
            <div className="flex items-center border border-amber-200 rounded-full overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-sm font-serif ${
                  viewMode === 'grid' 
                    ? 'bg-amber-200 text-amber-800' 
                    : 'bg-white text-stone-600 hover:bg-amber-50'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-sm font-serif ${
                  viewMode === 'list' 
                    ? 'bg-amber-200 text-amber-800' 
                    : 'bg-white text-stone-600 hover:bg-amber-50'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-2 md:px-4 py-4 md:py-8 flex flex-col md:flex-row">
        <FilterPanel 
          isFilterPanelOpen={isFilterPanelOpen}
          setIsFilterPanelOpen={setIsFilterPanelOpen}
          brands={brands}
          categories={categories}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedBrands={selectedBrands}
          selectedCategories={selectedCategories}
          toggleBrand={toggleBrand}
          toggleCategory={toggleCategory}
          availabilityFilter={availabilityFilter}
          setAvailabilityFilter={setAvailabilityFilter}
          resetFilters={resetFilters}
          applyFilters={applyFilters}
          maxPrice={maxPrice}
          sortOption={sortOption}
          setSortOption={setSortOption}
          viewMode={viewMode}
          setViewMode={setViewMode}
          filterCount={filterCount}
        />
        
        {/* Products Grid */}
        <div className="flex-1 md:pl-4">
          {/* Mobile Sort Control */}
          <div className="md:hidden mb-3">
            <select 
              value={sortOption} 
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full text-xs bg-white border border-amber-200 rounded-md py-1.5 px-2 font-serif text-stone-700 cursor-pointer"
            >
              <option value="default">Default Sorting</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="newestToOldest">Newest to Oldest</option>
              <option value="oldestToNewest">Oldest to Newest</option>
              <option value="nameAZ">Name: A-Z</option>
              <option value="nameZA">Name: Z-A</option>
            </select>
          </div>
          
          {/* Results Summary */}
          <div className="flex justify-between items-center mb-3 md:mb-4">
            <div className="text-sm text-stone-600 font-serif">
              {filterApplying ? (
                <span className="flex items-center gap-1">
                  <Loader2 size={14} className="animate-spin" />
                  Applying filters...
                </span>
              ) : (
                <>
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'artwork' : 'artworks'} found
                </>
              )}
            </div>
            
            {/* Mobile View Toggle */}
            <div className="md:hidden flex items-center border border-amber-200 rounded-full overflow-hidden text-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2 py-1 font-serif ${
                  viewMode === 'grid' 
                    ? 'bg-amber-200 text-amber-800' 
                    : 'bg-white text-stone-600'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-2 py-1 font-serif ${
                  viewMode === 'list' 
                    ? 'bg-amber-200 text-amber-800' 
                    : 'bg-white text-stone-600'
                }`}
              >
                List
              </button>
            </div>
          </div>
          
          {/* Active Filter Pills */}
          <FilterPills 
            selectedBrands={selectedBrands}
            selectedCategories={selectedCategories}
            availabilityFilter={availabilityFilter}
            priceRange={priceRange}
            searchQuery={searchQuery}
            filterCount={filterCount}
            maxPrice={maxPrice}
            sortOption={sortOption}
            setSelectedBrands={setSelectedBrands}
            setSelectedCategories={setSelectedCategories}
            setAvailabilityFilter={setAvailabilityFilter}
            setPriceRange={setPriceRange}
            setSearchQuery={setSearchQuery}
            setSortOption={setSortOption}
            resetFilters={resetFilters}
            getBrandNameById={getBrandNameById}
            getCategoryNameById={getCategoryNameById}
            removePriceFilter={removePriceFilter}
          />
          
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-amber-500 mb-3" />
              <p className="text-stone-600 font-serif">Loading artworks...</p>
            </div>
          )}
          
          {/* No Results Message */}
          {filteredProducts.length === 0 && !loading && (
            <NoResultsMessage resetFilters={resetFilters} />
          )}
          
          {/* Products Grid View */}
          {filteredProducts.length > 0 && !loading && (
            <section className="py-1">
              <style jsx global>{`
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
                
                .product-list-view {
                  display: flex;
                  flex-direction: column;
                  gap: 1rem;
                }
                
                .product-list-item {
                  display: flex;
                  border: 1px solid #f3e8d0;
                  border-radius: 0.5rem;
                  overflow: hidden;
                  background: white;
                }
                
                .product-list-image {
                  width: 120px;
                  height: 120px;
                  object-fit: cover;
                }
                
                .product-list-content {
                  flex: 1;
                  padding: 0.75rem;
                  display: flex;
                  flex-direction: column;
                }
                
                @media (max-width: 768px) {
                  .product-list-image {
                    width: 100px;
                    height: 100px;
                  }
                }
              `}</style>
              
              {viewMode === 'grid' ? (
                <ProductsGridView 
                  products={filteredProducts} 
                  initialDisplayCount={12}
                  className="product-grid"
                  productClassName="product-card"
                  imageClassName="product-card-image"
                  contentClassName="product-card-content"
                  titleClassName="product-card-title"
                  priceClassName="product-card-price"
                />
              ) : (
                <div className="product-list-view">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="product-list-item">
                      <img 
                        src={product.featureImageUrl || "/placeholder-art.jpg"} 
                        alt={product.title} 
                        className="product-list-image"
                      />
                      <div className="product-list-content">
                        <h3 className="font-serif text-sm md:text-base font-medium">{product.title}</h3>
                        <p className="text-xs text-stone-500 italic">
                          by {getBrandNameById(product.brandID)}
                        </p>
                        <div className="text-xs mt-1 text-stone-600">
                          {getCategoryNameById(product.categoryID)}
                        </div>
                        <div className="mt-auto pt-2 flex justify-between items-center">
                          <div className="font-medium text-amber-800">
                            ${product.salePrice || product.price || 0}
                          </div>
                          <div className="text-xs">
                            {product.stock > 0 ? (
                              <span className="text-emerald-600">In Stock</span>
                            ) : (
                              <span className="text-rose-600">Sold Out</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}