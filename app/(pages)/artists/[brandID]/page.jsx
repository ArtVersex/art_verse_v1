import ProductsGridView from "@/app/components/Products";
import { getProductByBrand } from "@/lib/firestore/products/read_server";
import { getBrands } from "@/lib/firestore/brands/read_server";
import Image from "next/image";
import BioSection from "./components/BioSection";
import CommissionForm from "./components/CommissionForm";

import {
  Instagram,
  Twitter,
  Globe,
  Award,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Palette,
  Book,
  FileText,
  Wrench,
  Sparkles,
  Heart,
  Eye
} from "lucide-react";
import Link from "next/link";

export default async function ArtistPage({ params }) {
  const resolvedParams = await params;
  const artistId = resolvedParams.brandID;
  const artist = await getBrands({ id: artistId });
  const products = await getProductByBrand({ brandId: artistId });

  if (!artist) {
    return (
      <div className="max-w-7xl mx-auto p-5 md:p-10 text-center py-20">
        <h1 className="text-3xl font-bold text-stone-800 mb-4">Artist Not Found</h1>
        <p className="text-stone-600">The artist you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  const formatSocialLink = (type, username) => {
    if (!username) return null;
    
    switch (type) {
      case 'instagram':
        return `https://instagram.com/${username.replace('@', '')}`;
      case 'twitter':
        return `https://twitter.com/${username.replace('@', '')}`;
      case 'website':
        return username.startsWith('http') ? username : `https://${username}`;
      case 'behance':
        return username.includes('behance.net') ? username : `https://behance.net/${username}`;
      default:
        return username;
    }
  };
  
  return (
    <main className="relative">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-amber-50 to-stone-100 opacity-80"></div>
      <div className="fixed inset-0 -z-10 bg-[url('/noise-pattern.png')] opacity-10"></div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-8 relative z-10">
        {/* Artist Profile Header - Improved spacing and contrast */}
        <div className="mb-12 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start bg-white/80 p-6 rounded-2xl shadow-lg border border-white/50">
            {/* Profile Image */}
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-br from-amber-600 via-blue-500 to-stone-500 rounded-full opacity-60 blur-sm"></div>
              {artist.imageUrl ? (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg relative z-10">
                  <Image 
                    src={artist.imageUrl} 
                    alt={artist.name} 
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                    priority
                  />
                  {true && (
                    <div className="absolute bottom-1.5 right-1.5 bg-gradient-to-r from-amber-500 to-blue-500 text-white rounded-full p-1 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-stone-200 flex items-center justify-center relative z-10">
                  <Palette size={40} className="text-stone-400" />
                </div>
              )}
            </div>
            
            {/* Artist Info - Improved text contrast */}
            <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
              <div className="inline-block relative mb-3">
                <h1 className="text-3xl md:text-4xl font-bold text-stone-800 relative z-10 tracking-tight">
                  {artist.name}
                  {artist.isVerified && (
                    <span className="inline-block ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </h1>
                <div className="h-2 w-3/4 bg-gradient-to-r from-amber-300 to-stone-300 absolute bottom-0 left-0 -z-1 transform -rotate-1 rounded-full"></div>
              </div>
              
              {/* Artist quick info - More compact layout */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                {artist.location && (
                  <div className="flex items-center text-stone-700 bg-white px-2.5 py-1 rounded-full shadow-sm text-sm">
                    <MapPin size={14} className="mr-1 text-amber-600" />
                    <span>{artist.location}</span>
                  </div>
                )}
                
                {artist.yearStarted && (
                  <div className="flex items-center text-stone-700 bg-white px-2.5 py-1 rounded-full shadow-sm text-sm">
                    <Calendar size={14} className="mr-1 text-amber-600" />
                    <span>Since {artist.yearStarted}</span>
                  </div>
                )}
                
                {artist.specialties && artist.specialties.length > 0 && (
                  <div className="flex items-center text-stone-700 bg-white px-2.5 py-1 rounded-full shadow-sm text-sm">
                    <Palette size={14} className="mr-1 text-amber-600" />
                    <span>{artist.specialties.slice(0, 2).join(", ")}{artist.specialties.length > 2 && "..."}</span>
                  </div>
                )}
              </div>
              
              {/* Social links - More subtle design */}
              <div className="flex gap-3 justify-center md:justify-start">
                {artist.socialMedia?.instagram && (
                  <a 
                    href={formatSocialLink('instagram', artist.socialMedia.instagram)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-stone-700 hover:text-amber-600 transition-colors bg-white p-2 rounded-full shadow-sm hover:shadow-md"
                    aria-label="Instagram"
                  >
                    <Instagram size={18} />
                  </a>
                )}
                
                {artist.socialMedia?.twitter && (
                  <a 
                    href={formatSocialLink('twitter', artist.socialMedia.twitter)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-stone-700 hover:text-amber-600 transition-colors bg-white p-2 rounded-full shadow-sm hover:shadow-md"
                    aria-label="Twitter"
                  >
                    <Twitter size={18} />
                  </a>
                )}
                
                {artist.socialMedia?.website && (
                  <a 
                    href={formatSocialLink('website', artist.socialMedia.website)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-stone-700 hover:text-amber-600 transition-colors bg-white p-2 rounded-full shadow-sm hover:shadow-md"
                    aria-label="Website"
                  >
                    <Globe size={18} />
                  </a>
                )}
                
                {artist.email && (
                  <a 
                    href={`mailto:${artist.email}`}
                    className="text-stone-700 hover:text-amber-600 transition-colors bg-white p-2 rounded-full shadow-sm hover:shadow-md"
                    aria-label="Email"
                  >
                    <Mail size={18} />
                  </a>
                )}
                
                {artist.phone && (
                  <a 
                    href={`tel:${artist.phone}`}
                    className="text-stone-700 hover:text-amber-600 transition-colors bg-white p-2 rounded-full shadow-sm hover:shadow-md"
                    aria-label="Phone"
                  >
                    <Phone size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Banner Image - Improved proportions */}
        {artist.bannerImageUrl && (
          <div className="mb-12 relative rounded-xl overflow-hidden shadow-lg h-48 md:h-72 group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-blue-900/20 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <Image 
              src={artist.bannerImageUrl}
              alt={`${artist.name}'s banner`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
              priority
            />
            {artist.tagline && (
              <div className="absolute bottom-4 left-4 text-white max-w-md">
                <p className="text-lg font-light italic tracking-wide">"{artist.tagline}"</p>
              </div>
            )}
          </div>
        )}
        
        {/* Main Content Grid - Better spacing */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          {/* Artist Bio Section - Improved readability */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-stone-100">
              <h2 className="text-2xl font-semibold mb-5 text-stone-800 flex items-center">
                <FileText size={18} className="mr-2 text-amber-600" />
                About the Artist
              </h2>
              
              <div className="prose prose-stone max-w-none">
                <BioSection bio={artist.bio} artistStatement={artist.artistStatement} />
              </div>
            </div>
          </div>
          
          {/* Sidebar - Artist Details - More compact */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl p-5 shadow-lg border border-stone-100">
              <h2 className="text-xl font-semibold mb-5 text-stone-800 flex items-center">
                <Sparkles size={16} className="mr-2 text-amber-600" />
                Artist Details
              </h2>
              
              <div className="space-y-5">
                {/* Specialties */}
                {artist.specialties && artist.specialties.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-stone-600 mb-2 flex items-center">
                      <Palette size={14} className="mr-1.5 text-amber-500" /> Specialties
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {artist.specialties.map((specialty, index) => (
                        <span 
                          key={index} 
                          className="bg-amber-50 text-amber-800 text-xs px-2.5 py-1 rounded-full border border-amber-100"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Mediums */}
                {artist.mediums && artist.mediums.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-stone-600 mb-2 flex items-center">
                      <Wrench size={14} className="mr-1.5 text-amber-500" /> Mediums
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {artist.mediums.map((medium, index) => (
                        <span 
                          key={index} 
                          className="bg-blue-50 text-blue-800 text-xs px-2.5 py-1 rounded-full border border-blue-100"
                        >
                          {medium}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Education */}
                {artist.education && (
                  <div>
                    <h3 className="text-sm font-medium text-stone-600 mb-2 flex items-center">
                      <Book size={14} className="mr-1.5 text-amber-500" /> Education
                    </h3>
                    <p className="text-stone-700 text-sm">{artist.education}</p>
                  </div>
                )}
                
                {/* Awards */}
                {artist.awards && artist.awards.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-stone-600 mb-2 flex items-center">
                      <Award size={14} className="mr-1.5 text-amber-500" /> Awards
                    </h3>
                    <ul className="space-y-2">
                      {artist.awards.map((award, index) => (
                        <li key={index} className="flex items-start">
                          <div className="h-4 w-4 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs mr-2 mt-0.5">
                            {index + 1}
                          </div>
                          <span className="text-stone-700 text-sm">{award}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {/* Artist's Exhibitions - More compact */}
            {artist.exhibitions && artist.exhibitions.length > 0 && (
              <div className="bg-white rounded-xl p-5 shadow-lg border border-stone-100">
                <h2 className="text-xl font-semibold mb-5 text-stone-800 flex items-center">
                  <Eye size={16} className="mr-2 text-amber-600" />
                  Exhibitions
                </h2>
                
                <ul className="space-y-3">
                  {artist.exhibitions.map((exhibition, index) => (
                    <li key={index} className="flex items-start group">
                      <div className="w-3 h-3 rounded-full bg-amber-400 flex items-center justify-center mr-3 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      </div>
                      <span className="text-stone-700 text-sm">{exhibition}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Collections - More compact */}
            {artist.collections && artist.collections.length > 0 && (
              <div className="bg-white rounded-xl p-5 shadow-lg border border-stone-100">
                <h2 className="text-xl font-semibold mb-5 text-stone-800 flex items-center">
                  <Heart size={16} className="mr-2 text-amber-600" />
                  Featured In Collections
                </h2>
                
                <ul className="space-y-2">
                  {artist.collections.map((collection, index) => (
                    <li key={index} className="text-stone-700 text-sm flex items-center">
                      <div className="w-2 h-2 rounded-full bg-amber-400 mr-2"></div>
                      <span>{collection}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
                
        {/* Artist's Products Section - Cleaner design */}
        <div className="mb-16 relative z-10">
          <div className="flex items-center mb-8">
            <div className="h-px flex-1 bg-stone-200"></div>
            <h2 className="text-2xl font-bold text-stone-800 px-4">Artworks For Sale</h2>
            <div className="h-px flex-1 bg-stone-200"></div>
          </div>
          
          {products && products.length > 0 ? (
            <div className="bg-white rounded-xl p-6 shadow-lg border border-stone-100">
              <ProductsGridView products={products} />
            </div>
          ) : (
            <div className="text-center py-16 bg-white/80 rounded-xl border border-dashed border-stone-300 shadow-lg">
              <svg className="mx-auto h-16 w-16 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              
              <p className="mt-4 text-stone-600 font-light">No artworks currently available from this artist.</p>
              <button className="mt-6 inline-block px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow transition-colors">
                Check back soon
              </button>
            </div>
          )}
        </div>
        
        {/* Commission Form Component */}
        {/* <CommissionForm artist={artist} /> */}

        <CommissionForm
          artist={{
            name: artist.name,
            email: artist.email,
            phone: artist.phone,
            location: artist.location,
          }}
        />

        {/* Portfolio Images Section - Improved grid */}
        {artist.portfolioImageUrls && artist.portfolioImageUrls.length > 0 && (
          <div className="mb-16 relative z-10">
            <div className="flex items-center mb-8">
              <div className="h-px flex-1 bg-stone-200"></div>
              <h2 className="text-2xl font-bold text-stone-800 px-4">Behind The Scenes</h2>
              <div className="h-px flex-1 bg-stone-200"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {artist.portfolioImageUrls.map((imageUrl, index) => (
                <div 
                  key={index} 
                  className="group relative rounded-lg overflow-hidden shadow-md aspect-square hover:shadow-lg transition-all"
                >
                  <Image
                    src={imageUrl}
                    alt={`${artist.name} behind the Scenes`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye size={20} className="text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials Section - Cleaner cards */}
        {artist.testimonials && artist.testimonials.length > 0 && (
          <div className="mb-16 relative z-10">
            <div className="flex items-center mb-8">
              <div className="h-px flex-1 bg-stone-200"></div>
              <h2 className="text-2xl font-bold text-stone-800 px-4">Client Testimonials</h2>
              <div className="h-px flex-1 bg-stone-200"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {artist.testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-lg p-5 shadow-md border border-stone-100">
                  <div className="text-amber-600/30 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 9 7.558V11a1 1 0 0 0 1 1h2Zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 3 7.558V11a1 1 0 0 0 1 1h2Z"/>
                    </svg>
                  </div>
                  
                  <div>
                    <p className="text-stone-600 italic text-sm mb-4">"{testimonial.content}"</p>
                    
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-medium text-xs">
                        {testimonial.name.split(' ').map(name => name[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium text-stone-800 text-sm">{testimonial.name}</h4>
                        {testimonial.location && (
                          <p className="text-xs text-stone-500">{testimonial.location}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Related Artists Section - Cleaner cards */}
        {artist.relatedArtists && artist.relatedArtists.length > 0 && (
          <div className="mb-16 relative z-10">
            <div className="flex items-center mb-8">
              <div className="h-px flex-1 bg-stone-200"></div>
              <h2 className="text-2xl font-bold text-stone-800 px-4">Discover Similar Artists</h2>
              <div className="h-px flex-1 bg-stone-200"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {artist.relatedArtists.map((relArtist, index) => (
                <Link 
                  key={index} 
                  href={`/artists/${relArtist.id}`}
                  className="group relative rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-all"
                >
                  <div className="aspect-square relative overflow-hidden">
                    {relArtist.imageUrl ? (
                      <Image
                        src={relArtist.imageUrl}
                        alt={relArtist.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-stone-100">
                        <Palette size={32} className="text-stone-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3">
                    <h3 className="font-medium text-stone-800 group-hover:text-amber-600 transition-colors truncate">{relArtist.name}</h3>
                    {relArtist.location && (
                      <p className="text-xs text-stone-500 flex items-center mt-1">
                        <MapPin size={10} className="mr-1" />
                        {relArtist.location}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Back to Artists Link */}
        <div className="text-center mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-amber-700 hover:text-amber-800 font-medium transition-colors text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Explore All Artists
          </Link>
        </div>
      </div>
    </main>
  );
}