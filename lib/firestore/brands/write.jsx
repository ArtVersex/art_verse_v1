import { collection, deleteDoc, doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";


export const createNewBrand = async ({ data, profileImage, bannerImage, portfolioImages }) => {
    if (!profileImage) {
        throw new Error("Profile image is required");
    }
    if (!data?.name) {
        throw new Error("Name is required");
    }

    const newId = doc(collection(db, "brands")).id;

    // Upload profile image (now saved as imageUrl)
    const profileImageRef = ref(storage, `brands/${newId}_${profileImage.name}`);
    await uploadBytes(profileImageRef, profileImage);
    const imageUrl = await getDownloadURL(profileImageRef);

    // Upload banner image if provided
    let bannerImageUrl = "";
    if (bannerImage) {
        const bannerImageRef = ref(storage, `brands/${newId}_${bannerImage.name}`);
        await uploadBytes(bannerImageRef, bannerImage);
        bannerImageUrl = await getDownloadURL(bannerImageRef);
    }

    // Upload portfolio images if provided
    const portfolioImageUrls = [];
    if (portfolioImages?.length > 0) {
        for (let i = 0; i < portfolioImages.length; i++) {
            const portfolioImageRef = ref(storage, `brands/${newId}_portfolio_${Date.now()}_${i}`);
            await uploadBytes(portfolioImageRef, portfolioImages[i]);
            const url = await getDownloadURL(portfolioImageRef);
            portfolioImageUrls.push(url);
        }
    }

    await setDoc(doc(db, `brands/${newId}`), {
        ...data,
        id: newId,
        imageUrl, // Changed from profileImageUrl to imageUrl
        bannerImageUrl: bannerImageUrl || null,
        portfolioImageUrls,
        timestampCreate: Timestamp.now(),
        timestampUpdate: Timestamp.now(),
    });

    return newId;
};

// export const updateBrand = async ({ data, profileImage, bannerImage, portfolioImages }) => {
//     if (!data?.name) {
//         throw new Error("Name is required");
//     }
//     if (!data?.id) {
//         throw new Error("ID is required");
//     }

//     const id = data.id;
//     let imageUrl = data.imageUrl; // Changed from profileImageUrl to imageUrl
//     let bannerImageUrl = data.bannerImageUrl;
//     let portfolioImageUrls = data.portfolioImageUrls || [];

//     // Upload new profile image if provided
//     if (profileImage) {
//         const profileImageRef = ref(storage, `brands/${Date.now()}_${id}_${Date.now()}_${profileImage.name}`);
//         await uploadBytes(profileImageRef, profileImage);
//         imageUrl = await getDownloadURL(profileImageRef);
//     }

//     // Upload new banner image if provided
//     if (bannerImage) {
//         const bannerImageRef = ref(storage, `brands/${id}_${Date.now()}_${bannerImage.name}`);
//         await uploadBytes(bannerImageRef, bannerImage);
//         bannerImageUrl = await getDownloadURL(bannerImageRef);
//     }

//     // Handle portfolio images
//     if (portfolioImages?.length > 0) {
//         const newPortfolioUrls = [];
//         for (let i = 0; i < portfolioImages.length; i++) {
//             const portfolioImageRef = ref(storage, `brands/${id}_portfolio_${Date.now()}_${i}`);
//             await uploadBytes(portfolioImageRef, portfolioImages[i]);
//             const url = await getDownloadURL(portfolioImageRef);
//             newPortfolioUrls.push(url);
//         }
//         portfolioImageUrls = [...portfolioImageUrls, ...newPortfolioUrls];
//     }

//     await updateDoc(doc(db, `brands/${id}`), {
//         ...data,
//         imageUrl, // Changed from profileImageUrl to imageUrl
//         bannerImageUrl: bannerImageUrl || null,
//         portfolioImageUrls,
//         timestampUpdate: Timestamp.now(),
//     });
// };

// // deleteBrand remains the same

export const deleteBrand = async ({ id }) => {
    if (!id) {
        throw new Error("Id is Required")
    }

    await deleteDoc(doc(db, `brands/${id}`))
}


// Create brand function remains the same

export const updateBrand = async ({ data, profileImage, bannerImage, portfolioImages }) => {
    if (!data?.name) {
        throw new Error("Name is required");
    }
    if (!data?.id) {
        throw new Error("ID is required");
    }

    const id = data.id;
    let imageUrl = data.imageUrl;
    let bannerImageUrl = data.bannerImageUrl;
    let portfolioImageUrls = data.portfolioImageUrls || [];

    // Upload new profile image if provided and delete old one
    if (profileImage) {
        // Delete previous profile image if it exists
        if (imageUrl) {
            try {
                const oldImageRef = ref(storage, imageUrl);
                await deleteObject(oldImageRef);
            } catch (error) {
                console.log("Error deleting old profile image", error);
                // Continue with upload even if delete fails
            }
        }
        
        const profileImageRef = ref(storage, `brands/${id}_profile_${Date.now()}_${profileImage.name}`);
        await uploadBytes(profileImageRef, profileImage);
        imageUrl = await getDownloadURL(profileImageRef);
    }

    // Upload new banner image if provided and delete old one
    if (bannerImage) {
        // Delete previous banner image if it exists
        if (bannerImageUrl) {
            try {
                const oldBannerRef = ref(storage, bannerImageUrl);
                await deleteObject(oldBannerRef);
            } catch (error) {
                console.log("Error deleting old banner image", error);
                // Continue with upload even if delete fails
            }
        }
        
        const bannerImageRef = ref(storage, `brands/${id}_banner_${Date.now()}_${bannerImage.name}`);
        await uploadBytes(bannerImageRef, bannerImage);
        bannerImageUrl = await getDownloadURL(bannerImageRef);
    }

    // Handle portfolio images
    if (portfolioImages?.length > 0) {
        const newPortfolioUrls = [];
        for (let i = 0; i < portfolioImages.length; i++) {
            const portfolioImageRef = ref(storage, `brands/${id}_portfolio_${Date.now()}_${i}_${portfolioImages[i].name}`);
            await uploadBytes(portfolioImageRef, portfolioImages[i]);
            const url = await getDownloadURL(portfolioImageRef);
            newPortfolioUrls.push(url);
        }
        
        // Add new portfolio images to existing ones
        portfolioImageUrls = [...portfolioImageUrls, ...newPortfolioUrls];
    }

    await updateDoc(doc(db, `brands/${id}`), {
        ...data,
        imageUrl,
        bannerImageUrl: bannerImageUrl || null,
        portfolioImageUrls,
        timestampUpdate: Timestamp.now(),
    });
};

// New function to delete a specific portfolio image
// Fixed deletePortfolioImage function to properly handle Firebase Storage URLs
export const deletePortfolioImage = async (brandId, imageUrl) => {
    if (!brandId || !imageUrl) {
        throw new Error("Brand ID and image URL are required");
    }

    try {
        // 1. Extract the file path from the URL
        // Firebase storage URLs look like: 
        // https://firebasestorage.googleapis.com/v0/b/[project-id].appspot.com/o/[encoded-file-path]?alt=media&token=[token]
        
        // We need to get the file path part from the URL
        const filePathMatch = imageUrl.match(/o\/([^?]+)/);
        if (!filePathMatch || !filePathMatch[1]) {
            throw new Error("Invalid storage URL format");
        }
        
        // Decode the URL-encoded file path
        const filePath = decodeURIComponent(filePathMatch[1]);
        
        // 2. Now create a reference to the file using the extracted path
        const imageRef = ref(storage, filePath);
        
        // 3. Delete from storage
        await deleteObject(imageRef);
        
        // 4. Update the document to remove this URL from portfolioImageUrls
        const brandRef = doc(db, `brands/${brandId}`);
        
        // Use getDoc to get the current document data
        const docSnap = await getDoc(brandRef);
        
        if (docSnap.exists()) {
            const brandData = docSnap.data();
            
            if (brandData && brandData.portfolioImageUrls) {
                const updatedUrls = brandData.portfolioImageUrls.filter(url => url !== imageUrl);
                
                await updateDoc(brandRef, {
                    portfolioImageUrls: updatedUrls,
                    timestampUpdate: Timestamp.now()
                });
            }
        }
        
        return true;
    } catch (error) {
        console.error("Error deleting portfolio image:", error);
        throw error;
    }
};