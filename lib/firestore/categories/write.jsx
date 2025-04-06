import { collection, deleteDoc, doc, setDoc, Timestamp, updateDoc } from "firebase/firestore"
import { db, storage } from "../firebase"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

export const createNewCategories = async ({ data, image }) => {
    if (!image) {
        throw new Error("Image is Required")
    }
    if (!data?.name) {
        throw new Error("Name is required")
    }
    if (!data?.slug) {
        throw new Error("Slug is required")
    }

    const newId = doc(collection(db, `categories`)).id;

    let imageRef = ref(storage, `categories/${newId}`);

    await uploadBytes(imageRef, image)

    const imageUrl = await getDownloadURL(imageRef)

    await setDoc(doc(db, `categories/${newId}`), {
        ...data,
        id: newId,
        imageUrl: imageUrl,
        timestampCreate: Timestamp.now(),
    })
}

export const deleteCategory = async ({ id }) => {
    if (!id) {
        throw new Error("Id is Required")
    }

    await deleteDoc(doc(db, `categories/${id}`))
}


export const updateCategories = async ({ data, image }) => {
    if (!data?.name) {
        throw new Error("Name is required")
    }
    if (!data?.slug) {
        throw new Error("Slug is required")
    }
    if (!data?.id) {
        throw new Error("ID is required")
    }
    const id = data?.id;

    let imageUrl = data?.imageUrl;

    if (image) {
        let imageRef = ref(storage, `categories/${id}`);
        await uploadBytes(imageRef, image)
        imageUrl = await getDownloadURL(imageRef)
    }
    await updateDoc(doc(db, `categories/${id}`), {
        ...data,
        imageUrl: imageUrl,
        timestampUpdate: Timestamp.now(),
    })
}
