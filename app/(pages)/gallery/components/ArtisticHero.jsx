import { Brush, Palette } from "lucide-react";

export default function ArtisticHero() {
  return (
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
  );
}