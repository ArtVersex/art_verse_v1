"use client";

import { useRef, useEffect } from "react";

export default function Images({ data, featureImage, setfeatureImage, ImageList, setImageList }) {
    const featureImageInputRef = useRef(null);
    const galleryImageInputRef = useRef(null);

    // Display Feature Image
    const featureImageUrl = featureImage
        ? URL.createObjectURL(featureImage)
        : data?.featureImageUrl;  // Use existing data if no new image is uploaded

    // Display Gallery Images
    const galleryImages = ImageList?.length
        ? Array.from(ImageList).map((file) => URL.createObjectURL(file))
        : data?.imageList || [];  // Use existing data if no new images are uploaded

    return (
        <section className="flex-1 flex flex-col gap-4 bg-white border p-4 rounded-xl shadow-sm">
            <h1 className="font-semibold text-lg">Images</h1>

            {/* Feature Image Preview */}
            {featureImageUrl && (
                <div className="flex justify-center mb-3">
                    <img
                        className="h-24 w-24 object-cover rounded-lg border"
                        src={featureImageUrl}
                        alt="Feature Image"
                    />
                </div>
            )}

            {/* Feature Image Upload */}
            <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center cursor-pointer"
                onClick={() => featureImageInputRef.current.click()}
            >
                <p className="text-gray-500 text-sm">Click to upload a <span className="font-medium">Feature Image</span> or drag and drop</p>
                <input
                    ref={featureImageInputRef}
                    type="file"
                    id="product-feature-image"
                    name="product-feature-image"
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files.length > 0) {
                            setfeatureImage(e.target.files[0]);
                        }
                    }}
                />
            </div>

            {/* Gallery Images Preview */}
            {galleryImages.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    {galleryImages.map((image, index) => (
                        <img
                            key={index}
                            className="h-20 w-20 object-cover rounded-lg border"
                            src={image}
                            alt={`Gallery Image ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Gallery Image Upload */}
            <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center cursor-pointer"
                onClick={() => galleryImageInputRef.current.click()}
            >
                <p className="text-gray-500 text-sm">Click to upload <span className="font-medium">Gallery Images</span> or drag and drop</p>
                <input
                    ref={galleryImageInputRef}
                    type="file"
                    id="product-images"
                    name="product-images"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files.length > 0) {
                            setImageList(e.target.files);
                        }
                    }}
                />
            </div>
        </section>
    );
}
