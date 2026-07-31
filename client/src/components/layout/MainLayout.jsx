import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BottomNavigation from './BottomNavigation';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pb-16 sm:pb-0">
        <Outlet />
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default MainLayout;
