import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Layout({children}) {
    return (
        <main>
            <Header/>
            <section className="pt-10">
            {children}
            </section>
            <Footer/>
        </main>
    )
}