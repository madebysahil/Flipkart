import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, addToCart } = useCart();
  const navigate = useNavigate();



  const itemsPrice = useMemo(() => cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0), [cartItems]);
  const discount = useMemo(() => cartItems.reduce((acc, item) => {
    return acc + ((item.product.oldPrice || item.product.price) - item.product.price) * item.quantity;
  }, 0), [cartItems]);
  const deliveryCharge = 0;
  const totalAmount = itemsPrice + deliveryCharge;
  const totalQuantity = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);

  return (
    <div className="bg-background min-h-screen py-4 sm:py-8 pb-20 sm:pb-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white p-8 rounded-sm shadow-sm h-[60vh]">
            <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Empty Cart" loading="lazy" className="h-40 mb-6" />
            <h2 className="text-xl font-medium mb-2">Your cart is empty!</h2>
            <p className="text-gray-500 mb-6 text-sm">Add items to it now.</p>
            <Link to="/" className="bg-primary text-white px-16 py-3 rounded-sm font-medium shadow-sm">Shop Now</Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Left Side - Cart Items */}
            <div className="lg:w-2/3 flex flex-col gap-4">
              <div className="bg-white rounded-sm shadow-sm">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Flipkart ({cartItems.length})</h2>
                </div>
                
                {cartItems.map((item) => (
                  <div key={item.product._id} className="p-4 border-b last:border-b-0 flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-32 flex flex-col items-center gap-4">
                      <img src={item.product.images?.[0]} alt={item.product.title} loading="lazy" className="h-24 object-contain" />
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => addToCart(item.product._id, Math.max(1, item.quantity - 1))}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center bg-gray-50 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >-</button>
                        <span className="w-8 text-center font-medium border border-gray-300 px-1">{item.quantity}</span>
                        <button 
                          onClick={() => addToCart(item.product._id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center bg-gray-50"
                        >+</button>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col gap-2">
                      <Link to={`/product/${item.product._id}`} className="hover:text-primary transition-colors line-clamp-2">
                        {item.product.title}
                      </Link>
                      <div className="text-sm text-gray-500">Category: {item.product.category}</div>
                      
                      <div className="flex items-end gap-2 mt-2">
                        {item.product.oldPrice && <span className="text-gray-500 line-through text-sm">₹{item.product.oldPrice * item.quantity}</span>}
                        <span className="text-lg font-medium text-gray-900">₹{item.product.price * item.quantity}</span>
                        {item.product.discount && <span className="text-green-600 font-bold text-sm mb-0.5">{item.product.discount}% Off</span>}
                      </div>
                      
                      <div className="mt-4 flex gap-6 text-sm font-semibold text-gray-900">
                        <button className="hover:text-primary uppercase tracking-wide">Save for later</button>
                        <button onClick={() => removeFromCart(item.product._id)} className="hover:text-primary uppercase tracking-wide">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-white p-4 flex justify-end shadow-sm sticky bottom-0 sm:static border-t sm:border-0 z-40">
                <button onClick={() => navigate('/checkout')} className="bg-[#fb641b] text-white px-10 py-3 rounded-sm font-semibold uppercase tracking-wide shadow-sm w-full sm:w-auto">
                  Place Order
                </button>
              </div>
            </div>

            {/* Right Side - Price Details */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-sm shadow-sm sticky top-20">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-gray-500 font-semibold uppercase tracking-wide text-sm">Price Details</h3>
                </div>
                <div className="p-4 flex flex-col gap-4 text-base">
                  <div className="flex justify-between">
                    <span>Price ({totalQuantity} items)</span>
                    <span>₹{itemsPrice + discount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span className="text-green-600">- ₹{discount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span className="text-green-600">{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-dashed border-gray-300 pt-4 mt-2">
                    <span>Total Amount</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  {discount > 0 && (
                    <div className="text-green-600 font-semibold text-sm mt-2">
                      You will save ₹{discount} on this order
                    </div>
                  )}
                </div>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
