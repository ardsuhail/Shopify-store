"use client";
import React, { useContext, createContext, useState, useEffect } from "react";
import { getProducts } from "@/server/actions/getProducts";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false)

  // 🛍️ Fetch all products once
  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  // 🧠 LocalStorage cart save/restore
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 🧩 Add to Cart function - FIXED individual quantity
  const addToCart = (product) => {
    console.log('🛒 Adding product to cart:', product);
        fbq('track', 'AddToCart', {
    content_ids: [product.id],
    value: product.price,
    currency: "INR",})
    setCart((prev) => {
      // Create a unique identifier for the product
      const productId = product.id || product._id;
      
      const found = prev.find((item) => item.id === productId);

      if (found) {
        // ✅ FIXED: Only increase quantity of the specific product
        return prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // New product - add to cart
        const cartItem = {
          id: productId,
          title: product.title || product.product_title,
          product_price: 
            product.variants?.[0]?.price || 
            product.price || 
            product.product_price || 
            "0.00",
          product_image:
            product.image?.src ||
            product.images?.[0]?.src ||
            product.product_image?.[0]?.url ||
            product.product_image ||
            "/placeholder.jpg",
          quantity: 1,
        };
        console.log('🛒 New cart item:', cartItem);
        return [...prev, cartItem];
      }
    });
    setIsCartOpen(true);
  };

  // ➖ Remove from cart (decrease quantity) - FIXED
  const removeFromCart = (productId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // 🗑️ Delete all items by id (remove completely)
  const deleteAllItems = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  // Get cart total items count
  const getCartTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Get cart total price
  const getCartTotalPrice = () => {
    return cart.reduce((total, item) => 
      total + (parseFloat(item.product_price) * item.quantity), 0
    );
  };

  return (
    <AppContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        isCartOpen,
        setIsCartOpen,
        products,
        cart,
        addToCart,
        removeFromCart,
        deleteAllItems,
        getCartTotalItems,
        getCartTotalPrice,
        loading,
        setLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};