
"use client"; // Required for Next.js App Router

import dynamic from "next/dynamic";
// import "quill/dist/quill.snow.css"; // Import Quill styles
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: true });

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        [{ color: [] }, { background: [] }],
        ["clean"],
    ],
};

export default function Description({data,handleData}){

    const handleChange = (value) => {
        handleData('description', value)
    }

    return (
        <section 
        className="flex-1 flex flex-col gap-3 bg-white border p-4 rounded-xl"
        >
            <h1 className="font-semibold">Description</h1>
            <ReactQuill
                theme="snow"
                value={data?.description || ""}
                onChange={handleChange}
                modules={modules}
                placeholder="Enter your description Here..."
                className="min-h-[150px]"
            />
        </section>
    )
}

