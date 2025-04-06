import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "../firebase"

export const getBrands = async ({id}) =>{
    const data = await getDoc(doc(db,`brands/${id}`));
    if (data.exists()){
        return data.data()
    }
    else {
        return null;
    }
}

export const getAllBrands = async ()=>{
    const list = await getDocs(query(collection(db, "brands"), orderBy('timestampCreate','desc'))
);
    return list.docs.map((snap) => snap.data());
}