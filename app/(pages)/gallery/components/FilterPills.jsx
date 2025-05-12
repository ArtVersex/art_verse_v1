import { XCircle, ArrowUpDown } from "lucide-react";

export default function FilterPills({
  selectedBrands,
  selectedCategories,
  availabilityFilter,
  priceRange,
  filterCount,
  maxPrice,
  sortOption,
  setSelectedBrands,
  setSelectedCategories,
  setAvailabilityFilter,
  setPriceRange,
  setSortOption,
  resetFilters,
  getBrandNameById,
  getCategoryNameById
}) {
  // Check if any filters or sorting are active
  const hasActiveFiltersOrSorting = filterCount > 0 || sortOption !== 'default';
  
  // Don't render if no filters or sorting are active
  if (!hasActiveFiltersOrSorting) return null;

  return (
    <div className="mb-3 md:mb-6 flex flex-wrap gap-1.5 md:gap-2">
      {/* Brands Filter Pill */}
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
      
      {/* Categories Filter Pill */}
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
      
      {/* Availability Filter Pill */}
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
      
      {/* Price Range Filter Pill */}
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
      
      {/* Sort Option Pill */}
      {sortOption !== 'default' && (
        <div className="bg-blue-50 text-blue-700 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs flex items-center gap-1.5 md:gap-2 border border-blue-200">
          <span className="font-serif flex items-center gap-1">
            <ArrowUpDown size={10} className="md:w-3 md:h-3" />
            {sortOption === 'priceHighToLow' ? 'Price: High to Low' : 'Newest to Oldest'}
          </span>
          <button 
            onClick={() => setSortOption('default')}
            className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-blue-200 flex items-center justify-center hover:bg-blue-300"
          >
            <XCircle size={10} className="md:w-3 md:h-3" />
          </button>
        </div>
      )}
      
      {/* Clear All Filters Button */}
      {hasActiveFiltersOrSorting && (
        <button 
          onClick={resetFilters}
          className="bg-stone-50 text-stone-500 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs flex items-center gap-1 hover:bg-stone-100 border border-stone-200"
        >
          <XCircle size={10} className="md:w-3 md:h-3" />
          <span className="font-serif">Clear all</span>
        </button>
      )}
    </div>
  );
}