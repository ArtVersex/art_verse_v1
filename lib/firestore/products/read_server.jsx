import { collection, doc, getDoc, getDocs, orderBy, query, where,limit as firestoreLimit } from "firebase/firestore"
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
        query(collection(db, "products"), where("isFeatured", "==", true))
    );
    
    const products = list.docs.map((snap) => ({
        id: snap.id,  // Including the document ID is critical
        ...snap.data()
    }));
    
    console.log(`Found ${products.length} featured products`);
    
    return products;

}

export const getProducts = async ({ limit = null } = {}) => {
    // Start with base query ordered by timestampcreate in descending order
    let productQuery = query(collection(db, "products"), orderBy('timestampcreate', 'desc'));
    
    // Add limit if it's provided and is a number
    if (limit !== null && typeof limit === 'number') {
      productQuery = query(productQuery, firestoreLimit(limit));
    }
    
    // Execute the query
    const list = await getDocs(productQuery);
    
    // Return the documents
    return list.docs.map((snap) => snap.data());
  }


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


export const getProductByBrand = async ({ brandId }) => {
    if (!brandId) {
        console.error("Error: brandId is undefined or invalid");
        return [];
    }

    const list = await getDocs(
        query(
            collection(db, "products"),
            where("brandID", "==", brandId),
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
