"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Importing icons from lucide-react
import {
    LayoutDashboard,
    Package,
    Tags,
    Store,
    ShoppingCart,
    Users,
    Star,
    Layers,
    LogOut,
    ShieldCheck
} from "lucide-react";
import toast from "react-hot-toast";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firestore/firebase";

export default function Sidebar() {
    const pathname = usePathname();

    const menuList = [
        { name: "Dashboard", link: "/admin", icon: <LayoutDashboard size={20} /> },
        { name: "Products", link: "/admin/products", icon: <Package size={20} /> },
        { name: "Categories", link: "/admin/categories", icon: <Tags size={20} /> },
        { name: "Brands", link: "/admin/brands", icon: <Store size={20} /> },
        { name: "Orders", link: "/admin/orders", icon: <ShoppingCart size={20} /> },
        { name: "Customers", link: "/admin/customers", icon: <Users size={20} /> },
        { name: "Reviews", link: "/admin/reviews", icon: <Star size={20} /> },
        { name: "Collections", link: "/admin/collections", icon: <Layers size={20} /> },
        { name: "Admins", link: "/admin/admins", icon: <ShieldCheck size={20} /> },
    ];

    return (
        <section className="sticky top-0 flex flex-col gap-5 bg-white border-r px-5 py-3 h-screen overflow-hidden md:w-[270px] shadow-md">
            <div className="flex justify-center py-4">
                <Link href = '/'> 
                <img className="h-20" src="/logo_v1.png" alt="Logo" />
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto flex flex-col gap-2 ">
                {menuList.map((item, index) => (
                    <Link key={index} href={item.link}>
                        <div
                            className={`flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer transition-all
                ${pathname === item.link
                                    ? "bg-gradient-to-r from-blue-300 to-blue-400 text-white shadow-lg shadow-blue-200/50 transform "
                                    : "hover:bg-blue-100 text-gray-700"}`}
                        >
                            {item.icon} {/* Displaying the icon here */}
                            {item.name}
                        </div>
                    </Link>
                ))}
            </nav>

            <button
                onClick={() => {
                    const handleLogout = async () => {
                        try {
                            await toast.promise(
                                signOut(auth),
                                {
                                    error: (e) => e?.message || "Failed to log out",
                                    loading: "Logging out...",
                                    success: "Successfully logged out",
                                }
                            );
                        } catch (error) {
                            toast.error(error?.message || "An unexpected error occurred");
                        }
                    };

                    handleLogout(); // Call the async function
                }}
                className="flex items-center gap-3 py-3 px-4 rounded-xl text-red-600 bg-red-50
              hover:bg-red-100 hover:text-red-700 transition-all cursor-pointer shadow-sm"
            >
                <LogOut size={20} />
                Logout
            </button>

        </section>
    );
}
