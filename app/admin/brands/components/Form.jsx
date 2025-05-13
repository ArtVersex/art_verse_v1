"use client";
import {
    UploadCloud,
    User,
    Mail,
    Phone,
    MapPin,
    Instagram,
    Twitter,
    Globe,
    FileText,
    Calendar,
    Award,
    Palette,
    Layers,
    Book,
    Image as ImageIcon,
    Wrench,
    X,
    Trash2
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback  } from "react";
import toast from "react-hot-toast";
import Spinner from "../../spinner";
import { createNewBrand, updateBrand, deletePortfolioImage } from "@/lib/firestore/brands/write";
import { getBrands } from "@/lib/firestore/brands/read_server";

export default function VisualArtistForm() {
    const [data, setData] = useState({
        name: "",
        bio: "",
        specialties: [], // painting, sculpture, printmaking, mixed media, etc.
        mediums: [], // oil, acrylic, watercolor, bronze, marble, etc.
        email: "",
        phone: "",
        location: "",
        yearStarted: "",
        education: "",
        artistStatement: "",
        socialMedia: {
            instagram: "",
            twitter: "",
            website: "",
            artstation: "",
            behance: ""
        },
        exhibitions: [], // past exhibitions
        collections: [], // museums or collections featuring their work
        awards: [], // awards and recognitions
        isVerified: false,
        portfolioImageUrls: [] // Add this to hold existing portfolio images
    });

    const [profileImage, setProfileImage] = useState();
    const [profileImagePreview, setProfileImagePreview] = useState(); // Preview for profile image
    const [bannerImage, setBannerImage] = useState();
    const [bannerImagePreview, setBannerImagePreview] = useState(); // Preview for banner image
    const [portfolioImages, setPortfolioImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeletingImage, setIsDeletingImage] = useState(false);

    // For managing array inputs
    const [currentSpecialty, setCurrentSpecialty] = useState("");
    const [currentMedium, setCurrentMedium] = useState("");
    const [currentExhibition, setCurrentExhibition] = useState("");
    const [currentCollection, setCurrentCollection] = useState("");
    const [currentAward, setCurrentAward] = useState("");

    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();

    // Options for common artist specialties and mediums
    const specialtyOptions = [
        // Traditional Fine Arts
        "Painting", "Sculpture", "Printmaking", "Drawing", "Mixed Media",
    
        // Contemporary & Conceptual Arts
        "Installation", "Digital Art", "Photography",
    
        // Material & Craft-Based Arts
        "Ceramics", "Textile Art", "Other"
    ];
    
    const mediumOptions = [
        // Traditional Painting & Drawing
        "Oil", "Acrylic", "Watercolor", "Charcoal", "Pencil", "Ink", "Collage",
        "Pastel", "Gouache", "Encaustic", "Fresco", "Tempera", "Spray Paint", "Mosaic",
        "Airbrush", "Ink Wash", "Marker", "Crayon", "Colored Pencil", "Digital Painting",
    
        // Sculpture & Material-Based Art
        "Bronze", "Marble", "Clay", "Wood", "Steel", "Mixed Media", "Digital", "Other",
        "3D Printing", "Glass", "Stone", "Plaster", "Found Object", "Assemblage",
        "Metal", "Fabric", "Paper", "Plastic", "Wax", "Resin", "Ceramic",
        "Fiberglass", "Concrete", "Stoneware", "Porcelain", "Alabaster",
    
        // Printmaking Techniques
        "Lithography", "Serigraphy", "Etching", "Mezzotint", "Woodcut", "Linocut",
        "Collography", "Drypoint", "Aquatint", "Intaglio", "Relief Printing", "Engraving",
        "Screen Printing", "Monotype", "Monoprint", "Digital Printmaking", "Photo Etching",
        "Giclee", "Block Printing", "Stenciling", "Letterpress", "Offset Printing",
        "Stamping", "Embossing", "Platography",
    
        // Experimental & Alternative Processes
        "Platinotype", "Gum Bichromate Printing", "Photogravure", "Paper Pulp",
        "Viscosity", "Wood Engraving",
    
        // Natural & Light-Based Printing
        "Cyanotype", "Anthotype Printing", "Chlorophyll Printing"
    ];
// Replace the existing fetchdata function with this one


const fetchdata = useCallback(async () => {
    try {
        setIsLoading(true);
        const res = await getBrands({ id: id });
        if (!res) {
            toast.error("Artist Not Found!");
            return;
        }
        
        console.log("Fetched artist data:", res);
        
        // Ensure the data has the expected structure
        const formattedData = {
            ...res,
            specialties: res.specialties || [],
            mediums: res.mediums || [],
            socialMedia: res.socialMedia || {
                instagram: "",
                twitter: "",
                website: "",
                artstation: "",
                behance: ""
            },
            exhibitions: res.exhibitions || [],
            collections: res.collections || [],
            awards: res.awards || [],
            portfolioImageUrls: res.portfolioImageUrls || []
        };
        setData(formattedData);
        
        // Set image previews using existing URLs
        if (res.imageUrl) {
            setProfileImagePreview(res.imageUrl);
            console.log("Setting profile image preview:", res.imageUrl);
        }
        
        if (res.bannerImageUrl) {
            setBannerImagePreview(res.bannerImageUrl);
            console.log("Setting banner image preview:", res.bannerImageUrl);
        }
        
        // Log portfolio images for debugging
        if (res.portfolioImageUrls && res.portfolioImageUrls.length > 0) {
            console.log("Portfolio images loaded:", res.portfolioImageUrls.length);
        }
    } catch (error) {
        console.error("Error fetching artist data:", error);
        toast.error(error.message || "Failed to load artist data");
    } finally {
        setIsLoading(false);
    }
}, [id]);

// Use effect with proper dependencies
useEffect(() => {
    if (id) {
        console.log("Loading artist with ID:", id);
        fetchdata();
    } else {
        // Reset form when creating a new artist
        setData({
            name: "",
            bio: "",
            specialties: [],
            mediums: [],
            email: "",
            phone: "",
            location: "",
            yearStarted: "",
            education: "",
            artistStatement: "",
            socialMedia: {
                instagram: "",
                twitter: "",
                website: "",
                artstation: "",
                behance: ""
            },
            exhibitions: [],
            collections: [],
            awards: [],
            isVerified: false,
            portfolioImageUrls: []
        });
        setProfileImagePreview(null);
        setBannerImagePreview(null);
        setPortfolioImages([]);
    }
}, [id, fetchdata]);

    const handleData = (key, value) => {
        if (key.includes('.')) {
            // Handle nested properties like socialMedia.instagram
            const [parent, child] = key.split('.');
            setData((prevData) => ({
                ...(prevData ?? {}),
                [parent]: {
                    ...(prevData?.[parent] || {}),
                    [child]: value
                }
            }));
        } else {
            setData((prevData) => ({
                ...(prevData ?? {}),
                [key]: value,
            }));
        }
    };

    const handleFileChange = (e, setter, previewSetter) => {
        const file = e.target.files[0];
        if (file) {
            setter(file);
            // Create and set the preview
            const objectUrl = URL.createObjectURL(file);
            previewSetter(objectUrl);
        }
    };

    const handleMultipleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setPortfolioImages((prev) => [...prev, ...files]);
        }
    };

    const removePortfolioImage = (index) => {
        setPortfolioImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleDeleteExistingImage = async (imageUrl) => {
        if (!id || !imageUrl) return;
        
        try {
            setIsDeletingImage(true);
            await deletePortfolioImage(id, imageUrl);
            
            // Update state by removing the deleted image
            setData(prevData => ({
                ...prevData,
                portfolioImageUrls: prevData.portfolioImageUrls.filter(url => url !== imageUrl)
            }));
            
            toast.success("Image deleted successfully");
        } catch (error) {
            toast.error("Failed to delete image: " + error.message);
        } finally {
            setIsDeletingImage(false);
        }
    };

    // Helper functions for managing array fields
    const addItem = (item, array, setter, resetState) => {
        if (item && !array.includes(item)) {
            setter([...array, item]);
            resetState("");
        }
    };

    const removeItem = (itemToRemove, array, setter) => {
        setter(array.filter(item => item !== itemToRemove));
    };

    const handleCreate = async () => {
        try {
            setIsLoading(true);
            await createNewBrand({
                data,
                profileImage,
                bannerImage,
                portfolioImages
            });
            toast.success("Artist successfully created!");
            router.push('/admin/brands');
        } catch (error) {
            toast.error(error?.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            setIsLoading(true);
            await updateBrand({
                data,
                profileImage,
                bannerImage,
                portfolioImages
            });
            toast.success("Artist Successfully Updated!");
            router.push('/admin/brands');
        } catch (error) {
            toast.error(error?.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    // UI helper for tag-like items
    const ItemTag = ({ item, onRemove }) => (
        <div className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            {item}
            <button type="button" onClick={onRemove} className="ml-2 text-blue-700 hover:text-blue-900">
                &times;
            </button>
        </div>
    );

    return (
        <div className="flex flex-col gap-5 bg-white rounded-xl p-7 w-full md:w-[800px] shadow-md">
            <header className="flex items-center gap-3 border-b pb-4">
                <Palette size={28} className="text-purple-600" />
                <h1 className="font-bold text-2xl text-gray-800">{id ? "Update" : "Create"} Visual Artist Profile</h1>
            </header>

            {isLoading && !portfolioImages ? (
                <div className="flex justify-center items-center p-10">
                    <Spinner size={8} />
                    <p className="ml-3 text-gray-600">Loading artist data...</p>
                </div>
            ) : (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (id) {
                            handleUpdate();
                        } else {
                            handleCreate();
                        }
                    }}
                    className="flex flex-col gap-6"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="flex flex-col gap-6">
                            {/* Profile Image Upload */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="profile-image" className="text-gray-700 font-medium flex items-center gap-2">
                                    <User size={18} /> Profile Image <span className="text-red-500">*</span>
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-all cursor-pointer">
                                    <div className="flex flex-col items-center gap-2 text-center">
                                        <UploadCloud size={36} className="text-purple-500" />
                                        <label htmlFor="profile-image" className="cursor-pointer text-purple-600 font-medium">
                                            {profileImage ? profileImage.name : "Upload artist profile photo"}
                                        </label>
                                        <p className="text-sm text-gray-500">Recommended: Square image, 400x400px</p>
                                        <input
                                            id="profile-image"
                                            name="profile-image"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleFileChange(e, setProfileImage, setProfileImagePreview)}
                                        />
                                    </div>

                                    {/* Image Preview */}
                                    {profileImagePreview && (
                                        <div className="flex justify-center items-center mt-3">
                                            <div className="relative group">
                                                <img
                                                    src={profileImagePreview}
                                                    alt="Profile Preview"
                                                    className="h-24 w-24 rounded-full object-cover border-2 border-purple-200"
                                                />
                                                {profileImage && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setProfileImage(null);
                                                            setProfileImagePreview(data.imageUrl);
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Banner Image Upload */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="banner-image" className="text-gray-700 font-medium flex items-center gap-2">
                                    <ImageIcon size={18} /> Banner Image
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-all cursor-pointer">
                                    <div className="flex flex-col items-center gap-2 text-center">
                                        <UploadCloud size={36} className="text-purple-500" />
                                        <label htmlFor="banner-image" className="cursor-pointer text-purple-600 font-medium">
                                            {bannerImage ? bannerImage.name : "Upload artist banner image"}
                                        </label>
                                        <p className="text-sm text-gray-500">Recommended: 1200x400px</p>
                                        <input
                                            id="banner-image"
                                            name="banner-image"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleFileChange(e, setBannerImage, setBannerImagePreview)}
                                        />
                                    </div>

                                    {/* Banner Preview */}
                                    {bannerImagePreview && (
                                        <div className="flex justify-center items-center mt-3">
                                            <div className="relative group w-full">
                                                <img
                                                    src={bannerImagePreview}
                                                    alt="Banner Preview"
                                                    className="h-24 w-full object-cover rounded-lg border-2 border-purple-200"
                                                />
                                                {bannerImage && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setBannerImage(null);
                                                            setBannerImagePreview(data.bannerImageUrl);
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="flex flex-col gap-4 p-5 bg-gray-50 rounded-lg border border-gray-100">
                                <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                                    <User size={18} /> Basic Information
                                </h2>

                                {/* Name Field */}
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="artist-name" className="text-gray-600 text-sm font-medium">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="artist-name"
                                        name="artist-name"
                                        type="text"
                                        placeholder="Enter artist's full name"
                                        value={data?.name ?? ""}
                                        onChange={(e) => handleData("name", e.target.value)}
                                        className="border border-gray-300 px-4 py-2 rounded-lg w-full
                                        focus:outline-none focus:ring-2 focus:ring-purple-400"
                                        required
                                    />
                                </div>

                                {/* Email & Phone Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="artist-email" className="text-gray-600 text-sm font-medium flex items-center gap-1">
                                            <Mail size={14} /> Email
                                        </label>
                                        <input
                                            id="artist-email"
                                            name="artist-email"
                                            type="email"
                                            placeholder="artist@example.com"
                                            value={data?.email ?? ""}
                                            onChange={(e) => handleData("email", e.target.value)}
                                            className="border border-gray-300 px-4 py-2 rounded-lg w-full
                                            focus:outline-none focus:ring-2 focus:ring-purple-400"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="artist-phone" className="text-gray-600 text-sm font-medium flex items-center gap-1">
                                            <Phone size={14} /> Phone
                                        </label>
                                        <input
                                            id="artist-phone"
                                            name="artist-phone"
                                            type="tel"
                                            placeholder="+1 (555) 123-4567"
                                            value={data?.phone ?? ""}
                                            onChange={(e) => handleData("phone", e.target.value)}
                                            className="border border-gray-300 px-4 py-2 rounded-lg w-full
                                            focus:outline-none focus:ring-2 focus:ring-purple-400"
                                        />
                                    </div>
                                </div>

                                {/* Location & Year Started */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="artist-location" className="text-gray-600 text-sm font-medium flex items-center gap-1">
                                            <MapPin size={14} /> Location
                                        </label>
                                        <input
                                            id="artist-location"
                                            name="artist-location"
                                            type="text"
                                            placeholder="City, Country"
                                            value={data?.location ?? ""}
                                            onChange={(e) => handleData("location", e.target.value)}
                                            className="border border-gray-300 px-4 py-2 rounded-lg w-full
                                            focus:outline-none focus:ring-2 focus:ring-purple-400"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="artist-year" className="text-gray-600 text-sm font-medium flex items-center gap-1">
                                            <Calendar size={14} /> Year Started
                                        </label>
                                        <input
                                            id="artist-year"
                                            name="artist-year"
                                            type="number"
                                            min="1900"
                                            max="2025"
                                            placeholder="e.g. 2010"
                                            value={data?.yearStarted ?? ""}
                                            onChange={(e) => handleData("yearStarted", e.target.value)}
                                            className="border border-gray-300 px-4 py-2 rounded-lg w-full
                                            focus:outline-none focus:ring-2 focus:ring-purple-400"
                                        />
                                    </div>
                                </div>

                                {/* Education */}
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="artist-education" className="text-gray-600 text-sm font-medium flex items-center gap-1">
                                        <Book size={14} /> Education
                                    </label>
                                    <input
                                        id="artist-education"
                                        name="artist-education"
                                        type="text"
                                        placeholder="e.g. MFA Fine Arts, University of Arts, 2015"
                                        value={data?.education ?? ""}
                                        onChange={(e) => handleData("education", e.target.value)}
                                        className="border border-gray-300 px-4 py-2 rounded-lg w-full
                                        focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="flex flex-col gap-6">
                            {/* Artist Bio */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="artist-bio" className="text-gray-700 font-medium flex items-center gap-2">
                                    <FileText size={18} /> Artist Biography <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="artist-bio"
                                    name="artist-bio"
                                    placeholder="Brief biography about the artist"
                                    value={data?.bio ?? ""}
                                    onChange={(e) => handleData("bio", e.target.value)}
                                    className="border border-gray-300 px-4 py-2 rounded-lg w-full h-32
                                    focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    required
                                />
                            </div>

                            {/* Artist Statement */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="artist-statement" className="text-gray-700 font-medium flex items-center gap-2">
                                    <FileText size={18} /> Artist Statement
                                </label>
                                <textarea
                                    id="artist-statement"
                                    name="artist-statement"
                                    placeholder="The artist's statement about their work and creative philosophy"
                                    value={data?.artistStatement ?? ""}
                                    onChange={(e) => handleData("artistStatement", e.target.value)}
                                    className="border border-gray-300 px-4 py-2 rounded-lg w-full h-32
                                    focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                            </div>

                            {/* Specialties & Mediums */}
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-1">
                                {/* Specialties */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-700 font-medium flex items-center gap-2">
                                        <Palette size={18} /> Specialties <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={currentSpecialty}
                                            onChange={(e) => setCurrentSpecialty(e.target.value)}
                                            className="border border-gray-300 px-3 py-2 rounded-lg flex-grow
                                            focus:outline-none focus:ring-2 focus:ring-purple-400"
                                        >
                                            <option value="">Select a specialty</option>
                                            {specialtyOptions.map(option => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => addItem(currentSpecialty, data.specialties, (newSpecialties) => handleData("specialties", newSpecialties), setCurrentSpecialty)}
                                            className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {data.specialties?.map((specialty, index) => (
                                            <ItemTag
                                                key={index}
                                                item={specialty}
                                                onRemove={() => removeItem(specialty, data.specialties, (newSpecialties) => handleData("specialties", newSpecialties))}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Mediums */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-700 font-medium flex items-center gap-2">
                                        <Wrench size={18} /> Mediums <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={currentMedium}
                                            onChange={(e) => setCurrentMedium(e.target.value)}
                                            className="border border-gray-300 px-3 py-2 rounded-lg flex-grow
                                            focus:outline-none focus:ring-2 focus:ring-purple-400"
                                        >
                                            <option value="">Select a medium</option>
                                            {mediumOptions.map(option => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => addItem(currentMedium, data.mediums, (newMediums) => handleData("mediums", newMediums), setCurrentMedium)}
                                            className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {data.mediums?.map((medium, index) => (
                                            <ItemTag
                                                key={index}
                                                item={medium}
                                                onRemove={() => removeItem(medium, data.mediums, (newMediums) => handleData("mediums", newMediums))}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Social Media Section */}
                            <div className="flex flex-col gap-4 p-5 bg-gray-50 rounded-lg border border-gray-100">
                                <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                                    <Globe size={18} /> Social Media & Web Presence
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Website */}
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="website" className="text-gray-600 text-sm font-medium flex items-center gap-1">
                                            <Globe size={14} /> Website
                                        </label>
                                        <input
                                            id="website"
                                            type="url"
                                            placeholder="https://www.yourwebsite.com"
                                            value={data?.socialMedia?.website ?? ""}
                                            onChange={(e) => handleData("socialMedia.website", e.target.value)}
                                            className="border border-gray-300 px-4 py-2 rounded-lg w-full
                                            focus:outline-none focus:ring-2 focus:ring-purple-400"
                                        />
                                    </div>

                                    {/* Instagram */}
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="instagram" className="text-gray-600 text-sm font-medium flex items-center gap-1">
                                            <Instagram size={14} /> Instagram
                                        </label>
                                        <input
                                            id="instagram"
                                            type="text"
                                            placeholder="@username"
                                            value={data?.socialMedia?.instagram ?? ""}
                                            onChange={(e) => handleData("socialMedia.instagram", e.target.value)}
                                            className="border border-gray-300 px-4 py-2 rounded-lg w-full
                                            focus:outline-none focus:ring-2 focus:ring-purple-400"
                                        />
                                    </div>

                                    {/* Twitter */}
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="twitter" className="text-gray-600 text-sm font-medium flex items-center gap-1">
                                            <Twitter size={14} /> Twitter
                                        </label>
                                        <input
                                            id="twitter"
                                            type="text"
                                            placeholder="@username"
                                            value={data?.socialMedia?.twitter ?? ""}
                                            onChange={(e) => handleData("socialMedia.twitter", e.target.value)}
                                            className="border border-gray-300 px-4 py-2 rounded-lg w-full
                                            focus:outline-none focus:ring-2 focus:ring-purple-400"
                                        />
                                    </div>

                                    {/* Artstation */}
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="artstation" className="text-gray-600 text-sm font-medium flex items-center gap-1">
                                            <Globe size={14} /> Artstation
                                        </label>
                                        <input
                                            id="artstation"
                                            type="text"
                                            placeholder="Artstation profile URL"
                                            value={data?.socialMedia?.artstation ?? ""}
                                            onChange={(e) => handleData("socialMedia.artstation", e.target.value)}
                                            className="border border-gray-300 px-4 py-2 rounded-lg w-full
                                            focus:outline-none focus:ring-2 focus:ring-purple-400"
                                        />
                                    </div>

                                    {/* Behance */}
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="behance" className="text-gray-600 text-sm font-medium flex items-center gap-1">
                                            <Globe size={14} /> Behance
                                        </label>
                                        <input
                                            id="behance"
                                            type="text"
                                            placeholder="Behance profile URL"
                                            value={data?.socialMedia?.behance ?? ""}
                                            onChange={(e) => handleData("socialMedia.behance", e.target.value)}
                                            className="border border-gray-300 px-4 py-2 rounded-lg w-full
                                            focus:outline-none focus:ring-2 focus:ring-purple-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Sections - Full Width */}
                    <div className="flex flex-col gap-6 mt-2">
                        {/* Exhibitions */}
                        <div className="flex flex-col gap-4 p-5 bg-gray-50 rounded-lg border border-gray-100">
                            <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                                <Calendar size={18} /> Exhibitions
                            </h2>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Add exhibition details (e.g. 'Solo Show at Gallery X, New York, 2023')"
                                    value={currentExhibition}
                                    onChange={(e) => setCurrentExhibition(e.target.value)}
                                    className="border border-gray-300 px-4 py-2 rounded-lg flex-grow
                                    focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => addItem(currentExhibition, data.exhibitions, (newExhibitions) => handleData("exhibitions", newExhibitions), setCurrentExhibition)}
                                    className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-col gap-2 mt-2">
                                {data.exhibitions?.map((exhibition, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                                        <span>{exhibition}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(exhibition, data.exhibitions, (newExhibitions) => handleData("exhibitions", newExhibitions))}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                                {data.exhibitions?.length === 0 && (
                                    <p className="text-sm text-gray-500 italic">No exhibitions added yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Collections */}
                        <div className="flex flex-col gap-4 p-5 bg-gray-50 rounded-lg border border-gray-100">
                            <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                                <Layers size={18} /> Collections & Museums
                            </h2>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Add collection details (e.g. 'MoMA Permanent Collection, New York')"
                                    value={currentCollection}
                                    onChange={(e) => setCurrentCollection(e.target.value)}
                                    className="border border-gray-300 px-4 py-2 rounded-lg flex-grow
                                    focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => addItem(currentCollection, data.collections, (newCollections) => handleData("collections", newCollections), setCurrentCollection)}
                                    className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-col gap-2 mt-2">
                                {data.collections?.map((collection, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                                        <span>{collection}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(collection, data.collections, (newCollections) => handleData("collections", newCollections))}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                                {data.collections?.length === 0 && (
                                    <p className="text-sm text-gray-500 italic">No collections added yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Awards */}
                        <div className="flex flex-col gap-4 p-5 bg-gray-50 rounded-lg border border-gray-100">
                            <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                                <Award size={18} /> Awards & Recognitions
                            </h2>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Add award details (e.g. 'First Prize, International Art Competition, 2022')"
                                    value={currentAward}
                                    onChange={(e) => setCurrentAward(e.target.value)}
                                    className="border border-gray-300 px-4 py-2 rounded-lg flex-grow
                                    focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => addItem(currentAward, data.awards, (newAwards) => handleData("awards", newAwards), setCurrentAward)}
                                    className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-col gap-2 mt-2">
                                {data.awards?.map((award, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                                        <span>{award}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(award, data.awards, (newAwards) => handleData("awards", newAwards))}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                                {data.awards?.length === 0 && (
                                    <p className="text-sm text-gray-500 italic">No awards added yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Portfolio Images */}
                        <div className="flex flex-col gap-4 p-5 bg-gray-50 rounded-lg border border-gray-100">
                            <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                                <ImageIcon size={18} /> Portfolio Images
                            </h2>
                            
                            {/* Upload new images */}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-all cursor-pointer">
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <UploadCloud size={36} className="text-purple-500" />
                                    <label htmlFor="portfolio-images" className="cursor-pointer text-purple-600 font-medium">
                                        Upload portfolio images
                                    </label>
                                    <p className="text-sm text-gray-500">Select multiple files to showcase the artist's work</p>
                                    <input
                                        id="portfolio-images"
                                        name="portfolio-images"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleMultipleFileChange}
                                    />
                                </div>
                            </div>
                            
                            {/* New images to upload */}
                            {portfolioImages.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="font-medium text-gray-700 mb-2">New Images to Upload ({portfolioImages.length})</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {portfolioImages.map((file, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Portfolio item ${index + 1}`}
                                                    className="h-32 w-full object-cover rounded-lg border border-gray-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removePortfolioImage(index)}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Existing portfolio images */}
                            {id && data.portfolioImageUrls && data.portfolioImageUrls.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="font-medium text-gray-700 mb-2">Existing Portfolio Images ({data.portfolioImageUrls.length})</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {data.portfolioImageUrls.map((imageUrl, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={imageUrl}
                                                    alt={`Portfolio item ${index + 1}`}
                                                    className="h-32 w-full object-cover rounded-lg border border-gray-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteExistingImage(imageUrl)}
                                                    disabled={isDeletingImage}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    {isDeletingImage ? <Spinner size={3} /> : <Trash2 size={14} />}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {(!id || !data.portfolioImageUrls || data.portfolioImageUrls.length === 0) && portfolioImages.length === 0 && (
                                <p className="text-sm text-gray-500 italic">No portfolio images added yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => router.push('/admin/brands')}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                        >
                            {isLoading && <Spinner size={4} />}
                            {id ? "Update Artist" : "Create Artist"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}