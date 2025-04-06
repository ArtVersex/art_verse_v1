"use client"

import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firestore/firebase";
import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";

export default function LogoutButton() {
    const {user} = useAuth();
    if (!user) {
        return <></>
    }
    
    return (
        <button
        onClick={async () => {
            if (!confirm("Are you sure?")){
                return
            }
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
        <LogOut size={14} />
        Logout
    </button>


    )
}