"use client"

import { useEffect, useState } from "react"
import BasicDetails from "./components/BasicDetails"
import Images from "./components/Images"
import Description from "./components/Description"
import toast from "react-hot-toast"
import { createNewProduct, updateProduct } from "@/lib/firestore/products/write"
import Spinner from "../../spinner"
import { useRouter, useSearchParams } from "next/navigation"
import { getProduct } from "@/lib/firestore/products/read_server"

export default function Page() {
    const [data, setData] = useState({})
    const [featureImage, setfeatureImage] = useState(null)
    const [ImageList, setImageList] = useState({})
    const [isLoading, setisLoading] = useState(false)

    const searchparams = useSearchParams();

    const id = searchparams.get("id")

    const router = useRouter();
    
    const fetchData = async () => {
        try {
            const res = await getProduct({id: id});
            if (!res){
                throw new Error("Product Not found")
            }
            else{
                setData(res);
            }
            
        } catch (error) {
            toast.error(error?.message)
        }

    }

    useEffect(() => {
      if(id){
        fetchData();
      }
    }, [id])
    

    const handleData = (key, value) => {
        setData((prevData) => ({
            ...(prevData ?? {}),
            [key]: value,
        }))
    }

    const handleCreate = async () => {
        setisLoading(true)
        try {
            await createNewProduct({ data: data, featureImage: featureImage, imageList: ImageList })
            setData({})
            setfeatureImage(null)
            setImageList({})
            toast.success("Product is Successfully Created")
        } catch (error) {
            toast.error(error?.message)
        }
        setisLoading(false)
    }

    const handleUpdate = async () => {
        setisLoading(true)
        try {
            await updateProduct({ data: data, featureImage: featureImage, imageList: ImageList })
            setData({})
            setfeatureImage(null)
            setImageList({})
            toast.success("Product is Successfully Updated")
            router.push(`/admin/products`)

        } catch (error) {
            toast.error(error?.message)
        }
        setisLoading(false)
    }


    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            if(id){
            handleUpdate();
        }
        else{
            handleCreate();
        }

        }}
            className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between w-full items-center">

                <h1 className="text-2xl font-bold text-center text-blue-600">{id ? "Update Product":"Create New Product"}</h1>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex items-center gap-2 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-all shadow-md ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                >
                    {isLoading && <Spinner size="5" />} {/* Add spinner with appropriate size */}
                    {id ? "Update": "Create"}
                </button>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Side: Basic Details */}
                <div className="bg-white shadow-md rounded-xl p-5">
                    <BasicDetails data={data} handleData={handleData} />
                </div>

                {/* Right Side: Images & Description */}
                <div className="space-y-5">
                    <div className="bg-white shadow-md rounded-xl p-5">
                        <Images
                            data={data}
                            featureImage={featureImage}
                            setfeatureImage={setfeatureImage}
                            ImageList={ImageList}
                            setImageList={setImageList}
                        />
                    </div>

                    <div className="bg-white shadow-md rounded-xl p-5">
                        <Description data={data} handleData={handleData} />
                    </div>
                </div>
            </div>

        </form>
    )
}
