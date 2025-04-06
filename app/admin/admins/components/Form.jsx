"use client";
import { UploadCloud } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../../spinner";
import { createNewAdmin, updateAdmin } from "@/lib/firestore/admins/write";
import { getAdmins } from "@/lib/firestore/admins/read_server";

export default function Form() {
    const [data, setData] = useState({});
    const [image, setImage] = useState();
    const [isLoading, setisLoading] = useState(false);

    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const router = useRouter();

    const fetchdata = async () => {

        try {
            const res = await getAdmins({ id: id });
            if (!res) {
                toast.error("Admin Not Found!");
            }
            else {
                setData(res);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (id) {
            fetchdata();
        }

    }, [id])


    const handleData = (key, value) => {
        setData((prevData) => ({
            ...(prevData ?? {}),
            [key]: value,  // Corrected Typo
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setImage(file); // Correct: Save the file object
    };

    const handleCreate = async () => {
        try {
            setisLoading(true);
            await createNewAdmin({ data, image });
            toast.success("Successfully created!");
            setData({});
            setImage(null);
        } catch (error) {
            toast.error(error?.message || "An unexpected error occurred.");
        } finally {
            setisLoading(false);  // Ensures loading state resets even on error
        }
    };

    const handleUpdate = async () => {
        try {
            setisLoading(true);
            await updateAdmin({ data, image });
            toast.success("Successfully Updated!");
            setData({});
            setImage(null);
            router.push('/admin/admins')
        } catch (error) {
            toast.error(error?.message || "An unexpected error occurred.");
        } finally {
            setisLoading(false);  // Ensures loading state resets even on error
        }
    };

    return (
        <div className="flex flex-col gap-3 bg-white rounded-xl p-5 w-full md:w-[400px] shadow-md">
            <h1 className="font-bold text-lg">{id ? "Update" : "Create"} Admin</h1>

            <form
                onSubmit={(e) => {
                    {
                        e.preventDefault();
                        if (id) {
                            handleUpdate();
                        }
                        else {
                            handleCreate();
                        }

                    }
                }}
                className="flex flex-col gap-4 item"
            >

                {/* Custom File Upload Section */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="admins-image" className="text-gray-600 text-sm">
                        Image <span className="text-red-500">*</span>
                    </label>
                    <div
                        className="border border-gray-300 px-4 py-6 rounded-lg w-full
                        flex items-center gap-3 text-gray-500 cursor-pointer
                        hover:bg-blue-50 hover:text-blue-500 transition-all"
                    >
                        <UploadCloud size={24} />
                        <label htmlFor="admins-image" className="cursor-pointer w-full">
                            {image ? image.name : "Click to upload or drag & drop an image"}
                        </label>
                        <input
                            id="admins-image"
                            name="admins Image"
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
                    <label htmlFor="admins-name" className="text-gray-600 text-sm">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="admins-name"
                        name="admins Name"
                        type="text"
                        placeholder="Enter Name"
                        value={data?.name ?? ""}
                        onChange={(e) => handleData("name", e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded-lg w-full
                        focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                {/* Email Field */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="admins-email" className="text-gray-600 text-sm">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="admins-email"
                        name="admins email"
                        type="email"
                        placeholder="Enter Email"
                        value={data?.email ?? ""}
                        onChange={(e) => handleData("email", e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded-lg w-full
                        focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
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
