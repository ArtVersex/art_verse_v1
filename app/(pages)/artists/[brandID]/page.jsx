import ProductsGridView from "@/app/components/Products";
import { getProductByBrand } from "@/lib/firestore/products/read_server";
import { getBrands } from "@/lib/firestore/brands/read_server";
import Image from "next/image";
import BioSection from "./components/BioSection";

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
  // Fetch artist details
  const artist = await getBrands({ id: artistId });
  
  // Fetch products by this artist
  const products = await getProductByBrand({ brandId: artistId });

  // const [expandedSections, setExpandedSections] = useState({
  //     artist: false,
  //     artwork: false,
  //     display: false
  //   });
    
  

  // Function to toggle expansion state for a specific section
  const toggleExpanded = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Function to render text with optional "Read more" button
  const TruncatableText = ({ text, maxLength = 150, section }) => {
    // If no text or expanded or text is short enough, just render it
    if (!text || text.length <= maxLength || expandedSections[section]) {
      return <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: text || '' }} />;
    }
    
    // Otherwise, truncate and add "Read more" button
    const truncated = text.substring(0, maxLength) + '...';
    
    return (
      <div>
        <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: truncated }} />
        <button 
          onClick={() => toggleExpanded(section)}
          className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium transition duration-150 ease-in-out focus:outline-none focus:underline"
        >
          Read more
        </button>
      </div>
    );
  };



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
    <main className="relative">
      {/* Artistic Background Canvas */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-50 to-blue-50 opacity-80"></div>
      <div className="fixed inset-0 -z-10 bg-[url('/noise-pattern.png')] opacity-10"></div>
      
      {/* Animated Artistic Elements */}
      <div className="fixed -z-5 top-0 left-0 right-0 bottom-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-24 right-24 w-56 h-56 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-3000"></div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-12 relative z-10">
        {/* Paint Stroke Header Background */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-96 -z-1">
          <svg viewBox="0 0 1200 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-15">
            <path d="M0,100 C150,50 350,150 500,100 C650,50 800,150 1000,100 C1150,50 1200,100 1200,100 V300 H0 V100 Z" fill="url(#paint-gradient)" />
            <defs>
              <linearGradient id="paint-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9333ea" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Artist Profile Header */}
        <div className="mb-16 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start backdrop-blur-sm bg-white/40 p-8 rounded-2xl shadow-xl border border-white/50">
            {/* Artist Profile Image with Artistic Frame */}
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-br from-purple-600 via-indigo-500 to-pink-500 rounded-full opacity-70 blur-sm"></div>
              {artist.imageUrl ? (
                <div className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-lg relative z-10">
                  <Image 
                    src={artist.imageUrl} 
                    alt={artist.name} 
                    width={192} 
                    height={192} 
                    className="object-cover w-full h-full"
                  />
                  {/* artist.isVerified */}
                  {true && (
                    <div className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full p-1 shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center relative z-10">
                  <Palette size={48} className="text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Artist Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block relative mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900 relative z-10 tracking-tight">
                  {artist.name}
                  {artist.isVerified && (
                    <span className="inline-block ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </h1>
                <div className="h-3 w-3/4 bg-gradient-to-r from-purple-300 to-pink-300 absolute bottom-1 left-0 -z-1 transform -rotate-1 rounded-full"></div>
              </div>
              
              {/* Artist quick info */}
              <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-3 mb-5">
                {artist.location && (
                  <div className="flex items-center text-gray-600 bg-white/50 px-3 py-1 rounded-full shadow-sm backdrop-blur-sm">
                    <MapPin size={16} className="mr-1 text-purple-600" />
                    <span>{artist.location}</span>
                  </div>
                )}
                
                {artist.yearStarted && (
                  <div className="flex items-center text-gray-600 bg-white/50 px-3 py-1 rounded-full shadow-sm backdrop-blur-sm">
                    <Calendar size={16} className="mr-1 text-purple-600" />
                    <span>Since {artist.yearStarted}</span>
                  </div>
                )}
                
                {artist.specialties && artist.specialties.length > 0 && (
                  <div className="flex items-center text-gray-600 bg-white/50 px-3 py-1 rounded-full shadow-sm backdrop-blur-sm">
                    <Palette size={16} className="mr-1 text-purple-600" />
                    <span>{artist.specialties.slice(0, 2).join(", ")}{artist.specialties.length > 2 && "..."}</span>
                  </div>
                )}
              </div>
              
              {/* Social links */}
              <div className="flex gap-4 justify-center md:justify-start">
                {artist.socialMedia?.instagram && (
                  <a 
                    href={formatSocialLink('instagram', artist.socialMedia.instagram)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 transition-colors bg-white/70 p-2 rounded-full shadow-sm hover:shadow-md hover:scale-110 transition-all"
                  >
                    <Instagram size={20} />
                  </a>
                )}
                
                {artist.socialMedia?.twitter && (
                  <a 
                    href={formatSocialLink('twitter', artist.socialMedia.twitter)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 transition-colors bg-white/70 p-2 rounded-full shadow-sm hover:shadow-md hover:scale-110 transition-all"
                  >
                    <Twitter size={20} />
                  </a>
                )}
                
                {artist.socialMedia?.website && (
                  <a 
                    href={formatSocialLink('website', artist.socialMedia.website)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 transition-colors bg-white/70 p-2 rounded-full shadow-sm hover:shadow-md hover:scale-110 transition-all"
                  >
                    <Globe size={20} />
                  </a>
                )}
                
                {artist.email && (
                  <a 
                    href={`mailto:${artist.email}`}
                    className="text-purple-600 hover:text-purple-800 transition-colors bg-white/70 p-2 rounded-full shadow-sm hover:shadow-md hover:scale-110 transition-all"
                  >
                    <Mail size={20} />
                  </a>
                )}
                
                {artist.phone && (
                  <a 
                    href={`tel:${artist.phone}`}
                    className="text-purple-600 hover:text-purple-800 transition-colors bg-white/70 p-2 rounded-full shadow-sm hover:shadow-md hover:scale-110 transition-all"
                  >
                    <Phone size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Banner Image - with Artistic Overlay */}
        {artist.bannerImageUrl && (
          <div className="mb-16 relative rounded-2xl overflow-hidden shadow-2xl h-64 md:h-96 group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <Image 
              src={artist.bannerImageUrl}
              alt={`${artist.name}'s banner`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute bottom-6 left-6 text-white">
              <div className="w-16 h-1 bg-white/70 rounded-full mb-4"></div>
              <p className="text-xl font-light italic tracking-wider">"{artist.tagline || 'Art gives soul to the universe'}"</p>
            </div>
          </div>
        )}
        
        {/* Artist Bio Section */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-purple-600/30 via-indigo-500/30 to-pink-500/30 rounded-2xl blur-sm"></div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-white/50 relative">
                <div className="absolute top-4 right-4 text-purple-600/20">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
                  <FileText size={20} className="mr-2 text-purple-600" />
                  <span className="relative">
                    About the Artist
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-transparent"></span>
                  </span>
                </h2>
                
                <div className="prose prose-purple max-w-none">
                <BioSection bio={artist.bio} artistStatement={artist.artistStatement} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar - Artist Details */}
          <div className="lg:col-span-1">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-indigo-600/30 via-purple-500/30 to-pink-500/30 rounded-2xl blur-sm"></div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/50 relative">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                  <Sparkles size={18} className="mr-2 text-purple-600" />
                  <span className="relative">
                    Artist Details
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-transparent"></span>
                  </span>
                </h2>
                
                <div className="space-y-6">
                  {/* Specialties */}
                  {artist.specialties && artist.specialties.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                        <Palette size={14} className="mr-1 text-purple-500" /> Specialties
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {artist.specialties.map((specialty, index) => (
                          <span 
                            key={index} 
                            className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 text-xs px-3 py-1 rounded-full border border-purple-200 shadow-sm"
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
                      <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                        <Wrench size={14} className="mr-1 text-purple-500" /> Mediums
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {artist.mediums.map((medium, index) => (
                          <span 
                            key={index} 
                            className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs px-3 py-1 rounded-full border border-blue-200 shadow-sm"
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
                      <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                        <Book size={14} className="mr-1 text-purple-500" /> Education
                      </h3>
                      <p className="text-gray-700 bg-white/60 p-2 rounded-lg">{artist.education}</p>
                    </div>
                  )}
                  
                  {/* Awards */}
                  {artist.awards && artist.awards.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                        <Award size={14} className="mr-1 text-purple-500" /> Awards
                      </h3>
                      <ul className="space-y-2">
                        {artist.awards.map((award, index) => (
                          <li key={index} className="flex items-start">
                            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-white text-xs mr-2 mt-0.5 shadow-sm">
                              {index + 1}
                            </div>
                            <span className="text-gray-700">{award}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Artist's Exhibitions */}
            {artist.exhibitions && artist.exhibitions.length > 0 && (
              <div className="relative mt-8">
                <div className="absolute -inset-1 bg-gradient-to-br from-pink-600/30 via-purple-500/30 to-indigo-500/30 rounded-2xl blur-sm"></div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/50 relative">
                  <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                    <Eye size={18} className="mr-2 text-purple-600" />
                    <span className="relative">
                      Exhibitions
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-transparent"></span>
                    </span>
                  </h2>
                  
                  <ul className="space-y-4">
                    {artist.exhibitions.map((exhibition, index) => (
                      <li key={index} className="flex items-start group">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mr-3 mt-1 group-hover:scale-110 transition-transform">
                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        </div>
                        <span className="text-gray-700 group-hover:text-purple-800 transition-colors">{exhibition}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Collections */}
            {artist.collections && artist.collections.length > 0 && (
              <div className="relative mt-8">
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-600/30 via-indigo-500/30 to-purple-500/30 rounded-2xl blur-sm"></div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/50 relative">
                  <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                    <Heart size={18} className="mr-2 text-purple-600" />
                    <span className="relative">
                      Featured In Collections
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-transparent"></span>
                    </span>
                  </h2>
                  
                  <ul className="space-y-3">
                    {artist.collections.map((collection, index) => (
                      <li key={index} className="text-gray-700 flex items-center group">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 mr-3 group-hover:scale-150 transition-transform"></div>
                        <span className="group-hover:text-purple-800 transition-colors">{collection}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
                
        {/* Artist's Products Section */}
        <div className="mb-20 relative z-10">
          <div className="flex items-center mb-10">
            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
            {/* <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 px-6">Artworks For Sale</h2> */}
            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
          </div>
          
          {products && products.length > 0 ? (
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-20 h-20 border-t-2 border-r-2 border-purple-200 rounded-tr-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-20 h-20 border-b-2 border-l-2 border-purple-200 rounded-bl-3xl"></div>
              
              <div className="backdrop-blur-sm bg-white/30 p-8 rounded-2xl shadow-lg border border-white/50">
                <ProductsGridView products={products} />
              </div>
            </div>
          ) : (
            <div className="text-center py-24 backdrop-blur-sm bg-white/30 rounded-2xl border border-dashed border-purple-300 shadow-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 mix-blend-multiply"></div>
              
              <svg className="mx-auto h-20 w-20 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              
              <p className="mt-6 text-purple-800 font-light text-xl italic">No artworks currently available from this artist.</p>
              <button className="mt-6 inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-full shadow-lg transform transition-all hover:scale-105 hover:shadow-xl">
                <span className="relative inline-block">
                  Check back soon
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/70"></span>
                </span>
              </button>
            </div>
          )}
        </div>
        
        {/* Contact/Commission Section */}
        <div className="mb-20 relative z-10">
          <div className="flex items-center mb-10">
            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-pink-300 to-transparent"></div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-700 to-purple-600 px-6">Commission the Artist</h2>
            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-pink-300 to-transparent"></div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-br from-pink-600/30 via-purple-500/30 to-indigo-500/30 rounded-2xl blur-md"></div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-white/50 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Get in Touch</h3>
                  <p className="text-gray-700 mb-6">Interested in commissioning {artist.name} for a custom artwork? Fill out the form to start a conversation about your vision.</p>
                  
                  <div className="space-y-4">
                    {artist.email && (
                      <div className="flex items-start">
                        <div className="bg-purple-100 p-2 rounded-lg text-purple-700 mr-4">
                          <Mail size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Email</h4>
                          <a href={`mailto:${artist.email}`} className="text-purple-700 hover:text-purple-900 transition-colors">{artist.email}</a>
                        </div>
                      </div>
                    )}
                    
                    {artist.phone && (
                      <div className="flex items-start">
                        <div className="bg-purple-100 p-2 rounded-lg text-purple-700 mr-4">
                          <Phone size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                          <a href={`tel:${artist.phone}`} className="text-purple-700 hover:text-purple-900 transition-colors">{artist.phone}</a>
                        </div>
                      </div>
                    )}
                    
                    {artist.location && (
                      <div className="flex items-start">
                        <div className="bg-purple-100 p-2 rounded-lg text-purple-700 mr-4">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Location</h4>
                          <p className="text-gray-700">{artist.location}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="text-lg font-medium text-gray-800 mb-3">Commission Process</h4>
                    <ol className="space-y-3">
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white text-xs mr-3">1</div>
                        <span className="text-gray-700">Initial consultation to discuss your vision</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white text-xs mr-3">2</div>
                        <span className="text-gray-700">Concept sketches and approval</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white text-xs mr-3">3</div>
                        <span className="text-gray-700">Creation of the artwork with progress updates</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white text-xs mr-3">4</div>
                        <span className="text-gray-700">Final review, delivery and installation</span>
                      </li>
                    </ol>
                  </div>
                </div>
                
                {/* Contact Form */}
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Commission Request</h3>
                  
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input 
                          type="text" 
                          id="name" 
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                          type="email" 
                          id="email" 
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <input 
                        type="text" 
                        id="subject" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Commission Request"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">Budget Range (USD)</label>
                      <select 
                        id="budget" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select a budget range</option>
                        <option value="<500">Less than $500</option>
                        <option value="500-1000">$500 - $1,000</option>
                        <option value="1000-2500">$1,000 - $2,500</option>
                        <option value="2500-5000">$2,500 - $5,000</option>
                        <option value=">5000">$5,000+</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Vision</label>
                      <textarea 
                        id="message" 
                        rows="5" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Describe what you're looking for..."
                      ></textarea>
                    </div>
                    
                    <div className="pt-2">
                      <button 
                        type="submit" 
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-lg shadow-lg transform transition-all hover:scale-105"
                      >
                        Send Request
                      </button>
                      <p className="text-xs text-gray-500 mt-2 text-center">You'll receive a response within 48 hours</p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

                {/* Portfolio Images Section - with Artistic Gallery Effect */}
      {artist.portfolioImageUrls && artist.portfolioImageUrls.length > 0 && (
          <div className="mb-20 relative z-10">
            <div className="flex items-center mb-10">
              <div className="h-px flex-grow bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600 px-6">Behind The Scenes</h2>
              <div className="h-px flex-grow bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {artist.portfolioImageUrls.map((imageUrl, index) => (
                <div 
                  key={index} 
                  className="group relative rounded-xl overflow-hidden shadow-lg aspect-square hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                  <Image
                    src={imageUrl}
                    alt={`${artist.name} behind the Scenes`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center text-purple-700">
                      <Eye size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        
        {/* Testimonials Section */}
        {artist.testimonials && artist.testimonials.length > 0 && (
          <div className="mb-20 relative z-10">
            <div className="flex items-center mb-10">
              <div className="h-px flex-grow bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 px-6">Client Testimonials</h2>
              <div className="h-px flex-grow bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artist.testimonials.map((testimonial, index) => (
                <div key={index} className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-br from-purple-600/30 via-indigo-500/30 to-pink-500/30 rounded-2xl blur-sm"></div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/50 relative">
                    <div className="absolute -top-4 -left-4 text-purple-600/20 transform -rotate-12">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 9 7.558V11a1 1 0 0 0 1 1h2Zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 3 7.558V11a1 1 0 0 0 1 1h2Z"/>
                      </svg>
                    </div>
                    
                    <div className="pt-6">
                      <p className="text-gray-700 italic">{testimonial.content}</p>
                      
                      <div className="mt-6 flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-medium text-sm">
                          {testimonial.name.split(' ').map(name => name[0]).join('')}
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium text-gray-800">{testimonial.name}</h4>
                          {testimonial.location && (
                            <p className="text-sm text-gray-500">{testimonial.location}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Related Artists Section */}
        {artist.relatedArtists && artist.relatedArtists.length > 0 && (
          <div className="mb-20 relative z-10">
            <div className="flex items-center mb-10">
              <div className="h-px flex-grow bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600 px-6">Discover Similar Artists</h2>
              <div className="h-px flex-grow bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {artist.relatedArtists.map((relArtist, index) => (
                <Link 
                  key={index} 
                  href={`/artists/${relArtist.id}`}
                  className="group relative rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                  
                  <div className="aspect-square relative overflow-hidden">
                    {relArtist.imageUrl ? (
                      <Image
                        src={relArtist.imageUrl}
                        alt={relArtist.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
                        <Palette size={48} className="text-purple-300" />
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white z-20 opacity-100 group-hover:opacity-100 transition-opacity transform translate-y-0 group-hover:translate-y-0">
                    <h3 className="font-medium text-lg truncate">{relArtist.name}</h3>
                    {relArtist.location && (
                      <p className="text-sm text-white/80 flex items-center mt-1">
                        <MapPin size={12} className="mr-1" />
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
        <div className="text-center mb-10">
          <Link 
            href="/" 
            className="inline-flex items-center text-purple-700 hover:text-purple-900 font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Explore All Artists
          </Link>
        </div>
      </div>
    </main>
  );
}