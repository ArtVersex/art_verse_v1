"use client";
import Link from "next/link";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firestore/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { createOrUpdateUser } from "@/lib/firestore/user/write";

export default function Page() {
    const router = useRouter();
    const { user } = useAuth();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isMounted, setIsMounted] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
        
        // Set initial window size
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        });
        
        // Track window size
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        
        // Track mouse position for interactive elements
        const handleMouseMove = (e) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });
        };
        
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);
    
    useEffect(() => {
        if (user) {
            router.push('/account');
        }
    }, [user, router]);

    // Handle email login
    const handleEmailLogin = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error("Please enter both email and password");
            return;
        }
        
        try {
            setIsLoading(true);
            const result = await signInWithEmailAndPassword(auth, email, password);
            await createOrUpdateUser(result.user);
            toast.success("Successfully logged in!");
            router.push('/account');
        } catch (error) {
            console.error("Login error:", error);
            let errorMessage = "Failed to login";
            
            // Parse Firebase error codes
            if (error.code === 'auth/user-not-found') {
                errorMessage = "No account found with this email";
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = "Incorrect password";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email format";
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = "Too many failed login attempts. Please try again later";
            }
            
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Generate dynamic SVG patterns
    const generatePatterns = () => {
        if (!isMounted) return [];
        
        const patterns = [];
        for (let i = 0; i < 5; i++) {
            patterns.push(
                <div 
                    key={i}
                    className="absolute rounded-full mix-blend-overlay opacity-70 animate-pulse-slow"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        width: `${100 + Math.random() * 200}px`,
                        height: `${100 + Math.random() * 200}px`,
                        background: `radial-gradient(circle, 
                            rgba(255,255,255,0.8) 0%, 
                            rgba(${Math.random() * 255},${Math.random() * 100},${Math.random() * 255},0.4) 50%, 
                            transparent 70%)`,
                        transform: `rotate(${Math.random() * 360}deg)`,
                        animationDuration: `${20 + Math.random() * 20}s`,
                        animationDelay: `${Math.random() * 5}s`
                    }}
                />
            );
        }
        return patterns;
    };
    
    // Calculate transform values only if component is mounted
    const getLogoTransform = () => {
        if (!isMounted) return {};
        return {
            transform: `perspective(1000px) rotateX(${(mousePosition.y - windowSize.height/2) / 50}deg) rotateY(${(mousePosition.x - windowSize.width/2) / 50}deg)`,
            transition: 'transform 0.2s ease-out',
            boxShadow: '0 0 40px rgba(255, 255, 255, 0.2), 0 0 20px rgba(200, 100, 255, 0.3)'
        };
    };
    
    const getFormTransform = () => {
        if (!isMounted) return {};
        return {
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px rgba(255, 255, 255, 0.1)',
            transform: `perspective(1000px) rotateX(${(mousePosition.y - windowSize.height/2) / 100}deg) rotateY(${(mousePosition.x - windowSize.width/2) / 100}deg)`,
            transition: 'transform 0.3s ease-out'
        };
    };
    
    return (
        <main className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 px-4 py-8 md:py-16 flex justify-center items-center overflow-hidden relative">
            {/* Artistic floating elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <svg className="absolute w-full h-full" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                            <stop offset="50%" stopColor="rgba(255,100,255,0.05)" />
                            <stop offset="100%" stopColor="rgba(120,0,255,0.1)" />
                        </linearGradient>
                        <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                            <stop offset="50%" stopColor="rgba(100,100,255,0.07)" />
                            <stop offset="100%" stopColor="rgba(200,100,200,0.05)" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="8" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                    <path d="M0,96 C320,48 480,192 640,160 C800,128 960,0 1280,64 L1280,720 L0,720 Z" fill="url(#gradient1)" opacity="0.3">
                        <animate attributeName="d" dur="15s" repeatCount="indefinite" 
                            values="M0,96 C320,48 480,192 640,160 C800,128 960,0 1280,64 L1280,720 L0,720 Z;
                                   M0,64 C320,128 480,64 640,96 C800,128 960,96 1280,32 L1280,720 L0,720 Z;
                                   M0,96 C320,48 480,192 640,160 C800,128 960,0 1280,64 L1280,720 L0,720 Z" />
                    </path>
                    <path d="M0,192 C160,160 320,64 480,96 C640,128 800,224 1280,160 L1280,720 L0,720 Z" fill="url(#gradient2)" opacity="0.25">
                        <animate attributeName="d" dur="20s" repeatCount="indefinite" 
                            values="M0,192 C160,160 320,64 480,96 C640,128 800,224 1280,160 L1280,720 L0,720 Z;
                                   M0,128 C160,192 320,160 480,128 C640,96 800,32 1280,128 L1280,720 L0,720 Z;
                                   M0,192 C160,160 320,64 480,96 C640,128 800,224 1280,160 L1280,720 L0,720 Z" />
                    </path>
                </svg>
                
                {/* Dynamic floating particles - Only render if mounted */}
                {isMounted && (
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        {Array.from({ length: 20 }).map((_, index) => (
                            <div 
                                key={index}
                                className="absolute rounded-full bg-white mix-blend-overlay animate-float"
                                style={{
                                    width: `${Math.random() * 6 + 1}px`,
                                    height: `${Math.random() * 6 + 1}px`,
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    opacity: Math.random() * 0.5 + 0.2,
                                    animationDuration: `${Math.random() * 10 + 10}s`,
                                    animationDelay: `${Math.random() * 5}s`
                                }}
                            />
                        ))}
                    </div>
                )}
                
                {/* Artistic gradient blobs - Only render if mounted */}
                {isMounted && generatePatterns()}
            </div>
            
            <section className="flex flex-col gap-8 items-center w-full max-w-md z-10">
                {/* Logo Section with interactive animation */}
                <div 
                    className="bg-white/20 backdrop-blur-lg p-6 rounded-full shadow-2xl border border-white/30"
                    style={getLogoTransform()}
                >
                    <img 
                        className="h-16 md:h-20 filter drop-shadow-lg" 
                        src="/logo_v1.png" 
                        alt="Logo" 
                    />
                </div>

                {/* Login Form with glass morphism effect */}
                <div 
                    className="flex flex-col gap-6 bg-white/15 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl w-full border border-white/20"
                    style={getFormTransform()}
                >
                    <div className="space-y-3">
                        <h1 className="font-extrabold text-2xl md:text-3xl text-center">
                            <span className="bg-gradient-to-r from-pink-200 via-white to-indigo-200 bg-clip-text text-transparent drop-shadow-sm">
                                Welcome Back
                            </span>
                        </h1>
                        <p className="text-sm text-center text-gray-100/80">
                            Login with your email or sign in with Google
                        </p>
                    </div>

                    <form onSubmit={handleEmailLogin} className="flex flex-col gap-5">
                        <div className="group relative">
                            <input
                                type="email"
                                placeholder="Email"
                                name="user-email"
                                id="user-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-3 border border-white/30 rounded-xl outline-none bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:border-white/50 transition-all"
                                required
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                        </div>
                        
                        <div className="group relative">
                            <input
                                type="password"
                                placeholder="Password"
                                name="user-password"
                                id="user-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-3 border border-white/30 rounded-xl outline-none bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:border-white/50 transition-all"
                                required
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute -inset-x-1 -bottom-1 h-1/3 bg-gradient-to-t from-white/20 to-transparent opacity-20"></div>
                            <span className="relative block text-white py-3 font-medium">
                                {isLoading ? (
                                    <div className="flex justify-center items-center">
                                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        <span>Logging in...</span>
                                    </div>
                                ) : (
                                    "Login"
                                )}
                            </span>
                        </button>
                    </form>

                    {/* Links Section */}
                    <div className="flex flex-col md:flex-row md:justify-between items-center gap-3 text-sm">
                        <Link href={'/sign-up'}>
                            <span className="text-white/80 hover:text-white hover:underline cursor-pointer transition-all">
                                New? Create Account
                            </span>
                        </Link>

                        <Link href={'/forget-password'}>
                            <span className="text-white/80 hover:text-white hover:underline cursor-pointer transition-all">
                                Forgot Password?
                            </span>
                        </Link>
                    </div>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-white/20"></div>
                        <span className="mx-4 text-white/70 text-sm">OR</span>
                        <div className="flex-grow border-t border-white/20"></div>
                    </div>

                    {/* Google Sign-in Button */}
                    <SignInWithGoogleComponent />
                </div>
                
                {/* Footer note with subtle animation */}
                <div className="relative">
                    <p className="text-xs text-white/70 text-center mt-2 font-light">
                        Secure login • Your data is protected
                    </p>
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1">
                        <div className="absolute w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse"></div>
                    </div>
                </div>
            </section>
        </main>
    );
}

function SignInWithGoogleComponent() {
    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleLogin = async () => {
        try {
            setIsLoading(true);
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            await createOrUpdateUser(result.user);
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
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`w-full flex items-center justify-center gap-3 relative overflow-hidden
                ${isLoading ? "bg-gray-500/50 cursor-not-allowed" : "bg-white/10 backdrop-blur-sm border border-white/30 text-white"} 
                transition-all shadow-lg rounded-xl py-3 px-4 hover:border-white/50`}
        >
            {/* Decorative background effect */}
            {!isLoading && isHovered && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-pink-500/10 animate-pulse"></div>
            )}
            
            {isLoading ? (
                <div className="h-5 w-5 relative">
                    <div className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-full p-1 shadow-inner">
                        <FcGoogle className="h-4 w-4" />
                    </div>
                    <span className="font-normal">Sign in with Google</span>
                </>
            )}
        </button>
    );
}