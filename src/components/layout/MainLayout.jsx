import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isCheckoutPage = location.pathname.startsWith('/checkout');

  if (isCheckoutPage) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {!isHomePage && <Header />}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
