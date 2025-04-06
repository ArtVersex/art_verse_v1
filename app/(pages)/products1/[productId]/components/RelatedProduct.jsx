import ProductsGridView from "@/app/components/Products"
import { getProductByCategory } from "@/lib/firestore/products/read_server"

export default async function RelatedProducts({categoryId}) {
    const products = await getProductByCategory({categoryId: categoryId})
    return (

        <main>
        <ProductsGridView products = {products}/>
        </main>

    )
}