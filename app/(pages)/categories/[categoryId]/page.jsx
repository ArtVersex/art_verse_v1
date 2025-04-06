import ProductsGridView from "@/app/components/Products";
import { getProductByCategory } from "@/lib/firestore/products/read_server";
import { getcategory } from "@/lib/firestore/categories/read_server"; // Assuming you have this function
import RelatedProducts from "../../products1/[productId]/components/RelatedProduct";

export default async function CategoryPage({ params }) {
  const resolvedParams = await params;
  const categoryId = resolvedParams.categoryId;
  
  // Fetch products by category
  const products = await getProductByCategory({ categoryId: categoryId });
  
  // Fetch category details to display name
  const category = await getcategory({ id: categoryId });
  
  return (
    <main className="max-w-7xl mx-auto p-5 md:p-10">
      {/* Category Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {category?.name || "Category"}
        </h1>
        {category?.description && (
          <p className="text-gray-600 max-w-3xl">
            {category.description}
          </p>
        )}
        <div className="h-1 w-20 bg-blue-600 mt-4"></div>
      </div>
      
      {/* Products Grid */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">All Products</h2>
        {products && products.length > 0 ? (
          <ProductsGridView products={products} />
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        )}
      </div>
      
      {/* Related Products Section */}
      {/* <div className="mt-16">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">You might also like</h2>
        <RelatedProducts categoryId={categoryId} />
      </div> */}
    </main>
  );
}