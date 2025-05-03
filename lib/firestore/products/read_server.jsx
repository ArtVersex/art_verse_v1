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
        query(collection(db, "products"), where("isFeatured", "==" , true ))
    );
    return list.docs.map((snap) => snap.data());
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

// export const getProducts = async ()=>{
//     const list = await getDocs(query(collection(db, "products"), orderBy('timestampcreate','desc'))
// );
//     return list.docs.map((snap) => snap.data());
// }

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



// export const getProductByBrand = async ({ brandId }) => {
//     console.log("Attempting to fetch products with brandId:", brandId);
    
//     if (!brandId) {
//       console.error("Error: brandId is undefined or invalid");
//       return [];
//     }
    
//     try {
//       const productsRef = collection(db, "products");
//       console.log("Collection reference created");
      
//       const q = query(
//         productsRef,
//         where("brandID", "==", brandId),
//         orderBy("timestampcreate", "desc")
//       );
//       console.log("Query created");
      
//       const list = await getDocs(q);
//       console.log(`Query executed, found ${list.docs.length} documents`);
      
//       return list.docs.map((snap) => {
//         const data = snap.data();
//         return {
//           ...data,
//           timestampcreate: data.timestampcreate?.toDate().toISOString() || null,
//           timestampUpdate: data.timestampUpdate?.toDate().toISOString() || null
//         };
//       });
//     } catch (error) {
//       console.error("Error fetching products by brand:", error);
//       return [];
//     }
//   };