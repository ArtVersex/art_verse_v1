"use client"

import { useState } from "react";

export default function Photos({ imageList }) {
    const [selectedImage, setSelectedImage] = useState(imageList[0]);

    if (!imageList?.length) {
        return <p className="text-center text-gray-500">No images available</p>;
    }

    return (
        <div className="w-full flex flex-col gap-5">
            {/* Selected Image */}
            <div className="flex justify-center">
                <img
                    className="h-[450px] object-cover rounded-2xl shadow-md"
                    src={selectedImage}
                    alt="Selected Image"
                />
            </div>

            {/* Thumbnails */}
            <div className="flex flex-wrap gap-3 justify-center">
                {imageList.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedImage(item)}
                        className={`cursor-pointer border-2 rounded-lg overflow-hidden ${
                            selectedImage === item
                                ? "border-gray-400"
                                : "border-transparent"
                        }`}
                    >
                        <img
                            className="w-[80px] h-[80px] object-cover"
                            src={item}
                            alt={`Thumbnail ${index + 1}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
