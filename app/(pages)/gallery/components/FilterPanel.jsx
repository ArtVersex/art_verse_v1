import { 
    Paintbrush, Filter, XCircle, Search, Palette, Framer, ShoppingBag, ArrowDownUp,
    Grid, List, SlidersHorizontal, Check, ChevronDown, ChevronUp
  } from "lucide-react";
  import React from "react";
  export default function FilterPanel({
    isFilterPanelOpen,
    setIsFilterPanelOpen,
    brands,
    categories,
    priceRange,
    setPriceRange,
    selectedBrands,
    selectedCategories,
    toggleBrand,
    toggleCategory,
    availabilityFilter,
    setAvailabilityFilter,
    resetFilters,
    maxPrice,
    sortOption,
    setSortOption,
    viewMode,
    setViewMode,
    filterCount,
    applyFilters
  }) {
    // Get max brand count for styling the count indicators
    const maxBrandCount = Math.max(...brands.map(brand => brand.count || 0), 1);
    const maxCategoryCount = Math.max(...categories.map(category => category.count || 0), 1);
    
    // Function to calculate brand counts as percentage of width
    const getBrandCountWidth = (count) => {
      const percentage = (count / maxBrandCount) * 100;
      return `${Math.max(percentage, 5)}%`; // Minimum 5% width for visibility
    };
    
    // Function to calculate category counts as percentage of width
    const getCategoryCountWidth = (count) => {
      const percentage = (count / maxCategoryCount) * 100;
      return `${Math.max(percentage, 5)}%`; // Minimum 5% width for visibility
    };
    
    // Filter brands by most products (for popular filter)
    const popularBrands = [...brands]
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .slice(0, 5);
      
    // State for accordion sections
    const [expandedSections, setExpandedSections] = React.useState({
      artists: true,
      categories: true,
      price: true,
      availability: true,
      sorting: false
    });
    
    // Toggle section expansion
    const toggleSection = (section) => {
      setExpandedSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    };
  
    return (
      <aside className={`md:w-72 lg:w-80 flex-shrink-0 transition-all duration-300 z-40 ${
        isFilterPanelOpen 
          ? 'fixed inset-0 bg-black/30 md:static md:bg-transparent md:pr-6'
          : 'max-h-0 md:max-h-[2000px] opacity-0 md:opacity-100 overflow-hidden'
      }`}>
        <div className={`h-full md:h-auto w-3/4 sm:w-2/3 md:w-full bg-white overflow-y-auto transform transition-transform duration-300 ${
          isFilterPanelOpen
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }`}>
          <div className="sticky top-0 md:top-20 rounded-none md:rounded-2xl shadow-md border-r md:border border-amber-100 overflow-hidden bg-white">
            {/* Filter Header */}
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-3 md:p-4 flex items-center justify-between border-b border-amber-200">
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal size={16} className="text-amber-700" />
                <h3 className="font-serif italic text-base md:text-lg text-stone-800">Filter Options</h3>
                {filterCount > 0 && (
                  <span className="ml-1 text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded-full">
                    {filterCount}
                  </span>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={resetFilters}
                  className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1 font-serif"
                >
                  <XCircle size={14} />
                  Reset
                </button>
                
                <button
                  onClick={() => setIsFilterPanelOpen(false)}
                  className="md:hidden text-stone-600"
                >
                  <XCircle size={18} />
                </button>
              </div>
            </div>
            
            <div className="p-3 md:p-4 space-y-4 md:space-y-6 max-h-[85vh] md:max-h-[90vh] overflow-y-auto">
              {/* Quick Filters - Desktop only */}
              <div className="hidden md:block space-y-2">
                <h4 className="font-serif font-medium text-sm text-stone-700 flex items-center gap-1.5 border-b border-amber-100 pb-1">
                  <Palette size={14} className="text-amber-600" />
                  <span>Popular Artists</span>
                </h4>
                
                <div className="flex flex-wrap gap-1.5">
                  {popularBrands.map(brand => (
                    <button
                      key={`popular-${brand.id}`}
                      onClick={() => toggleBrand(brand.id)}
                      className={`px-2 py-1 text-xs rounded-full transition-all font-serif ${
                        selectedBrands.includes(brand.id)
                          ? 'bg-amber-500 text-white'
                          : 'bg-amber-50 text-stone-600 hover:bg-amber-100'
                      }`}
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Artists Filter - Accordion */}
              <div className="space-y-2">
                <button 
                  onClick={() => toggleSection('artists')}
                  className="w-full font-serif font-medium text-sm text-stone-700 flex items-center justify-between gap-1.5 border-b border-amber-100 pb-1"
                >
                  <div className="flex items-center gap-1.5">
                    <Paintbrush size={14} className="text-amber-600" />
                    <span>Artists</span>
                  </div>
                  {expandedSections.artists ? 
                    <ChevronUp size={14} className="text-stone-500" /> : 
                    <ChevronDown size={14} className="text-stone-500" />
                  }
                </button>
                
                {expandedSections.artists && (
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
                            <Check size={10} className="text-white" />
                          )}
                        </button>
                        <label className="text-xs md:text-sm text-stone-700 font-serif italic cursor-pointer flex-1">{brand.name}</label>
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-2 bg-amber-50 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-300 rounded-full" 
                              style={{ width: getBrandCountWidth(brand.count || 0) }}
                            ></div>
                          </div>
                          <span className="text-xs text-stone-400 font-serif w-6 text-right">
                            {brand.count || 0}
                          </span>
                        </div>
                      </div>
                    )) : (
                      <p className="text-xs text-stone-500 italic font-serif">Loading artists...</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Category Filter - Accordion */}
              <div className="space-y-2">
                <button 
                  onClick={() => toggleSection('categories')}
                  className="w-full font-serif font-medium text-sm text-stone-700 flex items-center justify-between gap-1.5 border-b border-amber-100 pb-1"
                >
                  <div className="flex items-center gap-1.5">
                    <Framer size={14} className="text-amber-600" />
                    <span>Categories</span>
                  </div>
                  {expandedSections.categories ? 
                    <ChevronUp size={14} className="text-stone-500" /> : 
                    <ChevronDown size={14} className="text-stone-500" />
                  }
                </button>
                
                {expandedSections.categories && (
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
                            <Check size={10} className="text-white" />
                          )}
                        </button>
                        <label className="text-xs md:text-sm text-stone-700 font-serif cursor-pointer flex-1">{category.name}</label>
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-2 bg-amber-50 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-300 rounded-full" 
                              style={{ width: getCategoryCountWidth(category.count || 0) }}
                            ></div>
                          </div>
                          <span className="text-xs text-stone-400 font-serif w-6 text-right">{category.count}</span>
                        </div>
                      </div>
                    )) : (
                      <p className="text-xs text-stone-500 italic font-serif">Loading categories...</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Price Range - Accordion */}
              <div className="space-y-2">
                <button 
                  onClick={() => toggleSection('price')}
                  className="w-full font-serif font-medium text-sm text-stone-700 flex items-center justify-between gap-1.5 border-b border-amber-100 pb-1"
                >
                  <div className="flex items-center gap-1.5">
                    <ShoppingBag size={14} className="text-amber-600" />
                    <span>Price Range</span>
                  </div>
                  {expandedSections.price ? 
                    <ChevronUp size={14} className="text-stone-500" /> : 
                    <ChevronDown size={14} className="text-stone-500" />
                  }
                </button>
                
                {expandedSections.price && (
                  <div className="px-2 space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                      
                      <div className="relative pt-1 px-1">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-100 rounded-full"></div>
                        <input
                          type="range"
                          min="0"
                          max={maxPrice}
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                          className="absolute top-0 left-0 right-0 w-full h-1.5 appearance-none pointer-events-none bg-transparent"
                          style={{
                            zIndex: 2,
                            pointerEvents: 'auto',
                            appearance: 'none',
                            background: 'transparent',
                            outline: 'none'
                          }}
                        />
                        <input
                          type="range"
                          min="0"
                          max={maxPrice}
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                          className="absolute top-0 left-0 right-0 w-full h-1.5 appearance-none pointer-events-none bg-transparent"
                          style={{
                            zIndex: 3,
                            pointerEvents: 'auto',
                            appearance: 'none',
                            background: 'transparent',
                            outline: 'none'
                          }}
                        />
                        
                        <style jsx>{`
                          input[type=range]::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            pointer-events: all;
                            width: 16px;
                            height: 16px;
                            background-color: white;
                            border: 2px solid #f59e0b;
                            border-radius: 50%;
                            cursor: pointer;
                          }
                          
                          input[type=range]::-moz-range-thumb {
                            pointer-events: all;
                            width: 16px;
                            height: 16px;
                            background-color: white;
                            border: 2px solid #f59e0b;
                            border-radius: 50%;
                            cursor: pointer;
                          }
                        `}</style>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="w-2/5">
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
                      <div className="w-2/5">
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
                    
                    {/* Quick Price Filter Buttons */}
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => setPriceRange([0, 100])}
                        className={`px-2 py-1 text-xs rounded-full transition-all font-serif ${
                          priceRange[0] === 0 && priceRange[1] === 100
                            ? 'bg-amber-500 text-white'
                            : 'bg-amber-50 text-stone-600 hover:bg-amber-100'
                        }`}
                      >
                        Under $100
                      </button>
                      <button
                        onClick={() => setPriceRange([100, 500])}
                        className={`px-2 py-1 text-xs rounded-full transition-all font-serif ${
                          priceRange[0] === 100 && priceRange[1] === 500
                            ? 'bg-amber-500 text-white'
                            : 'bg-amber-50 text-stone-600 hover:bg-amber-100'
                        }`}
                      >
                        $100 - $500
                      </button>
                      <button
                        onClick={() => setPriceRange([500, maxPrice])}
                        className={`px-2 py-1 text-xs rounded-full transition-all font-serif ${
                          priceRange[0] === 500 && priceRange[1] === maxPrice
                            ? 'bg-amber-500 text-white'
                            : 'bg-amber-50 text-stone-600 hover:bg-amber-100'
                        }`}
                      >
                        $500+
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Availability Filter - Accordion */}
              <div className="space-y-2">
                <button 
                  onClick={() => toggleSection('availability')}
                  className="w-full font-serif font-medium text-sm text-stone-700 flex items-center justify-between gap-1.5 border-b border-amber-100 pb-1"
                >
                  <div className="flex items-center gap-1.5">
                    <Filter size={14} className="text-amber-600" />
                    <span>Availability</span>
                  </div>
                  {expandedSections.availability ? 
                    <ChevronUp size={14} className="text-stone-500" /> : 
                    <ChevronDown size={14} className="text-stone-500" />
                  }
                </button>
                
                {expandedSections.availability && (
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
                )}
              </div>
              
              {/* Mobile only sorting - Accordion */}
              <div className="md:hidden space-y-2">
                <button 
                  onClick={() => toggleSection('sorting')}
                  className="w-full font-serif font-medium text-sm text-stone-700 flex items-center justify-between gap-1.5 border-b border-amber-100 pb-1"
                >
                  <div className="flex items-center gap-1.5">
                    <ArrowDownUp size={14} className="text-amber-600" />
                    <span>Sort By</span>
                  </div>
                  {expandedSections.sorting ? 
                    <ChevronUp size={14} className="text-stone-500" /> : 
                    <ChevronDown size={14} className="text-stone-500" />
                  }
                </button>
                
                {expandedSections.sorting && (
                  <div className="space-y-1.5">
                    {[
                      { value: 'default', label: 'Default Sorting' },
                      { value: 'priceHighToLow', label: 'Price: High to Low' },
                      { value: 'priceLowToHigh', label: 'Price: Low to High' },
                      { value: 'newestToOldest', label: 'Newest to Oldest' },
                      { value: 'oldestToNewest', label: 'Oldest to Newest' },
                      { value: 'nameAZ', label: 'Name: A-Z' },
                      { value: 'nameZA', label: 'Name: Z-A' }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setSortOption(option.value)}
                        className={`w-full text-left px-2 py-1 text-xs rounded transition-all font-serif ${
                          sortOption === option.value
                            ? 'bg-amber-100 text-amber-800'
                            : 'hover:bg-amber-50 text-stone-600'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Mobile Action Buttons */}
              <div className="md:hidden pt-2 space-y-2">
                <button
                  onClick={() => {
                    applyFilters();
                    setIsFilterPanelOpen(false);
                  }}
                  className="w-full py-2 bg-amber-500 text-white rounded-full text-sm font-serif"
                >
                  Apply Filters
                </button>
                
                <button
                  onClick={() => setIsFilterPanelOpen(false)}
                  className="w-full py-2 border border-amber-200 bg-white text-amber-800 rounded-full text-sm font-serif"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    );
  }