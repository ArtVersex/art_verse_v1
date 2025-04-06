"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { updateFavorites } from "@/lib/firestore/user/write";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { useRouter } from "next/navigation";

export default function FavoriteButton({ productId }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();
  const { user: userData, isLoading } = useUser(user?.uid);
  const router = useRouter();

  // Set initial favorite status from Firebase data when it loads
  useEffect(() => {
    if (userData && userData.favorites) {
      setIsFavorite(userData.favorites.includes(productId));
    }
  }, [userData, productId]);

  const toggleFavorite = async () => {
    try {
      // Handle authenticated users only
      if (!user) {
        router.push('/login')
        toast.error("You must be logged in to manage favorites.");
        return;
      }

      if (!userData) {
        // Create a new favorites list if none exists
        const newList = [productId];
        await updateFavorites({ list: newList, uid: user.uid });
        setIsFavorite(true);
        toast.success("Added to favorites");
      } else {
        const currentFavorites = userData.favorites || [];
        let newList;

        if (currentFavorites.includes(productId)) {
          // Remove from favorites
          newList = currentFavorites.filter((id) => id !== productId);
          setIsFavorite(false);
          toast.success("Removed from favorites");
        } else {
          // Add to favorites
          newList = [...currentFavorites, productId];
          setIsFavorite(true);
          toast.success("Added to favorites");
        }

        await updateFavorites({ list: newList, uid: user.uid });
      }
    } catch (error) {
      toast.error(error?.message || "Error updating favorites");
      console.error("Error updating favorites:", error);
    }
  };

  return (
    <button
      className={`w-8 h-8 flex items-center justify-center rounded-full shadow-md hover:text-white transition-colors ${
        isFavorite
          ? "bg-red-500 text-white"
          : "bg-white hover:bg-red-500"
      }`}
      onClick={(e) => {
        e.preventDefault();
        toggleFavorite();
      }}
      disabled={isLoading}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart size={16} className={isFavorite ? "fill-white" : ""} />
    </button>
  );
}