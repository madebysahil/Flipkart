import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, MapPin, ChevronDown, Clock, Star } from 'lucide-react';

const HeaderActions = () => (
  <div className="bg-white">
    {/* Location Bar */}
    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50/50">
      <MapPin className="h-4 w-4 text-gray-700" />
      <span className="text-sm text-gray-700 font-medium">Location not set</span>
      <span className="text-sm font-semibold text-blue-600 ml-1 cursor-pointer">Select Delivery location</span>
      <ChevronDown className="h-4 w-4 text-blue-600 -ml-1" />
    </div>

    {/* Search Bar */}
    <div className="px-3 pb-3 pt-1">
      <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2.5">
        <Search className="h-5 w-5 text-gray-500" strokeWidth={2} />
        <input 
          type="text" 
          placeholder="Search for Product" 
          className="bg-transparent border-none outline-none w-full ml-2 text-sm text-gray-800 placeholder-gray-500"
        />
      </div>
    </div>
  </div>
);

const CategoryCircles = () => {
  const cats = [
    { name: 'For You', icon: 'https://rukminim1.flixcart.com/fk-p-flap/128/128/image/f0b3f58d99cb98fc.png?q=100' },
    { name: 'Fashion', icon: 'https://rukminim1.flixcart.com/fk-p-flap/128/128/image/0d75b34f7d8fbcb3.png?q=100' },
    { name: 'Mobiles', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png?q=100' },
    { name: 'Beauty', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png?q=100' },
    { name: 'Electronics', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/69c6589653afdb9a.png?q=100' },
    { name: 'Home', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg?q=100' },
    { name: 'Appliances', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png?q=100' },
  ];

  return (
    <div className="bg-white py-2 shadow-sm overflow-x-auto hide-scrollbar border-t border-gray-100 mb-2">
      <div className="flex gap-4 px-3 min-w-max">
        {cats.map((cat, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 cursor-pointer">
            <div className="w-14 h-14 bg-[#f1f3f6] rounded-full flex items-center justify-center p-2">
              <img src={cat.icon} alt={cat.name} className="object-contain h-full w-full mix-blend-multiply" />
            </div>
            <span className="text-[12px] font-semibold text-gray-800">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const discountPercent = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : 0;

  return (
    <Link to={`/product/${product._id}`} className="bg-white p-3 border border-gray-200 hover:shadow-md transition-shadow block relative rounded-md">
      {/* Product Image */}
      <div className="h-[140px] w-full flex items-center justify-center mb-2 overflow-hidden relative">
        <img src={product.images?.[0] || 'https://via.placeholder.com/150'} alt={product.title} className="max-h-full object-contain" />
      </div>
      
      {/* Title */}
      <h3 className="text-[13px] text-gray-800 line-clamp-2 mt-2 leading-[1.3] min-h-[34px]">{product.title}</h3>
      
      {/* Discount & MRP */}
      <div className="mt-1.5 flex items-center gap-2">
        {discountPercent > 0 && <span className="text-[12px] text-[#388e3c] font-bold">{discountPercent}% Off</span>}
        {product.oldPrice && <span className="text-[12px] text-gray-500 line-through">₹{product.oldPrice.toLocaleString()}</span>}
      </div>
      
      {/* Selling Price & Badge */}
      <div className="flex items-center gap-2 mt-0.5">
        <span className="font-bold text-[18px] text-gray-900">₹{product.price.toLocaleString()}</span>
        <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="Assured" className="h-[18px] object-contain ml-auto" />
      </div>

      {/* Ratings */}
      <div className="mt-1.5 flex items-center gap-1.5">
        <div className="bg-[#388e3c] text-white flex items-center gap-1 px-1.5 py-[2px] rounded-[3px] text-[11px] font-bold">
          {product.rating || '4.5'} <Star className="h-2.5 w-2.5 fill-current" />
        </div>
        <span className="text-[11px] font-medium text-gray-500">({product.numReviews || 1024})</span>
      </div>

      {/* Delivery info */}
      <div className="mt-2 text-[11px] text-gray-700 font-medium">Free Delivery in Two Days</div>
    </Link>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(2 * 3600 + 15 * 60); // 2 hours 15 mins

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();

    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}h : ${m.toString().padStart(2, '0')}m : ${s.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="bg-[#f1f3f6] min-h-screen pb-8 max-w-xl mx-auto shadow-sm">
      <HeaderActions />
      <CategoryCircles />

      {/* Hero Banner Area */}
      <div className="w-full bg-white px-2 py-2">
        <div className="w-full rounded-xl overflow-hidden relative shadow-sm">
          <img src="https://rukminim2.flixcart.com/fk-p-flap/3160/1540/image/230f4bb453df0f2e.jpg?q=60" alt="Freedom Sale" className="w-full h-auto object-cover" />
        </div>
      </div>

      {/* Live Sale Banner */}
      <div className="bg-white my-2 p-3 flex items-center justify-between shadow-sm border-t border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-red-500 animate-pulse" />
          <span className="font-black text-gray-900 text-[17px] uppercase tracking-tight">Live Sale :</span>
        </div>
        <div className="bg-red-500 text-white font-bold px-3 py-1 rounded shadow-sm text-sm">
          {formatTime(timeLeft)} left
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-2 mb-6">
        {loading ? (
          <div className="flex justify-center p-8 bg-white mt-2 rounded border border-gray-200">Loading products...</div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Home;
