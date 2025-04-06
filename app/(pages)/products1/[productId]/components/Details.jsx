import { getBrands } from "@/lib/firestore/brands/read_server"
import { getcategory } from "@/lib/firestore/categories/read_server"
import { Heart } from "lucide-react"
import Link from "next/link"

export default function Details({product}) {
    
    return <div className="w-full flex flex-col gap-3">
        <div className="flex gap-1">
            <Category categoryId = {product?.categoryID}/>
            <Brand brandId = {product?.brandID} />
        </div>
        <h1 className="font-semibold text-xl">{product?.title}</h1>
        <h2 className="text-gray-600 text-sm line-clamp-4 md:line-clamp-4">{product?.shortDescription}</h2>
        {/* <h1 className="">{product?.description}</h1> */}
        <h3> {product?.salePrice} <span className="line-through"> {product?.price}</span></h3>

<div className="flex flex-wrap items-center gap-5">

        <button className=" border border-gray-300 rounded-full">
            Add to cart
        </button>

        <button className=" border border-gray-300 rounded-full" > 
            Buy Now
        </button>

        <button className="bg-pink-500">
            <Heart size={13} />
        </button>

</div>
        <div className="flex flex-col gap-2"> 
            <h2>Description</h2>
            <div className="text-gray-600"
            dangerouslySetInnerHTML={{__html:product?.description ?? ""}}></div>
        </div>



    </div>
}


async function Category({categoryId}){
    const category = await getcategory({id: categoryId})
    return (
        <Link href={`/categories/${category?.id}`}>
        <div className="flex gap-1 items-center border border-gray-50 px-3 py-1 rounded-full">
        <img className="h-4" src = {category?.imageUrl} alt = {category?.name} />
        <h4 className="text-xs font-semibold">{category?.name}</h4>
    </div>
        </Link>
    )
}

async function Brand({brandId}){
    const brand = await getBrands({id: brandId})
    return <div className="flex gap-1 items-center border border-gray-50 px-3 py-1 rounded-full">
        <img className="h-4" src = {brand?.imageUrl} alt = {brand?.name} />
        <h4 className="text-xs font-semibold">{brand?.name}</h4>
    </div>
}