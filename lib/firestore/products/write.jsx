import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage, db } from "../firebase";
import { collection, deleteDoc, doc, setDoc, Timestamp, updateDoc } from "firebase/firestore";

export const createNewProduct = async ({ data, featureImage, imageList }) => {
    if (!data.title) {
        throw new Error("Title is Required");
    }
    if (!featureImage) {
        throw new Error("Feature Image is Required");
    }

    // Upload Feature Image
    // const uniqueName = `${Date.now()}_${featureImage.name}`;

    // const featureImageRef = ref(storage, `products/${featureImage.name}`);
    const featureImageRef = ref(storage, `products/${Date.now()}_${featureImage.name}`);
    await uploadBytes(featureImageRef, featureImage);
    const featureImageUrl = await getDownloadURL(featureImageRef);

    // Upload Gallery Images
    let galleryImageUrls = [];
    if (imageList && imageList.length > 0) {
        const imageUploadPromises = Array.from(imageList).map(async (image) => {
            // const imageRef = ref(storage, `products/${image.name}`);
            const imageRef = ref(storage, `products/${Date.now()}_${image.name}`);
            await uploadBytes(imageRef, image);
            return await getDownloadURL(imageRef);
        });

        galleryImageUrls = await Promise.all(imageUploadPromises);
    }

    const newId = doc(collection(db,`ids`)).id

    await setDoc(doc(db,`products/${newId}`), {
        ...data,
        featureImageUrl: featureImageUrl,
        imageList: galleryImageUrls,
        id: newId,
        timestampcreate: Timestamp.now(),
    })
};


export const updateProduct = async ({ data, featureImage, imageList }) => {
    if (!data.title) {
        throw new Error("Title is Required");
    }

    if (!data.id) {
        throw new Error("ID is Required");
    }

    const productRef = doc(db, `products/${data.id}`);

    // Upload Feature Image if provided
    let featureImageUrl = data.featureImageUrl; // Default to existing image
    if (featureImage) {
        const featureImageRef = ref(storage, `products/${Date.now()}_${featureImage.name}`);
        await uploadBytes(featureImageRef, featureImage);
        featureImageUrl = await getDownloadURL(featureImageRef);
    }

    // Upload Gallery Images if provided
    let galleryImageUrls = data.imageList || []; // Default to existing gallery images
    if (imageList && imageList.length > 0) {
        const imageUploadPromises = Array.from(imageList).map(async (image) => {
            const imageRef = ref(storage, `products/${Date.now()}_${image.name}`);
            await uploadBytes(imageRef, image);
            return await getDownloadURL(imageRef);
        });

        galleryImageUrls = await Promise.all(imageUploadPromises);
    }

    await updateDoc(productRef, {
        ...data,
        featureImageUrl: featureImageUrl,
        imageList: galleryImageUrls,
        timestampUpdate: Timestamp.now(), // Updated timestamp
    });
};


export const deleteProduct = async ({ id }) => {
    if (!id) {
        throw new Error("Id is Required")
    }

    await deleteDoc(doc(db, `products/${id}`))
}





// export const updateCategories = async ({ data, image }) => {
//     if (!data?.name) {
//         throw new Error("Name is required")
//     }
//     if (!data?.slug) {
//         throw new Error("Slug is required")
//     }
//     if (!data?.id) {
//         throw new Error("ID is required")
//     }
//     const id = data?.id;

//     let imageUrl = data?.imageUrl;

//     if (image) {
//         let imageRef = ref(storage, `categories/${id}`);
//         await uploadBytes(imageRef, image)
//         imageUrl = await getDownloadURL(imageRef)
//     }
//     await updateDoc(doc(db, `categories/${id}`), {
//         ...data,
//         imageUrl: imageUrl,
//         timestampUpdate: Timestamp.now(),
//     })
// }
