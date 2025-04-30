"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Home, Phone, Info, LogIn, Search, Heart, ShoppingCart, User } from "lucide-react";
import LogoutButton from "./LogoutButton";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/lib/firestore/user/read";

export default function ClientSideHeader({ menuList, actionButtons }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [hoverItem, setHoverItem] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const lastScrollY = useRef(0);
  const menuRef = useRef(null);
  const { user } = useAuth();
  const { user: userData, isLoading } = useUser(user?.uid);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [animationClass, setAnimationClass] = useState("");

  // Track mouse position for custom cursor effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Add entrance animation when component mounts
  useEffect(() => {
    setAnimationClass("animate-in");
    
    return () => {
      setAnimationClass("animate-out");
    };
  }, []);

  // Update favorites and cart counts when userData changes
  useEffect(() => {
    if (userData?.favorites && Array.isArray(userData.favorites)) {
      setFavoritesCount(userData.favorites.length);
    } else {
      setFavoritesCount(0);
    }
    
    if (userData?.cart && Array.isArray(userData.cart)) {
      setCartItemsCount(userData.cart.length);
    } else {
      setCartItemsCount(0);
    }
  }, [userData]);

  // Handle scroll event for header styling and visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Set scrolled state for styling
      setScrolled(currentScrollY > 10);
      
      // Hide header on scroll down, show on scroll up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
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
    return IconComponent ? <IconComponent className={`w-4 h-4 ${hoverItem === iconName ? 'text-blue-500 scale-125' : ''} transition-all duration-300`} /> : null;
  };

  // Render action button with optional badge and hover effects
  const renderActionButton = (item, index) => {
    const isHeartIcon = item.icon === "Heart";
    const isCartIcon = item.icon === "ShoppingCart";
    const showHeartBadge = isHeartIcon && favoritesCount > 0;
    const showCartBadge = isCartIcon && cartItemsCount > 0;
    
    return (
      <Link 
        key={index} 
        href={item.link}
        className={`relative p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 overflow-visible group`}
        aria-label={item.name}
        title={item.name}
        onMouseEnter={() => setHoverItem(item.icon)}
        onMouseLeave={() => setHoverItem(null)}
      >
        {/* Icon with animation */}
        <div className="relative z-10">
          {getIcon(item.icon)}
        </div>
        
        {/* Paint splash effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full opacity-30"></div>
        
        {/* Badge for Heart/Cart */}
        {showHeartBadge && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center z-20 animate-pulse">
            {favoritesCount > 99 ? '99+' : favoritesCount}
          </span>
        )}
        {showCartBadge && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center z-20 animate-pulse">
            {cartItemsCount > 99 ? '99+' : cartItemsCount}
          </span>
        )}
      </Link>
    );
  };

  // Render mobile action button with optional badge and enhanced artistic effects
  const renderMobileActionButton = (item, index) => {
    const isHeartIcon = item.icon === "Heart";
    const isCartIcon = item.icon === "ShoppingCart";
    const showHeartBadge = isHeartIcon && favoritesCount > 0;
    const showCartBadge = isCartIcon && cartItemsCount > 0;
    
    return (
      <Link 
        key={index} 
        href={item.link} 
        className="text-gray-700 hover:text-blue-500 transition-all font-medium flex items-center gap-3 relative overflow-hidden group py-2"
        onMouseEnter={() => setHoverItem(item.icon)}
        onMouseLeave={() => setHoverItem(null)}
      >
        {/* Icon container with artistic background */}
        <div className="relative p-2 rounded-lg bg-blue-50 shadow-sm overflow-visible">
          {getIcon(item.icon)}
          
          {/* Paint splatter effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 opacity-40 rounded-lg"></div>
          
          {/* Animated border on hover */}
          <div className="absolute inset-0 rounded-lg border border-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {showHeartBadge && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center z-10">
              {favoritesCount > 99 ? '99+' : favoritesCount}
            </span>
          )}
          {showCartBadge && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center z-10">
              {cartItemsCount > 99 ? '99+' : cartItemsCount}
            </span>
          )}
        </div>
        
        {/* Text with artistic styling */}
        <div className="flex flex-col">
          <span className="relative z-10 font-semibold">
            {item.name}
            {/* Brush stroke underline animation */}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
          </span>
          
          {showHeartBadge && (
            <span className="text-xs font-medium text-blue-500">({favoritesCount} items)</span>
          )}
          {showCartBadge && (
            <span className="text-xs font-medium text-blue-500">({cartItemsCount} items)</span>
          )}
        </div>
        
        {/* Subtle color splash effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left opacity-20"></div>
      </Link>
    );
  };

  // Create an artistic SVG shape for the background
  const getRandomShape = () => {
    const colors = ["#e6f2ff", "#f0e6ff", "#fff0f0", "#e6fffa"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    return (
      <svg className="absolute top-0 left-0 w-full h-full opacity-20 z-0" viewBox="0 0 200 100" preserveAspectRatio="none">
        <path 
          fill={randomColor}
          d="M0,50 C30,20 50,80 70,50 C90,20 110,70 130,40 C150,10 170,60 200,30 L200,100 L0,100 Z" 
        />
      </svg>
    );
  };

  return (
    <>
      {/* Artistic cursor follower - desktop only */}
      <div 
        className="fixed w-6 h-6 rounded-full bg-blue-100 opacity-50 pointer-events-none z-50 hidden md:block"
        style={{
          transform: `translate(${cursorPosition.x - 12}px, ${cursorPosition.y - 12}px)`,
          transition: "transform 0.1s ease-out",
          mixBlendMode: "multiply"
        }}
      />
      
      <nav 
        className={`fixed top-0 left-0 right-0 w-full z-40 transition-all duration-500 overflow-visible ${
          scrolled 
            ? "py-1 backdrop-blur-md shadow-lg" 
            : "py-3"
        } ${
          isVisible
            ? "transform translate-y-0" 
            : "transform -translate-y-full"
        } ${animationClass}`}
      >
        {/* Watercolor-style background */}
        <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 opacity-95 z-0"></div>
        {getRandomShape()}
        
        {/* Content wrapper */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between h-12">
            {/* Logo with animation */}
            <Link href="/" className="flex-shrink-0 flex items-center group relative">
              <div className="overflow-hidden relative">
                <img
                  className={`transition-all duration-500 ${
                    scrolled ? "h-6" : "h-8"
                  } hover:scale-105 group-hover:opacity-100 group-hover:rotate-2`}
                  src="/logo_v1.png"
                  alt="Logo"
                />
                
                {/* Paint brush stroke animation on hover */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
              
              {/* Brand name with artistic typography */}
              <span className={`hidden sm:block ml-2 font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700 ${
                scrolled ? "text-lg" : "text-xl"
              } tracking-wider transition-all duration-300`}>
                ART Verse-X
              </span>
              
              {/* Mobile brand name with artistic touch */}
              <span className="sm:hidden ml-2 font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-lg tracking-wide">
              ART Verse-X
              </span>
            </Link>

            {/* Desktop Menu with hover effects */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
              {menuList.map((item, index) => (
                <Link 
                  key={index} 
                  href={item.link}
                  className="px-3 py-2 rounded-md text-sm lg:text-base text-gray-700 font-medium hover:text-blue-600 transition-all flex items-center gap-2 relative group overflow-hidden"
                  onMouseEnter={() => setHoverItem(item.name)}
                  onMouseLeave={() => setHoverItem(null)}
                >
                  {/* Icon with animation */}
                  <span className={`hidden lg:block transition-all duration-300 ${hoverItem === item.name ? 'scale-125 text-blue-500' : ''}`}>
                    {getIcon(item.icon)}
                  </span>
                  
                  {/* Text with relative positioning for underline effect */}
                  <span className="relative">
                    {item.name}
                    {/* Animated underline effect */}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </span>
                  
                  {/* Subtle background animation on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom opacity-50"></div>
                </Link>
              ))}
            </div>

            {/* Action Buttons for Desktop with artistic effects */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
              {actionButtons.map((item, index) => renderActionButton(item, index))}
              <LogoutButton />
            </div>

            {/* Mobile Menu Button with enhanced artistic animation */}
            <div ref={menuRef} className="md:hidden">
              <button
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none transition-colors relative overflow-hidden group"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <div className="relative z-10">
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </div>
                
                {/* Button hover animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full opacity-50"></div>
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Separate mobile menu that slides down instead of floating - fixes visibility issues */}
      {isMenuOpen && (
        <div 
          className="fixed top-14 left-0 right-0 md:hidden bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out"
          style={{
            transformOrigin: "top",
            animation: "slideDown 0.3s ease forwards"
          }}
        >
          {/* Artistic background for mobile menu */}
          <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 opacity-95"></div>
          
          {/* Mobile menu watercolor effect */}
          <div className="absolute inset-0 overflow-hidden">
            <svg className="absolute top-0 left-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path 
                fill="#e6f2ff"
                d="M0,30 C20,10 30,40 50,20 C70,0 80,30 100,10 L100,100 L0,100 Z" 
              />
            </svg>
            <svg className="absolute bottom-0 right-0 w-2/3 h-1/2 opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
              <circle cx="80" cy="80" r="30" fill="#f0e6ff" />
            </svg>
          </div>

          {/* Menu content */}
          <div className="max-w-6xl mx-auto px-6 py-6 relative z-10">
            <div className="flex flex-col space-y-5">
              {/* Main menu items with artistic styling */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2 border-b border-blue-100 pb-1">Navigation</h3>
                {menuList.map((item, index) => (
                  <Link 
                    key={index} 
                    href={item.link} 
                    className="text-gray-700 hover:text-blue-500 transition-all font-medium flex items-center gap-3 py-2 group relative"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {/* Icon with artistic container */}
                    <div className="p-2 rounded-lg bg-blue-50 shadow-sm relative overflow-hidden group-hover:bg-blue-100 transition-colors duration-300">
                      {getIcon(item.icon)}
                      
                      {/* Artistic splatter effect */}
                      <div className="absolute top-0 left-0 w-full h-full">
                        <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-200 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-200 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                      </div>
                    </div>
                    
                    {/* Text with artistic highlight effect */}
                    <span className="relative">
                      {item.name}
                      {/* Brush stroke underline effect */}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                ))}
              </div>
              
              <div className="border-t border-gray-100 pt-3"></div>
              
              {/* Action items with enhanced mobile styling */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2 border-b border-blue-100 pb-1">Quick Actions</h3>
                {actionButtons.map((item, index) => renderMobileActionButton(item, index))}
              </div>
              
              {/* Artistic login button */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <Link 
                  href="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-5 py-3 text-center text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 relative group overflow-hidden"
                >
                  {/* Button background with artistic gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 group-hover:from-blue-600 group-hover:to-purple-600 transition-colors duration-300"></div>
                  
                  {/* Artistic brush stroke overlay */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-full h-2 bg-white opacity-10"></div>
                    <div className="absolute bottom-0 right-0 w-full h-1 bg-black opacity-10"></div>
                  </div>
                  
                  {/* Button content */}
                  <div className="flex items-center justify-center gap-2 relative z-10">
                    {getIcon("LogIn")}
                    <span className="font-semibold tracking-wide">Sign In / Register</span>
                  </div>
                  
                  {/* Paint splash effect animation */}
                  <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-white rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300 transform scale-0 group-hover:scale-100"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-white rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300 transform scale-0 group-hover:scale-100 delay-75"></div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Artistic footer element for mobile menu */}
          <div className="py-3 px-6 bg-gradient-to-r from-blue-50 to-purple-50 relative">
            <svg className="absolute bottom-0 right-0 w-full h-12 opacity-10" preserveAspectRatio="none" viewBox="0 0 100 30">
              <path d="M0,30 C20,20 40,25 60,10 C80,0 100,15 100,30 L0,30 Z" fill="#4F46E5"></path>
            </svg>
            <p className="text-sm text-center text-gray-500 relative z-10">Explore the world of art</p>
          </div>
        </div>
      )}
      
      {/* Add a global style for animations */}
      <style jsx global>{`
        @keyframes slideDown {
          from {
            transform: scaleY(0);
          }
          to {
            transform: scaleY(1);
          }
        }
        
        .animate-in {
          animation: fadeIn 0.5s ease forwards;
        }
        
        .animate-out {
          animation: fadeOut 0.5s ease forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
      `}</style>
    </>
  );
}