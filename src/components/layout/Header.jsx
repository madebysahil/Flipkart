import { Search, ShoppingCart, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const { user } = useAuth();
  const { cartItems } = useCart();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="bg-primary text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex-shrink-0 flex items-center gap-1 cursor-pointer">
            <Link to="/">
              <span className="font-bold text-2xl tracking-tight italic">Flipkart<span className="text-yellow-400 text-sm ml-1 not-italic">Plus</span></span>
            </Link>
          </div>

          <div className="flex-1 max-w-2xl mx-8 hidden sm:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-sm leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm"
                placeholder="Search for products, brands and more"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link to={user ? "/profile" : "/login"} className="flex items-center gap-1 hover:text-gray-200 transition-colors bg-white text-primary px-6 py-1 rounded-sm font-semibold">
              <span>{user ? user.name : 'Login'}</span>
            </Link>

            <Link to="/cart" className="flex items-center gap-1 hover:text-gray-200 transition-colors">
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="font-semibold hidden sm:block">Cart</span>
            </Link>
          </div>
          
        </div>
      </div>
      
      {/* Mobile Search */}
      <div className="p-3 bg-primary sm:hidden border-t border-blue-400">
         <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-sm leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent text-sm"
              placeholder="Search for products"
            />
          </div>
      </div>
    </header>
  );
};

export default Header;
