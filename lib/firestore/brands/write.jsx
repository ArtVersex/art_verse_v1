import { collection, deleteDoc, doc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
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

export const updateBrand = async ({ data, profileImage, bannerImage, portfolioImages }) => {
    if (!data?.name) {
        throw new Error("Name is required");
    }
    if (!data?.id) {
        throw new Error("ID is required");
    }

    const id = data.id;
    let imageUrl = data.imageUrl; // Changed from profileImageUrl to imageUrl
    let bannerImageUrl = data.bannerImageUrl;
    let portfolioImageUrls = data.portfolioImageUrls || [];

    // Upload new profile image if provided
    if (profileImage) {
        const profileImageRef = ref(storage, `brands/${Date.now()}_${id}_${Date.now()}_${profileImage.name}`);
        await uploadBytes(profileImageRef, profileImage);
        imageUrl = await getDownloadURL(profileImageRef);
    }

    // Upload new banner image if provided
    if (bannerImage) {
        const bannerImageRef = ref(storage, `brands/${id}_${Date.now()}_${bannerImage.name}`);
        await uploadBytes(bannerImageRef, bannerImage);
        bannerImageUrl = await getDownloadURL(bannerImageRef);
    }

    // Handle portfolio images
    if (portfolioImages?.length > 0) {
        const newPortfolioUrls = [];
        for (let i = 0; i < portfolioImages.length; i++) {
            const portfolioImageRef = ref(storage, `brands/${id}_portfolio_${Date.now()}_${i}`);
            await uploadBytes(portfolioImageRef, portfolioImages[i]);
            const url = await getDownloadURL(portfolioImageRef);
            newPortfolioUrls.push(url);
        }
        portfolioImageUrls = [...portfolioImageUrls, ...newPortfolioUrls];
    }

    await updateDoc(doc(db, `brands/${id}`), {
        ...data,
        imageUrl, // Changed from profileImageUrl to imageUrl
        bannerImageUrl: bannerImageUrl || null,
        portfolioImageUrls,
        timestampUpdate: Timestamp.now(),
    });
};

// deleteBrand remains the same

export const deleteBrand = async ({ id }) => {
    if (!id) {
        throw new Error("Id is Required")
    }

    await deleteDoc(doc(db, `brands/${id}`))
}

