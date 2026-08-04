import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
const Product = lazy(() => import('./pages/Product'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const PaymentStatus = lazy(() => import('./pages/PaymentStatus'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import config from '../config.json';
import { useEffect } from 'react';

// A simple loading fallback
const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-50">
    <div className="h-10 w-10 border-4 border-[#2874f0] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  useEffect(() => {
    if (config.PIXEL_ID) {
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', config.PIXEL_ID);
      window.fbq('track', 'PageView');
    }
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="product/:id" element={<Product />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="payment/status" element={<PaymentStatus />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
