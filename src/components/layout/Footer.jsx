import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-gray-500 text-xs font-semibold uppercase mb-4">About</h4>
          <ul className="space-y-2">
            <li><Link to="#" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Careers</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Press</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gray-500 text-xs font-semibold uppercase mb-4">Help</h4>
          <ul className="space-y-2">
            <li><Link to="#" className="hover:text-white transition-colors">Payments</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Shipping</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Cancellation & Returns</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gray-500 text-xs font-semibold uppercase mb-4">Policy</h4>
          <ul className="space-y-2">
            <li><Link to="#" className="hover:text-white transition-colors">Return Policy</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Terms Of Use</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Security</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Privacy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gray-500 text-xs font-semibold uppercase mb-4">Social</h4>
          <ul className="space-y-2">
            <li><Link to="#" className="hover:text-white transition-colors">Facebook</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Twitter</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">YouTube</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2007-{new Date().getFullYear()} FlipkartClone.com</p>
        <div className="flex gap-4">
          <span className="text-yellow-500 font-bold">Advertise</span>
          <span className="text-yellow-500 font-bold">Gift Cards</span>
          <span className="text-yellow-500 font-bold">Help Center</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
