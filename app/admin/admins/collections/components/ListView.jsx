"use client";

import { useCategories } from "@/lib/firestore/categories/read";
import { deleteCategory } from "@/lib/firestore/categories/write";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../../spinner";

export default function ListView() {

    const { data: categories, error, isLoading } = useCategories();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Spinner size={24} />
                Loading...
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div className="flex-1 bg-white rounded-xl p-5 shadow-md">
            <h1 className="font-bold text-xl mb-4">Categories</h1>

            <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="py-3 px-4">SN</th>
                        <th className="py-3 px-4">Image</th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {categories?.map((item, index) => {
                        return ( <Row index = {index} item = {item} key = {item.id} />
                    )
                })}
                </tbody>
            </table>
        </div>
    );
}


function Row({item,index}){

    const router = useRouter();
    const handleUpdate = () => {
        router.push(`/admin/categories?id=${item?.id}`);
    }

    const [isDeleting, setisDeleting] = useState(false);
    const handleDelete = async ()=>{
        if(!confirm("Are you Sure?")) return;
        setisDeleting(true)
        try {
            deleteCategory({id: item?.id})
            toast.success("Successfully Deleted")
        } catch (error) {
            toast.error(error?.message)
        }
        setisDeleting(false)
    }
    return <tr key={item.id} className="odd:bg-gray-100 even:bg-white ">
    <td className="py-3 px-4 text-center">{index + 1}</td>
    <td className="py-3 px-4">
        <img
            src={item.imageUrl}
            alt={item.name}
            className="h-12 w-12 object-cover rounded-md border"
        />
    </td>
    <td className="py-3 px-4">{item.name}</td>
    <td className="py-3 px-4 flex items-center gap-3">
        <button onClick = {handleUpdate} disabled = {isDeleting} className="text-blue-500 hover:text-blue-700 gap">
            <Pencil size={20} />
        </button>
        <button onClick = {handleDelete} disabled={isDeleting} className="text-red-500 hover:text-red-700 ">
            <Trash2 size={20}  />
        </button>
    </td>
</tr>

}