"use client";
import { useState, useEffect } from "react";
import { Trash2, MinusCircle, PlusCircle, RefreshCw, ArrowRight, ShoppingBag } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getProduct } from "@/lib/firestore/products/read"; // Single product fetch
import { getCategory } from "@/lib/firestore/categories/read"; // Import for category data
import { getBrands } from "@/lib/firestore/brands/read"; // Import for brand data - note the plural name
import { useUser } from "@/lib/firestore/user/read"; // Fetch user data
import { 
  updateCartItemQuantity, 
  removeFromCart, 
  clearCart,
  calculateCartTotals 
} from "@/lib/firestore/user/cart"; // Import our new cart functions
import Link from "next/link";

// Category display component based on provided function
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
      <div className="flex gap-1 items-center border border-gray-200 px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors">
        {category.imageUrl && (
          <img
            className="h-4 w-4 object-contain"
            src={category.imageUrl}
            alt={category.name || "Category"}
          />
        )}
        <h4 className="text-xs font-semibold text-blue-800">{category.name}</h4>
      </div>
    </Link>
  );
}

// Brand display component based on provided function
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
        const brandData = await getBrands(brandId); // Using the getBrands function as shown in your code
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
      <div className="flex gap-1 items-center border border-gray-200 px-3 py-1 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
        {brand.imageUrl && (
          <img
            className="h-4 w-4 object-contain"
            src={brand.imageUrl}
            alt={brand.name || "Brand"}
          />
        )}
        <h4 className="text-xs font-semibold text-gray-800">{brand.name}</h4>
      </div>
    </Link>
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
        if (!confirm("Are you sure you want to clear your cart?")) return;
        
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
            <main className="max-w-6xl mx-auto p-6 min-h-screen pt-20">
                <div className="flex items-center justify-center h-64">
                    <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                    <span className="ml-2 text-lg font-medium text-gray-700">Loading your cart...</span>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="max-w-6xl mx-auto p-6 min-h-screen pt-20">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <h2 className="text-red-700 text-lg font-medium">Error loading your cart</h2>
                    <p className="text-red-600">Please try refreshing the page or contact support if the problem persists.</p>
                </div>
            </main>
        );
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <main className="max-w-6xl mx-auto p-6 min-h-screen pt-20">
                <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
                    <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
                    <Link href="/" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-full shadow-md hover:bg-blue-700 transition-colors">
                        Start Shopping <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-6xl mx-auto p-6 min-h-screen pt-20">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
                <p className="text-gray-600">
                    {cartTotals.itemCount} {cartTotals.itemCount === 1 ? 'item' : 'items'} 
                    {cartTotals.itemQuantity > cartTotals.itemCount && ` (${cartTotals.itemQuantity} total)`}
                </p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items List */}
                <div className="lg:w-2/3">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">Cart Items</h2>
                            <button 
                                onClick={handleClearCart}
                                disabled={updatingCart}
                                className="text-red-500 hover:text-red-700 flex items-center text-sm font-medium disabled:opacity-50"
                            >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Clear Cart
                            </button>
                        </div>
                        
                        <div className="divide-y divide-gray-200">
                            {cartItems.map((item) => (
                                <div key={item.id} className="p-4 flex flex-col sm:flex-row gap-4">
                                    {/* Product Image */}
                                    <div className="sm:w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden relative">
                                        {item.featureImageUrl ? (
                                            <div className="relative w-full h-full">
                                                <img
                                                    src={item.featureImageUrl}
                                                    alt={item.title}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center h-full bg-gray-200">
                                                <span className="text-gray-400">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Product Details */}
                                    <div className="flex-grow">
                                        <h3 className="font-medium text-gray-800">{item.title}</h3>
                                        <div className="flex flex-wrap gap-2 mt-1 mb-2">
                                            {item.categoryID && <CategoryDisplay categoryId={item.categoryID} />}
                                            {item.brandID && <BrandDisplay brandId={item.brandID} />}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                            <div className="flex items-center">
                                                <span className="text-sm text-gray-500 mr-2">Quantity:</span>
                                                <button 
                                                    onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                                    disabled={item.quantity <= 1 || updatingCart}
                                                    className="text-gray-500 hover:text-blue-500 disabled:text-gray-300"
                                                >
                                                    <MinusCircle className="w-5 h-5" />
                                                </button>
                                                <span className="mx-2 w-8 text-center font-medium">{item.quantity}</span>
                                                <button 
                                                    onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                                    disabled={updatingCart || item.quantity >= item.stock}
                                                    className="text-gray-500 hover:text-blue-500 disabled:text-gray-300"
                                                >
                                                    <PlusCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-medium text-blue-600">${item.price.toFixed(2)}</span> each
                                            </div>
                                            <div className="font-medium">
                                                Subtotal: <span className="text-blue-600">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                            {item.stock <= 5 && (
                                                <div className="text-xs text-amber-600">
                                                    Only {item.stock} left in stock
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Actions */}
                                    <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2 mt-2 sm:mt-0">
                                        <button
                                            onClick={() => handleRemoveItem(item)}
                                            disabled={updatingCart}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center disabled:opacity-50"
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Remove
                                        </button>
                                        <Link
                                            href={`/products/${item.id}`}
                                            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                        
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">${cartTotals.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Tax (8%)</span>
                                <span className="font-medium">${cartTotals.tax.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3 mt-3">
                                <div className="flex justify-between items-center font-bold">
                                    <span>Total</span>
                                    <span className="text-xl text-blue-700">${cartTotals.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        <Link href={`/checkout?type=cart`}>
                        
                        <button 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-full shadow-md transition-colors flex items-center justify-center"
                            >
                            Proceed to Checkout
                        </button>
                            </Link>
                        
                        <div className="mt-6">
                            <h3 className="font-medium text-gray-800 mb-2">Accepted Payment Methods</h3>
                            <div className="flex flex-wrap gap-2">
                                <div className="bg-gray-100 p-2 rounded text-sm">Visa</div>
                                <div className="bg-gray-100 p-2 rounded text-sm">Mastercard</div>
                                <div className="bg-gray-100 p-2 rounded text-sm">PayPal</div>
                                <div className="bg-gray-100 p-2 rounded text-sm">Apple Pay</div>
                            </div>
                        </div>
                        
                        <div className="mt-6 text-sm text-gray-500">
                            <p>Need help? <Link href="/contact" className="text-blue-600 hover:underline">Contact support</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}