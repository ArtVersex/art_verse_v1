"use client"

import { useBrands } from "@/lib/firestore/brands/read"
import { useCategories } from "@/lib/firestore/categories/read";

export default function BasicDetails({data, handleData}){

    const {data: brands} = useBrands();
    const {data: categories} = useCategories();

    return (
        <section className="flex-1 flex flex-col gap-3 bg-white rounded-xl p-4 border">
            <h1 className="font-semibold">Basic Details</h1>
            <div className="flex flex-col gap-1">
                <label className="text-gray-500 text-xs" htmlFor="product-title"> Product Name <span className="text-red-500">*</span> {" "} </label>
                <input 
                    type="text"
                    placeholder="Enter Title"
                    id="product-title"
                    name="product-title"
                    value={data.title ?? ""}
                    onChange={(e) => {
                        handleData("title", e.target.value)
                    }}
                    className="border px-4 py-2 rounded-lg w-full outline-none"
                    required
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-gray-500 text-xs" htmlFor="product-short-description">Short Description<span className="text-red-500">*</span> {" "} </label>
                <input 
                    type="text"
                    placeholder="Short Description"
                    id="product-short-description"
                    name="product-short-description"
                    value={data?.shortDescription ?? ""}
                    onChange={(e) => {
                        handleData("shortDescription", e.target.value)
                    }}
                    className="border px-4 py-2 rounded-lg w-full outline-none"
                    required
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-gray-500 text-xs" htmlFor="product-brand">Brand<span className="text-red-500">*</span> {" "} </label>
                <select 
                    type="text"
                    id="product-brand"
                    name="product-brand"
                    value={data?.brandID ?? ""}
                    onChange={(e) => {
                        handleData("brandID", e.target.value)
                    }}
                    className="border px-4 py-2 rounded-lg w-full outline-none"
                    required
                > 
                    <option value="">Select Brand</option>
                    {brands?.map((item) =>{
                        return (
                            <option value={item?.id} key={item?.id}>
                                {item?.name}
                            </option>
                        )
                    })}
                </select>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-gray-500 text-xs" htmlFor="product-category">Category<span className="text-red-500">*</span> {" "} </label>
                <select 
                    type="text"
                    id="product-category"
                    name="product-category"
                    value={data?.categoryID ?? ""}
                    onChange={(e) => {
                        handleData("categoryID", e.target.value)
                    }}
                    className="border px-4 py-2 rounded-lg w-full outline-none"
                    required
                > 
                    <option value="">Select Category</option>
                    {categories?.map((item) =>{
                        return (
                            <option value={item?.id} key={item?.id}>
                                {item?.name}
                            </option>
                        )
                    })}
                </select>
            </div>

            {/* New field: Sub-category (Medium of Artwork) */}
            <div className="flex flex-col gap-1">
                <label className="text-gray-500 text-xs" htmlFor="product-subcategory">Medium of Artwork<span className="text-red-500">*</span> {" "} </label>
                <input 
                    type="text"
                    placeholder="Enter Medium (e.g., Oil, Acrylic, Watercolor)"
                    id="product-subcategory"
                    name="product-subcategory"
                    value={data?.subcategory ?? ""}
                    onChange={(e) => {
                        handleData("subcategory", e.target.value)
                    }}
                    className="border px-4 py-2 rounded-lg w-full outline-none"
                    required
                />
            </div>

            {/* New field: Dimensions */}
            <div className="flex flex-col gap-1">
                <label className="text-gray-500 text-xs" htmlFor="product-dimensions">Dimensions<span className="text-red-500">*</span> {" "} </label>
                <input 
                    type="text"
                    placeholder="Enter Dimensions (e.g., 24 x 36 inches)"
                    id="product-dimensions"
                    name="product-dimensions"
                    value={data?.dimensions ?? ""}
                    onChange={(e) => {
                        handleData("dimensions", e.target.value)
                    }}
                    className="border px-4 py-2 rounded-lg w-full outline-none"
                    required
                />
            </div>

            {/* New field: Year */}
            <div className="flex flex-col gap-1">
                <label className="text-gray-500 text-xs" htmlFor="product-year">Year<span className="text-red-500">*</span> {" "} </label>
                <input 
                    type="number"
                    placeholder="Enter Year Created"
                    id="product-year"
                    name="product-year"
                    value={data?.year ?? ""}
                    onChange={(e) => {
                        handleData("year", e.target.valueAsNumber)
                    }}
                    className="border px-4 py-2 rounded-lg w-full outline-none"
                    required
                />
            </div>

            {/* New field: Framing */}
            <div className="flex flex-col gap-1">
                <label className="text-gray-500 text-xs" htmlFor="product-framing">Framing<span className="text-red-500">*</span> {" "} </label>
                <select 
                    id="product-framing"
                    name="product-framing"
                    value={data?.framing ?? ""}
                    onChange={(e) => {
                        handleData("framing", e.target.value)
                    }}
                    className="border px-4 py-2 rounded-lg w-full outline-none"
                    required
                >
                    <option value="">Select Framing Option</option>
                    <option value="Framed">Framed</option>
                    <option value="Unframed">Unframed</option>
                    <option value="Both">Both</option>
                </select>
            </div>

            {/* New field: Edition Number */}
            <div className="flex flex-col gap-1">
                <label className="text-gray-500 text-xs" htmlFor="product-edition-number">Edition Number</label>
                <input 
                    type="text"
                    placeholder="Enter Edition Number (e.g., 2/50)"
                    id="product-edition-number"
                    name="product-edition-number"
                    value={data?.editionNumber ?? ""}
                    onChange={(e) => {
                        handleData("editionNumber", e.target.value)
                    }}
                    className="border px-4 py-2 rounded-lg w-full outline-none"
                />
            </div>

            {/* New field: Certificate Number */}
            <div className="flex flex-col gap-1">
                <label className="text-gray-500 text-xs" htmlFor="product-certificate-number">Certificate Number</label>
                <input 
                    type="text"
                    placeholder="Enter Certificate Number"
                    id="product-certificate-number"
                    name="product-certificate-number"
                    value={data?.certificateNumber ?? ""}
                    onChange={(e) => {
                        handleData("certificateNumber", e.target.value)
                    }}
                    className="border px-4 py-2 rounded-lg w-full outline-none"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-gray-500 text-xs" htmlFor="product-stock">Stock<span className="text-red-500">*</span> {" "} </label>
                <input 
                    type="number"
                    placeholder="Enter Stock"
                    id="product-stock"
                    name="product-stock"
                    value={data?.stock ?? ""}
                    onChange={(e) => {
                        handleData("stock", e.target.valueAsNumber)
                    }}
                    className="border px-4 py-2 rounded-lg w-full outline-none"
                    required
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-gray-500 text-xs" htmlFor="product-price">Price<span className="text-red-500">*</span> {" "} </label>
                <input 
                    type="number"
                    placeholder="Enter Price"
                    id="product-price"
                    name="product-price"
                    value={data?.price ?? ""}
                    onChange={(e) => {
                        handleData("price", e.target.valueAsNumber)
                    }}
                    className="border px-4 py-2 rounded-lg w-full outline-none"
                    required
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-gray-500 text-xs" htmlFor="product-sale-price">Sale Price<span className="text-red-500">*</span> {" "} </label>
                <input 
                    type="number"
                    placeholder="Enter Sale Price"
                    id="product-sale-price"
                    name="product-sale-price"
                    value={data?.salePrice ?? ""}
                    onChange={(e) => {
                        handleData("salePrice", e.target.valueAsNumber)
                    }}
                    className="border px-4 py-2 rounded-lg w-full outline-none"
                    required
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-gray-500 text-xs" htmlFor="product-is-featured-product">Featured Product<span className="text-red-500">*</span> {" "} </label>
                <select 
                    id="product-is-featured-product"
                    name="product-is-featured-product"
                    value={data?.isFeatured ? "Yes" : "No"}
                    onChange={(e) => {
                        handleData("isFeatured", e.target.value === "Yes" ? true : false)
                    }}
                    className="border px-4 py-2 rounded-lg w-full outline-none"
                    required
                >
                    <option value={"No"}>No</option>
                    <option value={"Yes"}>Yes</option>
                </select>
            </div>
        </section>
    )
}