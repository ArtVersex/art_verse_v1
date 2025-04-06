import { getProduct } from "@/lib/firestore/products/read_server";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import Photos from "./components/Photos";
import Details from "./components/Details";
import Reviews from "./components/Review";
import RelatedProducts from "./components/RelatedProduct";

export default async function Page({ params }) {
  const resolvedParams = await params;
  const productId = resolvedParams.productId;
  const product = await getProduct({ id: productId });

  return (

    <main className="p-5 md:p-10">
      <section className="flex flex-col-reverse md:flex-row gap-3">
        <Photos imageList={[product?.featureImageUrl, ...(product?.imageList ?? [])]} />
        <Details product={product} />
      </section>

      <section>
        {/* <Reviews productId={productId} /> */}
      </section>
      {/* //related Product */}
      <section>
        <h2>Related Products</h2>
        <RelatedProducts categoryId={product?.categoryID}/>
      </section>

    </main>
  )
}