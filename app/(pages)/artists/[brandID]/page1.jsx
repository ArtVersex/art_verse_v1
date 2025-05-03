import ProductsGridView from "@/app/components/Products";
import { getProductByBrand } from "@/lib/firestore/products/read_server";
import { getBrands } from "@/lib/firestore/brands/read_server";
import Image from "next/image";
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
  Wrench
} from "lucide-react";
import Link from "next/link";

export default async function ArtistPage({ params }) {
  const resolvedParams = await params;
  const artistId = resolvedParams.brandID;
  // Fetch artist details
  const artist = await getBrands({ id: artistId });

  
  // Fetch products by this artist
  const products = await getProductByBrand({ brandId: artistId });

  
  if (!artist) {
    return (
      <div className="max-w-7xl mx-auto p-5 md:p-10 text-center py-20">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Artist Not Found</h1>
        <p className="text-gray-600">The artist you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  // Format artist social media links
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
    <main className="max-w-7xl mx-auto p-5 md:p-10 relative">
      {/* Artistic Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      
      {/* Artist Profile Header */}
      <div className="mb-12 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Artist Profile Image */}
          <div className="relative">
            {artist.profileImageUrl ? (
              <div className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image 
                  src={artist.profileImageUrl} 
                  alt={artist.name} 
                  width={192} 
                  height={192} 
                  className="object-cover w-full h-full"
                />
                {artist.isVerified && (
                  <div className="absolute bottom-2 right-2 bg-blue-500 text-white rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                <Palette size={48} className="text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Artist Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block relative mb-2">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 relative z-10">
                {artist.name}
                {artist.isVerified && (
                  <span className="inline-block ml-2 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </h1>
              <div className="h-3 w-3/4 bg-purple-200 absolute bottom-1 left-0 -z-10 transform -rotate-1"></div>
            </div>
            
            {/* Artist quick info */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-3 mb-5">
              {artist.location && (
                <div className="flex items-center text-gray-600">
                  <MapPin size={16} className="mr-1" />
                  <span>{artist.location}</span>
                </div>
              )}
              
              {artist.yearStarted && (
                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-1" />
                  <span>Since {artist.yearStarted}</span>
                </div>
              )}
              
              {artist.specialties && artist.specialties.length > 0 && (
                <div className="flex items-center text-gray-600">
                  <Palette size={16} className="mr-1" />
                  <span>{artist.specialties.slice(0, 2).join(", ")}{artist.specialties.length > 2 && "..."}</span>
                </div>
              )}
            </div>
            
            {/* Social links */}
            <div className="flex gap-3 justify-center md:justify-start">
              {artist.socialMedia?.instagram && (
                <a 
                  href={formatSocialLink('instagram', artist.socialMedia.instagram)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <Instagram size={20} />
                </a>
              )}
              
              {artist.socialMedia?.twitter && (
                <a 
                  href={formatSocialLink('twitter', artist.socialMedia.twitter)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <Twitter size={20} />
                </a>
              )}
              
              {artist.socialMedia?.website && (
                <a 
                  href={formatSocialLink('website', artist.socialMedia.website)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <Globe size={20} />
                </a>
              )}
              
              {artist.email && (
                <a 
                  href={`mailto:${artist.email}`}
                  className="text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <Mail size={20} />
                </a>
              )}
              
              {artist.phone && (
                <a 
                  href={`tel:${artist.phone}`}
                  className="text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <Phone size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Banner Image - if available */}
      {artist.bannerImageUrl && (
        <div className="mb-12 relative rounded-2xl overflow-hidden shadow-lg h-64 md:h-80">
          <Image 
            src={artist.bannerImageUrl}
            alt={`${artist.name}'s banner`}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      {/* Artist Bio Section */}
      <div className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
              <FileText size={20} className="mr-2 text-purple-600" />
              About the Artist
            </h2>
            
            <div className="prose prose-purple max-w-none">
              <p className="text-gray-700 leading-relaxed">{artist.bio}</p>
              
              {artist.artistStatement && (
                <>
                  <h3 className="text-xl font-medium mt-6 mb-3 text-gray-800">Artist Statement</h3>
                  <p className="text-gray-700 leading-relaxed italic">{artist.artistStatement}</p>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Sidebar - Artist Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <Palette size={20} className="mr-2 text-purple-600" />
              Artist Details
            </h2>
            
            <div className="space-y-4">
              {/* Specialties */}
              {artist.specialties && artist.specialties.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <Palette size={14} className="mr-1" /> Specialties
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {artist.specialties.map((specialty, index) => (
                      <span 
                        key={index} 
                        className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full"
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
                  <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <Wrench size={14} className="mr-1" /> Mediums
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {artist.mediums.map((medium, index) => (
                      <span 
                        key={index} 
                        className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
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
                  <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                    <Book size={14} className="mr-1" /> Education
                  </h3>
                  <p className="text-gray-700">{artist.education}</p>
                </div>
              )}
              
              {/* Awards */}
              {artist.awards && artist.awards.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <Award size={14} className="mr-1" /> Awards
                  </h3>
                  <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                    {artist.awards.map((award, index) => (
                      <li key={index}>{award}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* Artist's Exhibitions */}
          {artist.exhibitions && artist.exhibitions.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Exhibitions</h2>
              <ul className="space-y-3">
                {artist.exhibitions.map((exhibition, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-purple-100 text-purple-800 rounded-full p-1 mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{exhibition}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Collections */}
          {artist.collections && artist.collections.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Featured In Collections</h2>
              <ul className="space-y-2">
                {artist.collections.map((collection, index) => (
                  <li key={index} className="text-gray-700 flex items-center">
                    <div className="w-1 h-1 bg-purple-500 rounded-full mr-2"></div>
                    {collection}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Portfolio Images Section */}
      {artist.portfolioImagesUrls && artist.portfolioImagesUrls.length > 0 && (
        <div className="mb-16 relative z-10">
          <div className="flex items-center mb-6">
            <div className="h-px flex-grow bg-gray-200"></div>
            <h2 className="text-2xl font-semibold text-gray-800 px-4">Artist Portfolio</h2>
            <div className="h-px flex-grow bg-gray-200"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {artist.portfolioImagesUrls.map((imageUrl, index) => (
              <div 
                key={index} 
                className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow aspect-square relative group"
              >
                <Image
                  src={imageUrl}
                  alt={`Portfolio work by ${artist.name}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Artist's Products Section */}
      <div className="mb-16 relative z-10">
        <div className="flex items-center mb-10">
          <div className="h-px flex-grow bg-gray-200"></div>
          <h2 className="text-3xl font-bold text-gray-800 px-4">Artworks For Sale</h2>
          <div className="h-px flex-grow bg-gray-200"></div>
        </div>
        
        {products && products.length > 0 ? (
          <div className="relative">
            {/* Decorative element */}
            <div className="absolute -top-6 -right-6 w-12 h-12 border-t-2 border-r-2 border-gray-200"></div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 border-b-2 border-l-2 border-gray-200"></div>
            
            <ProductsGridView products={products} />
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <p className="mt-4 text-gray-500 font-light text-lg italic">No artworks currently available from this artist.</p>
            <button className="mt-4 inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Be notified when new works arrive
            </button>
          </div>
        )}
      </div>
      
      {/* Artistic Footer Element */}
      <div className="w-full flex justify-center mb-12">
        <div className="flex space-x-3">
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </main>
  );
}