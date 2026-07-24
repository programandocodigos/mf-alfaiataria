import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load initial cart from localStorage if available
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('aurum_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // UI state for Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isFitFinderOpen, setIsFitFinderOpen] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [isVirtualTryOnOpen, setIsVirtualTryOnOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);

  // Bot Suggestions — products curated by the chatbot
  const [botSuggestions, setBotSuggestions] = useState([]);
  
  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);

  // Sync cart with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aurum_cart', JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const addToCart = (product, selectedSize, quantity = 1) => {
    const size = selectedSize || product.sizes[0];
    const cartItemId = `${product.id}-${size}`;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartItemId,
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            category: product.category,
            fabric: product.fabric,
            size,
            quantity
          }
        ];
      }
    });

    showToast(`"${product.name}" (Tam: ${size}) adicionado ao carrinho!`);
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
    showToast('Item removido do carrinho');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Free Shipping Threshold (e.g., R$ 1.500)
  const freeShippingThreshold = 1500;
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartTotalCount,
      cartSubtotal,
      freeShippingThreshold,
      freeShippingProgress,
      isCartOpen,
      setIsCartOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      isSizeGuideOpen,
      setIsSizeGuideOpen,
      isFitFinderOpen,
      setIsFitFinderOpen,
      isImageSearchOpen,
      setIsImageSearchOpen,
      isVirtualTryOnOpen,
      setIsVirtualTryOnOpen,
      botSuggestions,
      setBotSuggestions,
      selectedProductDetail,
      setSelectedProductDetail,
      toastMessage,
      showToast
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};
