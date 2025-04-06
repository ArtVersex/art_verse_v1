"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../../spinner";
import { deleteCollection } from "@/lib/firestore/collections/write";
import { useCollections } from "@/lib/firestore/collections/read";

export default function ListView() {
    const { data: collection, error, isLoading } = useCollections();

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
            <h1 className="font-bold text-xl mb-4">Collection</h1>

            <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="py-3 px-4 text-center">SN</th>
                        <th className="py-3 px-4 text-center">Image</th>
                        <th className="py-3 px-4 text-center">Title</th>
                        <th className="py-3 px-4 text-center"># Products</th>
                        <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {collection?.map((item, index) => (
                        <Row index={index} item={item} key={item.id} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Row({ item, index }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleUpdate = () => {
        router.push(`/admin/collections?id=${item?.id}`);
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure?")) return;
        setIsDeleting(true);
        try {
            await deleteCollection({ id: item?.id });
            toast.success("Successfully Deleted");
        } catch (error) {
            toast.error(error?.message);
        }
        setIsDeleting(false);
    };

    return (
        <tr key={item.id} className="odd:bg-gray-100 even:bg-white">
            <td className="py-3 px-4 text-center">{index + 1}</td>
            <td className="py-3 px-4 text-center">
                <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-12 w-12 object-contain rounded-md border"
                />
            </td>
            <td className="py-3 px-4 text-center">{item.title}</td>
            <td className="py-3 px-4 text-center">{item?.products.length}</td>
            <td className="py-3 px-4 text-center flex justify-center gap-3">
                <button
                    onClick={handleUpdate}
                    disabled={isDeleting}
                    className="text-blue-500 hover:text-blue-700"
                >
                    <Pencil size={20} />
                </button>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-red-500 hover:text-red-700"
                >
                    <Trash2 size={20} />
                </button>
            </td>
        </tr>
    );
}
