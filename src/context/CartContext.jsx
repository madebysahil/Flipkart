import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const local = localStorage.getItem('guestCart');
    return local ? JSON.parse(local) : [];
  });
  
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      const local = localStorage.getItem('guestCart');
      setCartItems(local ? JSON.parse(local) : []);
    }
  }, [user]);

  const saveLocalCart = (items) => {
    setCartItems(items);
    if (!user) {
      localStorage.setItem('guestCart', JSON.stringify(items));
    }
  };

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart');
      setCartItems(data.cartItems || []);
    } catch (error) {
      console.error('Error fetching cart', error);
    }
  };

  const addToCart = async (productId, quantity) => {
    if (!user) {
      try {
        const { data: product } = await api.get(`/products/${productId}`);
        const updated = [...cartItems];
        const existing = updated.find(item => item.product._id === productId);
        if (existing) {
          existing.quantity = quantity;
        } else {
          updated.push({ product, quantity });
        }
        saveLocalCart(updated);
      } catch (error) {
        console.error('Error fetching product for guest cart', error);
      }
      return;
    }
    
    try {
      const { data } = await api.post('/cart', { productId, quantity });
      setCartItems(data.cartItems || []);
    } catch (error) {
      console.error('Error adding to cart', error);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) {
      const updated = cartItems.filter(item => item.product._id !== productId);
      saveLocalCart(updated);
      return;
    }

    try {
      const { data } = await api.delete(`/cart/${productId}`);
      setCartItems(data.cartItems || []);
    } catch (error) {
      console.error('Error removing from cart', error);
    }
  };

  const clearCart = async () => {
    if (!user) {
      saveLocalCart([]);
      return;
    }

    try {
      await api.delete('/cart');
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart', error);
    }
  }

  return (
    <CartContext.Provider value={{ cartItems, fetchCart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
