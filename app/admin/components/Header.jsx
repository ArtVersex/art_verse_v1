"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/lib/firestore/admins/read";
import { Menu } from "lucide-react";

export default function Header({ toggleSidebar }) {
    const { user } = useAuth();
    const { data: admin } = useAdmin({ email: user?.email });

    return (
        <section className="sticky top-0 flex items-center gap-3 bg-white border-b px-4 py-3 shadow-sm z-40">
            {/* Hamburger Icon for Mobile */}
            <div className="flex items-center md:hidden">
                <button 
                    onClick={toggleSidebar} 
                    className="p-2 rounded-lg hover:bg-blue-100 transition-all"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Dashboard Title */}
            <div className="flex-1">
                <h1 className="text-xl font-bold text-black-600">Dashboard</h1>
            </div>

            {/* Admin Info */}
            <div className="flex items-center gap-3">
                <div className="flex flex-col text-right">
                    <span className="text-sm font-medium text-gray-700">{admin?.name || "Admin"}</span>
                    <span className="text-xs text-gray-500">{admin?.email}</span>
                </div>
                <img 
                    className="h-10 w-10 rounded-full border-2 border-blue-500 object-cover" 
                    src={admin?.imageUrl || "/default-avatar.png"} 
                    alt="Admin Profile"
                />
            </div>
        </section>
    );
}
