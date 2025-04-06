"use client";

import { useEffect, useRef, useState } from "react";
import Header from "./Header";
import Sidebar from "./sidebar";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Spinner from "../spinner";
import { useAdmin } from "@/lib/firestore/admins/read";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firestore/firebase";

export default function AdmintLayout({ children }) {
    const pathname = usePathname();
    const sidebarRef = useRef();
    const [isOpen, setIsOpen] = useState(false);

    const { user } = useAuth();
    const { data: admin, error, isLoading } = useAdmin({ email: user?.email || "" });

    // Hook order fixed by ensuring all hooks are called before conditions
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (isLoading) {
        return (
            <div className="h-screen w-screen flex justify-center items-center">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen w-screen flex justify-center items-center">
                <div>{error}</div>
            </div>
        );
    }

    if (!admin) {
        return (
            <div className="flex-col gap-2 h-screen w-screen flex justify-center items-center">
                <div className="text-red-500 font-semibold">You are not admin!</div>
                <div className="text-gray-500 text-sm">{user?.email}</div>
                <button
                    onClick={async () => {
                        await signOut(auth);
                    }}
                >
                    Logout
                </button>
            </div>
        );
    }

    const toggleSidebar = () => setIsOpen((prev) => !prev);

    return (
        <main className="relative flex">
            <div className="hidden md:block">
                <Sidebar />
            </div>

            <div
                ref={sidebarRef}
                className={`fixed top-0 left-0 h-full w-[260px] bg-white shadow-md md:hidden
                transform transition-transform duration-300 z-50
                ${isOpen ? "translate-x-0" : "-translate-x-[100%]"}`}
            >
                <Sidebar />
            </div>

            <section className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <Header toggleSidebar={toggleSidebar} />
                <section className="flex-1 bg-[#eff3f4] p-4">{children}</section>
            </section>
        </main>
    );
}
