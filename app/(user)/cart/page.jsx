"use client";
import { useState, useEffect } from "react";
import { Trash2, MinusCircle, PlusCircle, RefreshCw, ArrowRight, ShoppingBag, Palette, FileText, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getProduct } from "@/lib/firestore/products/read"; 
import { getCategory } from "@/lib/firestore/categories/read"; 
import { getBrands } from "@/lib/firestore/brands/read"; 
import { useUser } from "@/lib/firestore/user/read"; 
import { 
  updateCartItemQuantity, 
  removeFromCart, 
  clearCart,
  calculateCartTotals 
} from "@/lib/firestore/user/cart";
import Link from "next/link";

// Category display component with artistic styling
function CategoryDisplay({ categoryId }) {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategory() {
      if (!categoryId) {
        setLoading(false);
        return;
      }
      
      try {
        const categoryData = await getCategory(categoryId);
        setCategory(categoryData);
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCategory();
  }, [categoryId]);

  if (loading || !category) return <span className="text-sm text-gray-500">{categoryId}</span>;

  return (
    <Link href={`/categories/${category.id}`} className="hover:opacity-80 transition-opacity">
      <div className="flex gap-1 items-center px-3 py-1 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 transition-all">
        {category.imageUrl && (
          <img
            className="h-4 w-4 object-contain"
            src={category.imageUrl}
            alt={category.name || "Category"}
          />
        )}
        <h4 className="text-xs font-serif italic text-indigo-800">{category.name}</h4>
      </div>
    </Link>
  );
}

// Brand display component with artistic styling
function BrandDisplay({ brandId }) {
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrand() {
      if (!brandId) {
        setLoading(false);
        return;
      }
      
      try {
        const brandData = await getBrands(brandId);
        setBrand(brandData);
      } catch (error) {
        console.error("Error fetching brand:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBrand();
  }, [brandId]);

  if (loading || !brand) return <span className="text-sm text-gray-500">{brandId}</span>;

  return (
    <Link href={`/brands/${brand.id}`} className="hover:opacity-80 transition-opacity">
      <div className="flex gap-1 items-center px-3 py-1 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 hover:from-amber-100 hover:to-orange-100 transition-all">
        {brand.imageUrl && (
          <img
            className="h-4 w-4 object-contain"
            src={brand.imageUrl}
            alt={brand.name || "Brand"}
          />
        )}
        <h4 className="text-xs font-serif italic text-amber-800">{brand.name}</h4>
      </div>
    </Link>
  );
}

// Decorative element component
function DecorativeCorner({ position }) {
  const positionClasses = {
    "top-left": "top-0 left-0 rotate-0",
    "top-right": "top-0 right-0 rotate-90",
    "bottom-left": "bottom-0 left-0 -rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180"
  };

  return (
    <div className={`absolute w-12 h-12 ${positionClasses[position]} pointer-events-none opacity-50`}>
      <div className="absolute top-0 left-0 w-px h-6 bg-gradient-to-b from-purple-300 to-transparent"></div>
      <div className="absolute top-0 left-0 w-6 h-px bg-gradient-to-r from-purple-300 to-transparent"></div>
      <div className="absolute top-0 left-1 w-1 h-1 rounded-full bg-purple-400"></div>
      <div className="absolute top-1 left-0 w-1 h-1 rounded-full bg-purple-400"></div>
    </div>
  );
}

// Artistic loading animation
function LoadingAnimation() {
  return (
    <div className="relative flex items-center justify-center h-64">
      <div className="absolute w-32 h-32 border-t-4 border-l-4 border-purple-200 rounded-full animate-spin"></div>
      <div className="absolute w-24 h-24 border-r-4 border-b-4 border-amber-300 rounded-full animate-spin-slow"></div>
      <Palette className="w-12 h-12 text-purple-500" />
      <span className="absolute mt-20 text-lg font-serif italic text-purple-700">Loading your gallery...</span>
    </div>
  );
}

export default function CartPage() {
    const { user } = useAuth();
    const { user: userData, isLoading, error, mutate } = useUser(user?.uid);
    const [cartItems, setCartItems] = useState([]);
    const [loadingCart, setLoadingCart] = useState(true);
    const [updatingCart, setUpdatingCart] = useState(false);
    const [cartTotals, setCartTotals] = useState({
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
        itemCount: 0,
        itemQuantity: 0
    });

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                if (userData?.cart && userData.cart.length > 0) {
                    console.log("Found cart items:", userData.cart);
                    
                    // Fetch individual products by their IDs
                    const itemPromises = userData.cart.map(async (cartItem) => {
                        const product = await getProduct(cartItem.productId);
                        // Combine product data with cart quantity
                        return product ? { 
                            ...product, 
                            quantity: cartItem.quantity,
                            cartProductId: cartItem.productId // Store the cart productId for reference
                        } : null;
                    });
    
                    const fetchedItems = await Promise.all(itemPromises);
                    
                    // Filter valid products
                    const validItems = fetchedItems.filter((item) => item);
                    console.log("Valid cart items:", validItems);
                    setCartItems(validItems);
                    
                    // Calculate cart totals
                    setCartTotals(calculateCartTotals(validItems));
                } else {
                    console.log("No cart items found in user data");
                    setCartItems([]);
                    setCartTotals({
                        subtotal: 0,
                        tax: 0,
                        shipping: 0,
                        total: 0,
                        itemCount: 0,
                        itemQuantity: 0
                    });
                }
            } catch (err) {
                console.error("Error fetching cart items:", err);
            } finally {
                setLoadingCart(false);
            }
        };
    
        if (userData?.cart) {
            fetchCartItems();
        } else {
            setLoadingCart(false);
            setCartItems([]);
            setCartTotals({
                subtotal: 0,
                tax: 0,
                shipping: 0,
                total: 0,
                itemCount: 0,
                itemQuantity: 0
            });
        }
    }, [userData]);
    
    const handleUpdateQuantity = async (item, newQuantity) => {
        if (newQuantity < 1) return;
        
        // Check against product stock
        if (newQuantity > item.stock) {
            alert(`Sorry, only ${item.stock} item(s) available in stock.`);
            return;
        }
        
        setUpdatingCart(true);
        try {
            // Optimistic UI update
            const updatedItems = cartItems.map(cartItem => 
                cartItem.id === item.id 
                    ? { ...cartItem, quantity: newQuantity } 
                    : cartItem
            );
            setCartItems(updatedItems);
            setCartTotals(calculateCartTotals(updatedItems));
            
            // Update in database
            await updateCartItemQuantity(user.uid, item.cartProductId, newQuantity);
            
            // Refresh user data
            mutate();
        } catch (err) {
            console.error("Error updating cart item quantity:", err);
            // Revert optimistic update if failed
            mutate();
        } finally {
            setUpdatingCart(false);
        }
    };
    
    const handleRemoveItem = async (item) => {
        setUpdatingCart(true);
        try {
            // Optimistic UI update
            const updatedItems = cartItems.filter(cartItem => cartItem.id !== item.id);
            setCartItems(updatedItems);
            setCartTotals(calculateCartTotals(updatedItems));
            
            // Update in database
            await removeFromCart(user.uid, item.cartProductId);
            
            // Refresh user data
            mutate();
        } catch (err) {
            console.error("Error removing item from cart:", err);
            // Revert optimistic update if failed
            mutate();
        } finally {
            setUpdatingCart(false);
        }
    };
    
    const handleClearCart = async () => {
        if (!confirm("Are you sure you want to clear your collection?")) return;
        
        setUpdatingCart(true);
        try {
            // Update UI optimistically
            setCartItems([]);
            setCartTotals({
                subtotal: 0,
                tax: 0,
                shipping: 0,
                total: 0,
                itemCount: 0,
                itemQuantity: 0
            });
            
            // Update in database
            await clearCart(user.uid);
            
            // Refresh user data
            mutate();
        } catch (err) {
            console.error("Error clearing cart:", err);
            // Revert optimistic update if failed
            mutate();
        } finally {
            setUpdatingCart(false);
        }
    };
    
    if (isLoading || loadingCart) {
        return (
            <main className="max-w-6xl mx-auto p-6 min-h-screen pt-20 bg-gradient-to-b from-white to-purple-50">
                <LoadingAnimation />
            </main>
        );
    }

    if (error) {
        return (
            <main className="max-w-6xl mx-auto p-6 min-h-screen pt-20 bg-gradient-to-b from-white to-purple-50">
                <div className="bg-red-50 border border-red-200 rounded-lg p-8 mb-6 text-center relative overflow-hidden">
                    <DecorativeCorner position="top-left" />
                    <DecorativeCorner position="top-right" />
                    <DecorativeCorner position="bottom-left" />
                    <DecorativeCorner position="bottom-right" />
                    <h2 className="text-red-700 text-2xl font-serif italic mb-4">An Unforeseen Complication</h2>
                    <p className="text-red-600 max-w-md mx-auto">We encountered a challenge while curating your collection. Please refresh the gallery or contact our curators if the issue persists.</p>
                </div>
            </main>
        );
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <main className="max-w-6xl mx-auto p-6 min-h-screen pt-20 bg-gradient-to-b from-white to-purple-50">
                <div className="text-center py-16 rounded-lg border border-purple-100 bg-white shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-200 via-amber-200 to-purple-200"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-200 via-amber-200 to-purple-200"></div>
                    
                    <DecorativeCorner position="top-left" />
                    <DecorativeCorner position="top-right" />
                    <DecorativeCorner position="bottom-left" />
                    <DecorativeCorner position="bottom-right" />
                    
                    <Palette className="w-20 h-20 text-purple-200 mx-auto mb-6" />
                    <h1 className="text-3xl font-serif italic text-purple-800 mb-2">Your Collection Awaits</h1>
                    <div className="w-16 h-px bg-amber-300 mx-auto mb-4"></div>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">The canvas is blank, waiting for your first selection. Begin your artistic journey with us.</p>
                    <Link href="/" className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-serif italic rounded-full shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all">
                        Explore Gallery <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-6xl mx-auto p-6 min-h-screen pt-20 bg-gradient-to-b from-white to-purple-50">
            <div className="mb-10 text-center relative">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent -z-10 transform -translate-y-1/2"></div>
                <h1 className="text-4xl font-serif italic text-purple-800 inline-block bg-white px-6 relative z-10">Your Collection</h1>
                <p className="text-gray-600 mt-2">
                    {cartTotals.itemCount} {cartTotals.itemCount === 1 ? 'masterpiece' : 'masterpieces'} 
                    {cartTotals.itemQuantity > cartTotals.itemCount && ` (${cartTotals.itemQuantity} editions)`}
                </p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items List */}
                <div className="lg:w-2/3">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden relative border border-purple-100">
                        <DecorativeCorner position="top-left" />
                        <DecorativeCorner position="top-right" />
                        
                        <div className="p-6 border-b border-purple-100 flex justify-between items-center">
                            <h2 className="text-xl font-serif italic text-purple-800">Curated Selection</h2>
                            <button 
                                onClick={handleClearCart}
                                disabled={updatingCart}
                                className="text-red-400 hover:text-red-600 flex items-center text-sm font-medium disabled:opacity-50 transition-all group"
                            >
                                <Trash2 className="w-4 h-4 mr-1" />
                                <span className="relative">
                                    Clear Collection
                                    <span className="absolute bottom-0 left-0 w-0 h-px bg-red-400 group-hover:w-full transition-all"></span>
                                </span>
                            </button>
                        </div>
                        
                        <div className="divide-y divide-purple-50">
                            {cartItems.map((item) => (
                                <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 relative group">
                                    {/* Hover effect background */}
                                    <div className="absolute inset-0 bg-purple-50 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                                    
                                    {/* Product Image with artistic frame */}
                                    <div className="sm:w-32 h-32 flex-shrink-0 relative">
                                        <div className="absolute inset-0 border-2 border-amber-100 transform rotate-3"></div>
                                        <div className="absolute inset-0 border border-purple-100 -rotate-1"></div>
                                        {item.featureImageUrl ? (
                                            <div className="relative w-full h-full transform hover:scale-105 transition-transform hover:shadow-md">
                                                <img
                                                    src={item.featureImageUrl}
                                                    alt={item.title}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-50 to-amber-50 border border-purple-100">
                                                <Palette className="w-10 h-10 text-purple-200" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Product Details */}
                                    <div className="flex-grow">
                                        <h3 className="font-serif italic text-lg text-purple-800">{item.title}</h3>
                                        <div className="flex flex-wrap gap-2 mt-2 mb-3">
                                            {item.categoryID && <CategoryDisplay categoryId={item.categoryID} />}
                                            {item.brandID && <BrandDisplay brandId={item.brandID} />}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                                            <div className="flex items-center">
                                                <span className="text-sm text-gray-500 mr-2 font-serif italic">Editions:</span>
                                                <button 
                                                    onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                                    disabled={item.quantity <= 1 || updatingCart}
                                                    className="text-purple-500 hover:text-purple-700 disabled:text-gray-300 transition-colors"
                                                >
                                                    <MinusCircle className="w-5 h-5" />
                                                </button>
                                                <span className="mx-2 w-8 text-center font-serif">{item.quantity}</span>
                                                <button 
                                                    onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                                    disabled={updatingCart || item.quantity >= item.stock}
                                                    className="text-purple-500 hover:text-purple-700 disabled:text-gray-300 transition-colors"
                                                >
                                                    <PlusCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <div className="text-sm font-serif">
                                                <span className="font-medium text-purple-600">${item.price.toFixed(2)}</span> per edition
                                            </div>
                                            <div className="font-serif">
                                                Value: <span className="text-purple-600">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                            {item.stock <= 5 && (
                                                <div className="text-xs text-amber-600 flex items-center">
                                                    <Star className="w-3 h-3 mr-1 fill-amber-500" />
                                                    Only {item.stock} editions remain available
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Actions */}
                                    <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-3 mt-2 sm:mt-0">
                                        <button
                                            onClick={() => handleRemoveItem(item)}
                                            disabled={updatingCart}
                                            className="text-red-400 hover:text-red-600 text-sm font-serif italic flex items-center disabled:opacity-50 transition-colors group"
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            <span className="relative">
                                                Remove
                                                <span className="absolute bottom-0 left-0 w-0 h-px bg-red-400 group-hover:w-full transition-all"></span>
                                            </span>
                                        </button>
                                        <Link
                                            href={`/products/${item.id}`}
                                            className="text-purple-500 hover:text-purple-700 text-sm font-serif italic flex items-center group"
                                        >
                                            <FileText className="w-4 h-4 mr-1" />
                                            <span className="relative">
                                                Details
                                                <span className="absolute bottom-0 left-0 w-0 h-px bg-purple-500 group-hover:w-full transition-all"></span>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
                        <DecorativeCorner position="bottom-left" />
                        <DecorativeCorner position="bottom-right" />
                    </div>
                </div>
                
                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20 border border-purple-100 relative overflow-hidden">
                        <DecorativeCorner position="top-left" />
                        <DecorativeCorner position="top-right" />
                        <DecorativeCorner position="bottom-left" />
                        <DecorativeCorner position="bottom-right" />
                        
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-serif italic text-purple-800">Acquisition Summary</h2>
                            <div className="w-12 h-px bg-amber-300 mx-auto mt-2"></div>
                        </div>
                        
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-serif italic">Collection Value</span>
                                <span className="font-medium">${cartTotals.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-serif italic">Delivery</span>
                                <span className="text-amber-600 font-serif italic">Complimentary</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-serif italic">Gallery Commission (8%)</span>
                                <span className="font-medium">${cartTotals.tax.toFixed(2)}</span>
                            </div>
                            <div className="pt-4 mt-4 relative">
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
                                <div className="flex justify-between items-center font-serif">
                                    <span className="italic text-purple-800">Total Investment</span>
                                    <span className="text-xl text-purple-800">${cartTotals.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        
                        <Link href={`/checkout?type=cart`}>
                            <button 
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-serif italic py-3 px-4 rounded-full shadow-md transition-all"
                            >
                                Complete Acquisition
                            </button>
                        </Link>
                        
                        <div className="mt-8">
                            <h3 className="font-serif italic text-center text-purple-800 mb-3">Patron Payment Options</h3>
                            <div className="flex flex-wrap justify-center gap-2">
                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-3 py-2 rounded-md text-sm font-serif italic text-purple-700">Visa</div>
                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-3 py-2 rounded-md text-sm font-serif italic text-purple-700">Mastercard</div>
                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-3 py-2 rounded-md text-sm font-serif italic text-purple-700">PayPal</div>
                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-3 py-2 rounded-md text-sm font-serif italic text-purple-700">COD</div>
                            </div>
                        </div>
                        
                        <div className="mt-8 text-sm text-center">
                            <p className="text-gray-500 font-serif italic">Questions about your collection? <Link href="/contact" className="text-purple-600 hover:text-purple-800 transition-colors hover:underline">Contact our curators</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}