import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, Star } from 'lucide-react';

const HeaderActions = () => (
  <div className="bg-gradient-to-b from-[#2874f0] to-[#8db8f9] px-3 py-3">
    {/* Top Toggle Buttons */}
    <div className="flex items-center justify-between gap-2 mb-3">
      <div className="flex-1 bg-[#ffc200] rounded-md py-1.5 flex flex-col items-center justify-center cursor-pointer shadow-sm">
        <img src="https://rukminim1.flixcart.com/fk-p-flap/52/44/image/d2ecfddf891a3922.png" alt="Flipkart Icon" className="h-4 object-contain mb-0.5" />
        <span className="font-bold text-[12px] italic text-black leading-none">Flipkart</span>
      </div>
      <div className="flex-1 bg-white rounded-md py-1.5 flex flex-col items-center justify-center cursor-pointer shadow-sm">
        <img src="https://rukminim1.flixcart.com/fk-p-flap/58/44/image/7ab4040af860941d.png" alt="Travel Icon" className="h-4 object-contain mb-0.5" />
        <span className="font-bold text-[12px] italic text-black leading-none">Travel</span>
      </div>
    </div>

    {/* Search Bar */}
    <div className="flex items-center bg-white rounded-md px-3 py-2 shadow-sm">
      <Search className="h-5 w-5 text-[#2874f0]" strokeWidth={2} />
      <input 
        type="text" 
        placeholder="Search for Product" 
        className="bg-transparent border-none outline-none w-full ml-2 text-[14px] text-gray-800 placeholder-gray-400"
      />
    </div>
  </div>
);

const CategoryCircles = () => {
  const cats = [
    { name: 'For You', icon: 'https://rukminim1.flixcart.com/fk-p-flap/128/128/image/f0b3f58d99cb98fc.png?q=100', active: true },
    { name: 'Fashion', icon: 'https://rukminim1.flixcart.com/fk-p-flap/128/128/image/0d75b34f7d8fbcb3.png?q=100' },
    { name: 'Mobiles', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png?q=100' },
    { name: 'Beauty', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png?q=100' },
    { name: 'Electroni..', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/69c6589653afdb9a.png?q=100' },
    { name: 'Home', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg?q=100' },
    { name: 'Furnitu..', icon: 'https://rukminim1.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png?q=100' },
  ];

  return (
    <div className="bg-white pt-2 shadow-sm overflow-x-auto hide-scrollbar border-b border-gray-200">
      <div className="flex gap-4 px-3 min-w-max pb-0">
        {cats.map((cat, i) => (
          <div key={i} className={`flex flex-col items-center gap-1 cursor-pointer ${cat.active ? 'border-b-[3px] border-[#2874f0]' : 'border-b-[3px] border-transparent pb-0'}`}>
            <div className={`w-12 h-12 flex items-center justify-center p-2 rounded-xl ${cat.active ? 'bg-[#e3f2fd]' : 'bg-transparent'}`}>
              <img src={cat.icon} alt={cat.name} className="object-contain h-full w-full mix-blend-multiply opacity-80" />
            </div>
            <span className={`text-[11px] mb-1 font-medium ${cat.active ? 'text-[#2874f0] font-bold' : 'text-gray-600'}`}>{cat.name}</span>
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
    <Link to={`/product/${product._id}`} className="bg-white p-3 flex flex-col h-full relative border-r border-b border-gray-100">
      {/* Product Image */}
      <div className="h-[140px] w-full flex items-center justify-center mb-3 overflow-hidden">
        <img src={product.images?.[0] || 'https://via.placeholder.com/150'} alt={product.title} className="max-h-full object-contain" />
      </div>
      
      {/* Title */}
      <h3 className="text-[13px] text-gray-800 truncate mb-1">{product.title}</h3>
      
      {/* Discount & MRP */}
      <div className="flex items-center gap-1.5 mb-0.5">
        {discountPercent > 0 && <span className="text-[12px] text-[#388e3c] font-bold">{discountPercent}% Off</span>}
        {product.oldPrice && <span className="text-[12px] text-gray-400 line-through">₹{product.oldPrice.toLocaleString()}</span>}
      </div>
      
      {/* Selling Price & Badge */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-bold text-[15px] text-black">₹{product.price.toLocaleString()}</span>
        <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="Assured" className="h-[16px] object-contain" />
      </div>

      {/* Ratings */}
      <div className="flex items-center gap-1.5 mb-2">
        <div className="bg-[#388e3c] text-white flex items-center gap-0.5 px-1 py-[2px] rounded-[3px] text-[10px] font-bold">
          {product.rating || '4.8'} <Star className="h-2 w-2 fill-current" />
        </div>
        <span className="text-[11px] font-medium text-gray-500">{product.numReviews || 1060} Ratings</span>
      </div>

      {/* Delivery info */}
      <div className="mt-auto text-[10px] text-gray-600 font-medium text-center pb-1">
        Free Delivery in Two Days
      </div>
    </Link>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(19 * 60 + 35); // 19 mins 35 secs

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
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}min ${s.toString().padStart(2, '0')}sec`;
  };

  return (
    <div className="bg-[#f1f3f6] min-h-screen pb-8 max-w-md mx-auto shadow-sm">
      <HeaderActions />
      <CategoryCircles />

      {/* Hero Banner Area */}
      <div className="w-full bg-white px-2 py-2">
        <div className="w-full rounded-lg overflow-hidden relative">
          <img src="/images/banners/banner1.jpg" alt="Sale Banner" className="w-full h-auto object-cover rounded-lg" />
        </div>
      </div>

      {/* Live Sale Banner */}
      <div className="bg-white pb-3 pt-1 text-center border-b border-gray-200">
        <span className="font-bold text-gray-900 text-[17px]">Live Sale : </span>
        <span className="font-bold text-[#ff5722] text-[17px]">{formatTime(timeLeft)}</span>
      </div>

      {/* Products Grid */}
      <div className="bg-gray-200">
        {loading ? (
          <div className="flex justify-center p-8 bg-white">Loading products...</div>
        ) : (
          <div className="grid grid-cols-2 gap-[1px]">
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
