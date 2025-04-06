import { collection, deleteDoc, doc, setDoc, Timestamp, updateDoc } from "firebase/firestore"
import { db, storage } from "../firebase"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

export const createNewAdmin = async ({ data, image }) => {
    if (!image) {
        throw new Error("Image is Required")
    }
    if (!data?.name) {
        throw new Error("Name is required")
    }
    if (!data?.email) {
        throw new Error("Email is required")
    }

    const newId = data?.email;

    let imageRef = ref(storage, `admins/${newId}`);

    await uploadBytes(imageRef, image)

    const imageUrl = await getDownloadURL(imageRef)

    await setDoc(doc(db, `admins/${newId}`), {
        ...data,
        id: newId,
        imageUrl: imageUrl,
        timestampCreate: Timestamp.now(),
    })
}

export const deleteAdmin = async ({ id }) => {
    if (!id) {
        throw new Error("Id is Required")
    }

    await deleteDoc(doc(db, `admins/${id}`))
}


export const updateAdmin = async ({ data, image }) => {
    if (!data?.name) {
        throw new Error("Name is required")
    }
    if (!data?.id) {
        throw new Error("ID is required")
    }
    if (!data?.email) {
        throw new Error("Email is required")
    }
    const id = data?.id;

    let imageUrl = data?.imageUrl;

    if (image) {
        let imageRef = ref(storage, `admins/${id}`);
        await uploadBytes(imageRef, image)
        imageUrl = await getDownloadURL(imageRef)
    }

    if (id === data?.email) {
        await updateDoc(doc(db, `admins/${id}`), {
            ...data,
            imageUrl: imageUrl,
            timestampUpdate: Timestamp.now(),
        });
    }
    else {

        const newId = data?.email;

        await deleteDoc(doc(db, `admins/${id}`))

        await setDoc(doc(db, `admins/${newId}`), {
            ...data,
            id: newId,
            imageUrl: imageUrl,
            timestampUpdate: Timestamp.now(),
        });


    }

}
