import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore"
import { db } from "../firebase"

export const getProduct = async ({id}) =>{
    const data = await getDoc(doc(db,`products/${id}`));
    if (data.exists()){
        return data.data()
    }
    else {
        return null;
    }
}


export const getFeaturedProducts = async ()=>{
    const list = await getDocs(
        query(collection(db, "products"), where("isFeatured", "==" , true ))
    );
    return list.docs.map((snap) => snap.data());
}

export const getProducts = async ()=>{
    const list = await getDocs(query(collection(db, "products"), orderBy('timestampcreate','desc'))
);
    return list.docs.map((snap) => snap.data());
}

// export const getProductByCategory = async ({categoryId})=>{
//     const list = await getDocs(query(collection(db, "products"), orderBy('timestampcreate','desc'), where("categoryID", "==", categoryId))
// );
//     return list.docs.map((snap) => snap.data());
// }

// export const getProductByCategory = async ({ categoryId }) => {
//     const list = await getDocs(
//         query(
//             collection(db, "products"), 
//             where("categoryID", "==", categoryId), // 🔹 'where()' should come first
//             orderBy("timestampcreate", "desc")     // 🔹 'orderBy()' should come after
//         )
//     );

//     return list.docs.map((snap) => snap.data());
// };

export const getProductByCategory = async ({ categoryId }) => {
    if (!categoryId) {
        console.error("Error: categoryId is undefined or invalid");
        return [];
    }

    const list = await getDocs(
        query(
            collection(db, "products"),
            where("categoryID", "==", categoryId),
            orderBy("timestampcreate", "desc")
        )
    );

    return list.docs.map((snap) => {
        const data = snap.data();

        return {
            ...data,
            timestampcreate: data.timestampcreate?.toDate().toISOString() || null,
            timestampUpdate: data.timestampUpdate?.toDate().toISOString() || null
        };
    });
};
