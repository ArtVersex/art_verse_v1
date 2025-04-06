"use client";
import { UploadCloud } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../../spinner";
import { getCollection } from "@/lib/firestore/collections/read_server";
import { createNewCollection, updateCollection } from "@/lib/firestore/collections/write";
import { useProducts } from "@/lib/firestore/products/read";

export default function Form() {
    const [data, setData] = useState({});
    const [image, setImage] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const { data: products } = useProducts();

    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const router = useRouter();

    const fetchData = async () => {
        try {
            const res = await getCollection({ id });
            if (!res) {
                toast.error("Collection Not Found!");
            } else {
                setData(res);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const handleData = (key, value) => {
        setData((prevData) => ({
            ...(prevData ?? {}),
            [key]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setImage(file);
    };

    const handleCreate = async () => {
        try {
            setIsLoading(true);
            await createNewCollection({ data, image });
            toast.success("Successfully created!");
            setData({});
            setImage(null);
        } catch (error) {
            toast.error(error?.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            setIsLoading(true);
            await updateCollection({ data, image });
            toast.success("Successfully updated!");
            setData({});
            setImage(null);
            router.push("/admin/collections");
        } catch (error) {
            toast.error(error?.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleProductSelection = (productId) => {
        const selectedProduct = products?.find((item) => item.id === productId);
        handleData("product", selectedProduct);
    };

    return (
        <div className="flex flex-col gap-3 bg-white rounded-xl p-5 w-full md:w-[400px] shadow-md">
            <h1 className="font-bold text-lg">{id ? "Update" : "Create"} Collection</h1>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    id ? handleUpdate() : handleCreate();
                }}
                className="flex flex-col gap-4"
            >
                {/* Custom File Upload Section */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="collection-image" className="text-gray-600 text-sm">
                        Image <span className="text-red-500">*</span>
                    </label>
                    <div
                        className="border border-gray-300 px-4 py-6 rounded-lg w-full
                        flex items-center gap-3 text-gray-500 cursor-pointer
                        hover:bg-blue-50 hover:text-blue-500 transition-all"
                    >
                        <UploadCloud size={24} />
                        <label htmlFor="collection-image" className="cursor-pointer w-full">
                            {image ? image.name : "Click to upload or drag & drop an image"}
                        </label>
                        <input
                            id="collection-image"
                            name="collection Image"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Image Preview */}
                    {image && (
                        <div className="flex justify-center items-center p-3">
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Uploaded Preview"
                                className="h-20"
                            />
                        </div>
                    )}
                </div>

                {/* Name Field */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="collection-title" className="text-gray-600 text-sm">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="collection-title"
                        name="collection title"
                        type="text"
                        placeholder="Enter Title"
                        value={data?.title ?? ""}
                        onChange={(e) => handleData("title", e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded-lg w-full
                        focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Sub Title */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="collection-sub-title" className="text-gray-600 text-sm">
                        Sub Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="collection-sub-title"
                        name="collection-sub-title"
                        type="text"
                        placeholder="Enter Sub Title"
                        value={data?.subTitle ?? ""}
                        onChange={(e) => handleData("subTitle", e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded-lg w-full
                        focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Products Dropdown */}
                {/* Products */}
                {/* Products */}
                <div className="flex flex-col gap-1">
                    <label className="text-gray-600 text-sm">
                        Select Products <span className="text-red-500">*</span>
                    </label>
                    <select
                        className="border border-gray-300 rounded-md px-2 py-1"
                        onChange={(e) => {
                            const selectedId = e.target.value;
                            if (!data?.products?.includes(selectedId)) {
                                handleData("products", [...(data?.products || []), selectedId]);
                            }
                        }}
                    >
                        <option value="">-- Select a Product --</option>
                        {products?.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.title}
                            </option>
                        ))}
                    </select>

                    {/* Display Selected Products */}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {data?.products?.map((productId) => {
                            const selectedProduct = products?.find((p) => p.id === productId);
                            return (
                                <div
                                    key={productId}
                                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-sm flex items-center gap-2"
                                >
                                    {selectedProduct?.title}
                                    <button
                                        onClick={() =>
                                            handleData(
                                                "products",
                                                data.products.filter((id) => id !== productId)
                                            )
                                        }
                                        className="text-red-500 font-bold"
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg gap-3 
                    transition-all ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
                >
                    {isLoading ? (
                        <>
                            <Spinner size={5} />
                            {id ? "Updating..." : "Creating..."}
                        </>
                    ) : (
                        id ? "Update" : "Create"
                    )}
                </button>
            </form>
        </div>
    );
}
