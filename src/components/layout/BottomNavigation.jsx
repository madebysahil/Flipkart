import { Home, Grid, User, ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const BottomNavigation = () => {
  const location = useLocation();
  const { cartItems } = useCart();
  
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex justify-between items-center px-6 py-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-primary' : 'text-gray-500'}`}>
        <Home className="h-6 w-6" />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      
      <Link to="/categories" className={`flex flex-col items-center gap-1 ${isActive('/categories') ? 'text-primary' : 'text-gray-500'}`}>
        <Grid className="h-6 w-6" />
        <span className="text-[10px] font-medium">Categories</span>
      </Link>
      
      <Link to="/profile" className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-primary' : 'text-gray-500'}`}>
        <User className="h-6 w-6" />
        <span className="text-[10px] font-medium">Account</span>
      </Link>
      
      <Link to="/cart" className={`flex flex-col items-center gap-1 ${isActive('/cart') ? 'text-primary' : 'text-gray-500'} relative`}>
        <div className="relative">
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-2 bg-accent text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium">Cart</span>
      </Link>
    </div>
  );
};

export default BottomNavigation;
