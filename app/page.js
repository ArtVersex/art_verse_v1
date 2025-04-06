import { getFeaturedProducts, getProducts } from "@/lib/firestore/products/read_server";
import Header from "./components/Header";
import FeaturedProductSlider from "./components/Sliders";
import Collections from "./components/Collections";
import { getCollections } from "@/lib/firestore/collections/read_server";
import Categories from "./components/Categories";
import { getCategories } from "@/lib/firestore/categories/read_server";
import ProductsGridView from "./components/Products";
import CustomerReview from "./components/CustomerReview";
import Brands from "./components/Brands";
import { getAllBrands } from "@/lib/firestore/brands/read_server";
import Footer from "./components/Footer";

export default async function Home() {
  // Execute all requests concurrently
  const [
    rawFeaturedProducts,
    rawCollections,
    rawCategories,
    rawProducts,
    rawBrands
  ] = await Promise.all([
    getFeaturedProducts(),
    getCollections(),
    getCategories(),
    getProducts(),
    getAllBrands()
  ]);

  // Serialize the data
  const featuredProducts = JSON.parse(JSON.stringify(rawFeaturedProducts));
  const collections = JSON.parse(JSON.stringify(rawCollections));
  const categories = JSON.parse(JSON.stringify(rawCategories));
  const products = JSON.parse(JSON.stringify(rawProducts));
  const brands = JSON.parse(JSON.stringify(rawBrands));

  return (
    <main className="flex flex-col w-full overflow-x-hidden">
      <Header />
      <section className="pt-10">
        <FeaturedProductSlider featuredProducts={featuredProducts} />
        <Collections collections={collections} />
        <Categories categories={categories} />
        <ProductsGridView products={products} />
        <Brands brands={brands} />
        <CustomerReview />
        <Footer/>
      </section>
    </main>
  );
}
