"use client";

import { useEffect } from "react"; // ✅ Added useEffect import
import AuthContextProvider, { useAuth } from "@/contexts/AuthContext";
import AdmintLayout from "./components/AdmintLayout";
import { useRouter } from "next/navigation";
import { CircleUserRoundIcon, LoaderIcon } from "lucide-react";

export default function Layout({ children }) {
    return (
        <AuthContextProvider>
            <AdminChecking>
                {children}
            </AdminChecking>
        </AuthContextProvider>
    );
}

function AdminChecking({ children }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user && !isLoading) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="h-screen w-screen flex justify-center items-center">
                <LoaderIcon size={48} className="animate-spin text-blue-500" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="h-screen w-screen flex justify-center items-center">
                <h1>Please Login First</h1>
            </div>
        );
    }

    return <AdmintLayout>{children}</AdmintLayout>;
}
