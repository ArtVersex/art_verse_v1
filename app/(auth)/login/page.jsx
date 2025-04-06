"use client";
import Link from "next/link";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { auth } from "@/lib/firebase"; // Ensure this path is correct
import { useEffect, useState } from "react";
import { auth } from "@/lib/firestore/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const {user} = useAuth();
    useEffect(()=> {
        if (user){
            router.push('/account')

        }
    } , [user]
    )
    return (
<main className="w-full flex justify-center items-center bg-gradient-to-r from-blue-300 to-blue-500 p-24 min-h-screen">            <section className="flex flex-col gap-5 items-center w-full max-w-md">

                {/* Logo Section */}
                <div className="bg-white p-4 rounded-full shadow-md">
                    <img className="h-16" src="/logo_v1.png" alt="Logo" />
                </div>

                {/* Login Form */}
                <div className="flex flex-col gap-5 bg-white p-10 rounded-3xl shadow-2xl w-full">
                    <h1 className="font-extrabold text-3xl text-center text-gray-800">
                        Welcome Back
                    </h1>
                    <p className="text-sm text-center text-gray-500">
                        Login with your email or sign in with Google
                    </p>

                    <form className="flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            name="user-email"
                            id="user-email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                        />
                        <input
                            type="password"
                            placeholder="Enter your password"
                            name="user-password"
                            id="user-password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                        />

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all"
                        >
                            Login
                        </button>
                    </form>

                    {/* Links Section */}
                    <div className="flex justify-between text-sm">
                        <Link href={'/sign-up'}>
                            <span className="text-blue-600 hover:underline cursor-pointer">
                                New? Create Account
                            </span>
                        </Link>

                        <Link href={'/forget-password'}>
                            <span className="text-blue-600 hover:underline cursor-pointer">
                                Forgot Password?
                            </span>
                        </Link>
                    </div>

                    <div className="relative flex py-3 items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-gray-500">OR</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    {/* Google Sign-in Button */}
                    <SignInWithGoogleComponent />
                </div>
            </section>
        </main>
    );
}

function SignInWithGoogleComponent() {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setIsLoading(true);
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            toast.success("Successfully signed in!");
        } catch (error) {
            toast.error(error?.message || "Failed to sign in with Google.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleLogin}
            disabled={isLoading}
            type="button"
            className={`w-full flex items-center justify-center gap-2 
                ${isLoading ? "bg-gray-300 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"} 
                transition-all shadow-sm rounded-lg py-2`}
        >
            {isLoading ? (
                <div className="animate-spin h-5 w-5 border-t-2 border-blue-500 rounded-full"></div>
            ) : (
                <>
                    <FcGoogle className="h-5 w-5" />
                    Sign in with Google
                </>
            )}
        </button>
    );
}
