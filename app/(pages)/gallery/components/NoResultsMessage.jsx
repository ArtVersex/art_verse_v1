import { Paintbrush } from "lucide-react";

export default function NoResultsMessage({ resetFilters }) {
  return (
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
  );
}