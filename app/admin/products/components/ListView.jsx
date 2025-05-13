"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../../spinner";
import { useProducts } from "@/lib/firestore/products/read";
import { deleteProduct } from "@/lib/firestore/products/write";

export default function ListView() {
    const { data: products, error, isLoading } = useProducts();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);

    const totalPages = Math.ceil((products?.length || 0) / itemsPerPage);
    const paginatedProducts = products?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page when items per page changes
    };

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
        <div className="flex-1 bg-white rounded-lg p-4 shadow-md border border-gray-200 w-full overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="font-semibold text-lg">Product List</h1>
                <div className="flex items-center gap-2">
                    <label className="text-sm">Items per page:</label>
                    <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="border border-gray-300 rounded-md px-2 py-1"
                    >
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>

            <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="py-2 px-3 text-left text-sm font-medium">SN</th>
                        <th className="py-2 px-3 text-left text-sm font-medium">Image</th>
                        <th className="py-2 px-3 text-left text-sm font-medium">Title</th>
                        <th className="py-2 px-3 text-left text-sm font-medium">Price</th>
                        <th className="py-2 px-3 text-left text-sm font-medium">Stock</th>
                        <th className="py-2 px-3 text-left text-sm font-medium">Order</th>
                        <th className="py-2 px-3 text-left text-sm font-medium">Status</th>
                        <th className="py-2 px-3 text-left text-sm font-medium">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedProducts?.map((item, index) => (
                        <Row index={(currentPage - 1) * itemsPerPage + index} item={item} key={item.id} />
                    ))}
                </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
                <button onClick={handlePrev} disabled={currentPage === 1} className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300">
                    Previous
                </button>

                <span className="text-sm">Page {currentPage} of {totalPages}</span>

                <button onClick={handleNext} disabled={currentPage === totalPages} className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300">
                    Next
                </button>
            </div>
        </div>
    );
}

function Row({ item, index }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleUpdate = () => {
        router.push(`/admin/products/form?id=${item?.id}`);
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure?")) return;
        setIsDeleting(true);
        try {
            await deleteProduct({ id: item?.id });
            toast.success("Successfully deleted");
        } catch (error) {
            toast.error(error?.message);
        }
        setIsDeleting(false);
    };

    return (
        <tr className="border-t border-gray-200 hover:bg-gray-100">
            <td className="py-2 px-3 text-center text-sm">{index + 1}</td>
            <td className="py-2 px-3">
                <img
                    src={item.featureImageUrl}
                    alt={item.title}
                    className="h-10 w-10 object-cover rounded border border-gray-300"
                />
            </td>
            <td className="py-2 px-3 text-sm whitespace-nowrap">
                {item?.title} {item?.isFeatured === true && <span className="ml-2 bg-gradient-to-tr from-blue-500 to-indigo-400 text-white text-[10px] rounded-full px-3 py-1">Featured</span>}
                </td>
            <td className="py-2 px-3 text-sm">
                {item.salePrice ? (
                    <span>
                        <span className="text-green-600 font-medium whitespace-nowrap">${item.salePrice}</span>
                        <span className="line-through text-gray-400 ml-2">${item.price}</span>
                    </span>
                ) : (
                    <span>${item.price}</span>
                )}
            </td>
            <td className="py-2 px-3 text-center text-sm">{item?.stock ?? 0}</td>
            <td className="py-2 px-3 text-center text-sm">{item?.order ?? 0}</td>
            <td className="py-2 px-3 text-center text-sm whitespace-nowrap">
                {item.stock > 0 ? (
                    <span className="text-green-600 font-medium">In Stock</span>
                ) : (
                    <span className="text-red-600 font-medium">Out of Stock</span>
                )}
            </td>
            <td className="py-2 px-3 flex items-center gap-2">
                <button
                    onClick={handleUpdate}
                    disabled={isDeleting}
                    className="text-gray-600 hover:text-gray-900"
                >
                    <Pencil size={18} />
                </button>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-gray-600 hover:text-gray-900"
                >
                    <Trash2 size={18} />
                </button>
            </td>
        </tr>
    );
}