import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"

export const getAdmins = async ({id}) =>{
    const data = await getDoc(doc(db,`admins/${id}`));
    if (data.exists()){
        return data.data()
    }
    else {
        return null;
    }
}