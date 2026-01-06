"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ShieldCheck, Pencil, Upload, Package, Clock, CheckCircle, XCircle, ShoppingCart, Heart, ArrowRight } from "lucide-react";

import { getAdmins } from "@/lib/firestore/admins/read_server";
import { getUserProfile } from "@/lib/firestore/user/read";
import {
  updateUserProfile,
  handleProfileImageUpload,
} from "@/lib/firestore/user/write";

import { useOrdersByUserId } from "@/lib/firestore/orders/read";
import { useAuth } from "@/contexts/AuthContext";

export function formatName(name = "") {
  return name
    .toLowerCase()
    .split(" ")
    .filter((w) => w.trim() !== "")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function AccountPage() {
  const { user: authUser } = useAuth();
  const [fireUser, setFireUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [imageValue, setImageValue] = useState("");
  const [saving, setSaving] = useState(false);

  const { orders, isLoading } = useOrdersByUserId(authUser?.uid);

  // Load Firestore User
  const loadUser = async (uid) => {
    const data = await getUserProfile(uid);
    if (data) {
      setFireUser(data);
      setNameValue(data.name || "");
      setImageValue(data.imageUrl || "");
    }
  };

  useEffect(() => {
    if (authUser) {
      loadUser(authUser.uid);
      
      // Check admin
      getAdmins({ id: authUser.email }).then((adminData) => {
        setIsAdmin(!!adminData);
      });
    } else {
      setFireUser(null);
      setIsAdmin(false);
    }
  }, [authUser]);

  // SAVE NAME + IMAGE
  const handleSave = async () => {
    if (!authUser) return;
    setSaving(true);

    await updateUserProfile(authUser.uid, {
      name: nameValue,
      imageUrl: imageValue,
    });

    await loadUser(authUser.uid);
    setSaving(false);
    setEditing(false);
  };

  // UPLOAD IMAGE → STORAGE → FIRESTORE
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);

    // Temporary preview
    setImageValue(URL.createObjectURL(file));

    const uploadedUrl = await handleProfileImageUpload(authUser.uid, file);

    setImageValue(uploadedUrl);

    setSaving(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Profile Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8 mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Your Account
          </h1>

          {authUser && fireUser ? (
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Profile Image */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full blur-xl opacity-30"></div>
                <img
                  src={imageValue || "/default-avatar.png"}
                  alt="Profile"
                  className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                />
                {!editing && (
                  <label className="absolute bottom-0 right-0 bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white rounded-full p-2 shadow-lg cursor-pointer hover:scale-110 transition-transform">
                    <Upload size={16} className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-grow text-center sm:text-left">
                {!editing ? (
                  <>
                    <div className="flex items-center gap-3 justify-center sm:justify-start mb-2">
                      <h2 className="text-2xl font-serif font-bold text-gray-900">
                        {fireUser.name
                          ? formatName(fireUser.name)
                          : formatName(authUser.email.split("@")[0])}
                      </h2>
                      <button
                        onClick={() => setEditing(true)}
                        className="text-blue-600 hover:text-indigo-600 transition-colors hover:scale-110 transform"
                        title="Edit Profile"
                      >
                        <Pencil size={18} />
                      </button>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{authUser.email}</p>

                    {fireUser.firstLoginDate && (
                      <p className="inline-block text-xs text-blue-700 bg-blue-50 px-4 py-2 rounded-full font-medium border border-blue-100">
                        Member since{" "}
                        {fireUser.firstLoginDate.toDate().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="space-y-4 w-full max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={nameValue}
                        onChange={(e) => setNameValue(e.target.value)}
                        placeholder="Enter your name"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </button>

                      <button
                        onClick={() => {
                          setEditing(false);
                          setNameValue(fireUser.name || "");
                          setImageValue(fireUser.imageUrl || "");
                        }}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="relative mx-auto w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-indigo-600 border-b-transparent border-l-transparent animate-spin"></div>
              </div>
              <p className="text-gray-500 mt-4">Loading profile...</p>
            </div>
          )}

          {/* Admin Button */}
          {isAdmin && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link href="/admin">
                <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105">
                  <ShieldCheck size={20} />
                  <span>Admin Portal</span>
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Orders Card */}
          <Link href="/orders">
            <div className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-2xl"></div>
              
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Package className="text-white" size={28} />
                </div>
                
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                  Your Orders
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  Track and manage your art acquisitions
                </p>

                {!isLoading && (
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {orders.length}
                    </span>
                    <ArrowRight className="text-blue-600 group-hover:translate-x-2 transition-transform" size={20} />
                  </div>
                )}
              </div>
            </div>
          </Link>

          {/* Cart Card */}
          <Link href="/cart">
            <div className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-2xl"></div>
              
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <ShoppingCart className="text-white" size={28} />
                </div>
                
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                  Shopping Cart
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  View items ready for checkout
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                    View Cart
                  </span>
                  <ArrowRight className="text-emerald-600 group-hover:translate-x-2 transition-transform" size={20} />
                </div>
              </div>
            </div>
          </Link>

          {/* Favorites Card */}
          <Link href="/favorites">
            <div className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-400 to-pink-500"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-200/20 to-pink-200/20 rounded-full blur-2xl"></div>
              
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Heart className="text-white" size={28} />
                </div>
                
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                  Favorites
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  Your curated collection of loved artworks
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-rose-700 bg-rose-50 px-3 py-1 rounded-full">
                    View All
                  </span>
                  <ArrowRight className="text-rose-600 group-hover:translate-x-2 transition-transform" size={20} />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity Summary */}
        {!isLoading && orders.length > 0 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
                <Clock className="text-blue-600" size={28} />
                Recent Activity
              </h2>
              <Link 
                href="/orders"
                className="text-blue-600 hover:text-indigo-600 font-medium text-sm flex items-center gap-1 group"
              >
                View All
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => (
                <Link 
                  key={order.id} 
                  href={`/orders/${order.id}`}
                  className="block group"
                >
                  <div className="p-4 border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-blue-50/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                          <Package className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <p className="font-serif font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            Order #{order.id.substring(0, 8).toUpperCase()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.timestampCreate?.seconds 
                              ? new Date(order.timestampCreate.seconds * 1000).toLocaleDateString("en-US", {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })
                              : 'Date unavailable'}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="text-blue-600 group-hover:translate-x-1 transition-transform" size={20} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block text-blue-600 hover:text-indigo-600 font-medium transition-colors"
          >
            ← Return to Home
          </Link>
        </div>
      </div>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Aart Verse. All rights reserved.
      </footer>
    </main>
  );
}