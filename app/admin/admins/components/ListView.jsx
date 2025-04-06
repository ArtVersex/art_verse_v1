"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../../spinner";
import { useAdmins } from "@/lib/firestore/admins/read";
import { deleteAdmin } from "@/lib/firestore/admins/write";

export default function ListView() {

    const { data: admins, error, isLoading } = useAdmins();

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
        <div className="flex-1 bg-white rounded-xl p-5 shadow-lg border border-gray-200">
            <h1 className="font-bold text-xl mb-4 text-blue-600">Admins</h1>

            <table className="w-full border-collapse rounded-lg overflow-hidden">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="py-3 px-4">SN</th>
                        <th className="py-3 px-4">Image</th>
                        <th className="py-3 px-4 text-left">Name</th>
                        <th className="py-3 px-4">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {admins?.map((item, index) => (
                        <Row index={index} item={item} key={item.id} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Row({ item, index }) {
    const router = useRouter();
    const [isDeleting, setisDeleting] = useState(false);

    const handleUpdate = () => {
        router.push(`/admin/admins?id=${item?.id}`);
    };

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this admin?");
        if (!confirmed) return;

        setisDeleting(true);
        try {
            await deleteAdmin({ id: item?.id });
            toast.success("Successfully Deleted");
        } catch (error) {
            toast.error(error?.message);
        } finally {
            setisDeleting(false);
        }
    };

    return (
        <tr className="odd:bg-gray-50 even:bg-white border-b border-gray-200">
            <td className="py-3 px-4 text-center">{index + 1}</td>
            <td className="py-3 px-4">
                <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-12 w-12 object-cover rounded-full border"
                />
            </td>
            <td className="py-3 px-4">
                <div className="flex flex-col">
                    <h2 className="font-semibold text-gray-800">{item.name}</h2>
                    <h3 className="text-gray-500 text-sm">{item.email}</h3>
                </div>
            </td>
            <td className="py-3 px-4 flex items-center gap-3">
                <button
                    onClick={handleUpdate}
                    disabled={isDeleting}
                    className="text-blue-500 hover:text-blue-700 transition-all"
                >
                    <Pencil size={20} />
                </button>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={`text-red-500 hover:text-red-700 transition-all flex items-center ${isDeleting && "opacity-50 cursor-not-allowed"}`}
                >
                    {isDeleting ? <Spinner size={18} /> : <Trash2 size={20} />}
                </button>
            </td>
        </tr>
    );
}
