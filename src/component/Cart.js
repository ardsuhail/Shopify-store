"use client";
import React from "react";
import { useAppContext } from "./Context";
import { X, Plus, Minus, Trash2, ShoppingBag, Shield, Truck, Lock, Check } from "lucide-react";

const Cart = () => {
  const { isCartOpen, setIsCartOpen, cart, addToCart, removeFromCart, deleteAllItems } = useAppContext();
  const [selectedItems, setSelectedItems] = React.useState(new Set());

  // Calculate totals only for selected items
  const selectedCartItems = cart.filter(item => selectedItems.has(item.id));
  
  const subtotal = selectedCartItems.reduce((total, item) => 
    total + (parseFloat(item.product_price) * item.quantity), 0
  );
  const shipping = subtotal > 50 ? 0 : 0;
  const tax =0;
  const total = subtotal + shipping + tax;

  // Toggle item selection
  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Select all items
  const selectAllItems = () => {
    if (selectedItems.size === cart.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cart.map(item => item.id)));
    }
  };

  const handleIncrease = (product) => {
    addToCart(product);
  };

  const handleDecrease = (id) => {
    removeFromCart(id);
  };

  const handleRemove = (id) => {
    deleteAllItems(id);
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  // Close cart when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsCartOpen(false);
    }
  };

  return (
    <>
      {/* Backdrop - Fixed body scroll issue */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 z-40 transition-opacity duration-300"
          onClick={handleBackdropClick}
        />
      )}

      {/* Cart Panel */}
      <div
        className={`fixed top-0 right-0 min-h-screen w-full sm:w-96 bg-white z-50 transform transition-transform duration-500 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
              <p className="text-sm text-emerald-600 font-medium">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Cart Items with Scroll */}
        <div className="flex-1 overflow-y-auto pb-6 h-60 ">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center  justify-center h-full px-6 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some products to get started</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Select All Option */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <button
                  onClick={selectAllItems}
                  className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200 ${
                    selectedItems.size === cart.length 
                      ? 'bg-emerald-500 border-emerald-500' 
                      : 'border-gray-300 hover:border-emerald-500'
                  }`}
                >
                  {selectedItems.size === cart.length && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </button>
                <span className="text-sm font-medium text-gray-700">
                  Select all items ({selectedItems.size}/{cart.length} selected)
                </span>
              </div>

              {/* Cart Items List */}
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4  p-4 mb-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Selection Checkbox */}
                  <button
                    onClick={() => toggleItemSelection(item.id)}
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200 flex-shrink-0 mt-2 ${
                      selectedItems.has(item.id) 
                        ? 'bg-emerald-500 border-emerald-500' 
                        : 'border-gray-300 hover:border-emerald-500'
                    }`}
                  >
                    {selectedItems.has(item.id) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </button>

                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.product_image || '/placeholder.jpg'}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                        {item.title}
                      </h3>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-emerald-600 font-bold text-lg mb-3">
                      ${parseFloat(item.product_price).toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-1">
                        <button
                          onClick={() => handleDecrease(item.id)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-emerald-600 transition-colors duration-200"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-semibold text-gray-900 min-w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncrease(item)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-emerald-600 transition-colors duration-200"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          ${(parseFloat(item.product_price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Summary - Sticky at bottom */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 bg-white p-6 space-y-4 sticky bottom-0">
            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 text-xs text-gray-600 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Secure Checkout</span>
              </div>
            </div>

            {/* Pricing Summary - Only for selected items */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({selectedCartItems.length} items)</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-emerald-600">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Progress Bar for Free Shipping */}
            {subtotal < 50 && subtotal > 0 && (
              <div className="bg-emerald-50 rounded-lg p-3 text-center">
                <p className="text-xs text-emerald-700 font-medium mb-1">
                  Add ${(50 - subtotal).toFixed(2)} for FREE shipping!
                </p>
                <div className="w-full bg-emerald-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                disabled={selectedCartItems.length === 0}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
                  selectedCartItems.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white hover:shadow-xl'
                }`}
              >
                <Lock className="w-4 h-4" />
                Proceed to Checkout ({selectedCartItems.length})
              </button>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;