import Link from "next/link";

export default function Page() {
    return (
        <main className="p-14">
            <h1> My Dahsboard </h1>
<Link href={'/admin'}> Admin Pannel
</Link>

        </main>
    )
}