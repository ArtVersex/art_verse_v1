"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Home, Phone, Info, LogIn, Search, Heart, ShoppingCart, User } from "lucide-react";
import LogoutButton from "./LogoutButton";
import AuthContextProvider from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/lib/firestore/user/read"; // Import to fetch user data

export default function ClientSideHeader({ menuList, actionButtons }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const { user } = useAuth();
  const { user: userData, isLoading } = useUser(user?.uid);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  // Update favorites count when userData changes
  useEffect(() => {
    if (userData?.favorites && Array.isArray(userData.favorites)) {
      setFavoritesCount(userData.favorites.length);
    } else {
      setFavoritesCount(0);
    }
    
    // Update cart items count
    if (userData?.cart && Array.isArray(userData.cart)) {
      setCartItemsCount(userData.cart.length);
    } else {
      setCartItemsCount(0);
    }
  }, [userData]);

  // Handle scroll event for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Map icon names to components
  const getIcon = (iconName) => {
    const icons = {
      Home: Home,
      Phone: Phone,
      Info: Info,
      Search: Search,
      Heart: Heart,
      ShoppingCart: ShoppingCart,
      User: User,
      LogIn: LogIn
    };
    const IconComponent = icons[iconName];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };

  // Render action button with optional badge
  const renderActionButton = (item, index) => {
    const isHeartIcon = item.icon === "Heart";
    const isCartIcon = item.icon === "ShoppingCart";
    const showHeartBadge = isHeartIcon && favoritesCount > 0;
    const showCartBadge = isCartIcon && cartItemsCount > 0;
    
    return (
      <Link 
        key={index} 
        href={item.link}
        className="p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all relative"
        aria-label={item.name}
        title={item.name}
      >
        {getIcon(item.icon)}
        {showHeartBadge && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {favoritesCount > 99 ? '99+' : favoritesCount}
          </span>
        )}
        {showCartBadge && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {cartItemsCount > 99 ? '99+' : cartItemsCount}
          </span>
        )}
      </Link>
    );
  };

  // Render mobile action button with optional badge
  const renderMobileActionButton = (item, index) => {
    const isHeartIcon = item.icon === "Heart";
    const isCartIcon = item.icon === "ShoppingCart";
    const showHeartBadge = isHeartIcon && favoritesCount > 0;
    const showCartBadge = isCartIcon && cartItemsCount > 0;
    
    return (
      <Link 
        key={index} 
        href={item.link} 
        className="text-gray-700 hover:text-blue-500 transition-all font-medium flex items-center gap-2 relative"
      >
        <div className="relative">
          {getIcon(item.icon)}
          {showHeartBadge && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {favoritesCount > 99 ? '99+' : favoritesCount}
            </span>
          )}
          {showCartBadge && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {cartItemsCount > 99 ? '99+' : cartItemsCount}
            </span>
          )}
        </div>
        <span>{item.name}</span>
        {showHeartBadge && (
          <span className="ml-1 text-xs font-semibold text-gray-500">({favoritesCount})</span>
        )}
        {showCartBadge && (
          <span className="ml-1 text-xs font-semibold text-gray-500">({cartItemsCount})</span>
        )}
      </Link>
    );
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "py-1 bg-white/95 backdrop-blur-md shadow-lg" 
          : "py-2 bg-gradient-to-r from-white to-gray-100/90 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <img
              className={`transition-all duration-300 ${
                scrolled ? "h-4" : "h-5"
              } hover:scale-105`}
              src="/logo_v1.png"
              alt="Logo"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {menuList.map((item, index) => (
              <Link 
                key={index} 
                href={item.link}
                className="px-2 py-2 rounded-md text-sm lg:text-base text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-2"
              >
                <span className="hidden lg:block">{getIcon(item.icon)}</span>
                {item.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons for Desktop */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {actionButtons.map((item, index) => renderActionButton(item, index))}

            <AuthContextProvider>
              <LogoutButton />
            </AuthContextProvider>
          </div>

          {/* Mobile Menu Button */}
          <div ref={menuRef} className="md:hidden">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-md py-4 md:hidden transition-opacity duration-300 ease-in-out">
                <div className="flex flex-col space-y-4 px-6">
                  {menuList.map((item, index) => (
                    <Link 
                      key={index} 
                      href={item.link} 
                      className="text-gray-700 hover:text-blue-500 transition-all font-medium flex items-center gap-2"
                    >
                      {getIcon(item.icon)}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                  
                  <div className="border-t border-gray-200 pt-3 mt-2"></div>
                  
                  {/* Action Buttons for Mobile */}
                  {actionButtons.map((item, index) => renderMobileActionButton(item, index))}
                  
                  <Link 
                    href="/login" 
                    className="block px-5 py-2 text-center bg-blue-600 text-white rounded-full shadow-md hover:shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    {getIcon("LogIn")}
                    <span>Login</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}