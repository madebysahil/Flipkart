import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  { name: 'Mobiles', image: 'https://rukminim2.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png?q=100' },
  { name: 'Fashion', image: 'https://rukminim2.flixcart.com/fk-p-flap/128/128/image/0d75b34f7d8fbcb3.png?q=100' },
  { name: 'Electronics', image: 'https://rukminim2.flixcart.com/flap/128/128/image/69c6589653afdb9a.png?q=100' },
  { name: 'Home', image: 'https://rukminim2.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg?q=100' },
  { name: 'Appliances', image: 'https://rukminim2.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png?q=100' },
  { name: 'Beauty, Toys', image: 'https://rukminim2.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png?q=100' }
];

const ProductCard = ({ product }) => (
  <Link to={`/product/${product._id}`} className="group bg-white p-4 rounded-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center">
    <div className="h-40 w-full flex items-center justify-center mb-4 overflow-hidden relative">
      <img src={product.images?.[0] || 'https://via.placeholder.com/150'} alt={product.title} className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300" />
    </div>
    <h3 className="text-sm text-gray-800 font-medium truncate w-full text-center">{product.title}</h3>
    <div className="mt-2 flex items-center gap-2">
      <span className="font-semibold text-gray-900">₹{product.price}</span>
      {product.oldPrice && <span className="text-sm text-gray-500 line-through">₹{product.oldPrice}</span>}
      {product.discount && <span className="text-sm text-green-600 font-bold">{product.discount}% off</span>}
    </div>
  </Link>
);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  const groupedProducts = products.reduce((acc, product) => {
    const cat = product.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  return (
    <div className="bg-background min-h-screen pb-8">
      {/* Categories Bar */}
      <div className="bg-white shadow-sm overflow-x-auto hide-scrollbar">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between min-w-max gap-8 sm:gap-4">
          {categories.map((cat, index) => (
            <div key={index} className="flex flex-col items-center gap-1 cursor-pointer group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center overflow-hidden">
                <img src={cat.image} alt={cat.name} className="object-contain h-full w-full" />
              </div>
              <span className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Banner */}
      <div className="w-full bg-blue-50 py-2 sm:py-4">
        <div className="max-w-[1600px] mx-auto px-2 sm:px-4">
          {/* Desktop Banner */}
          <div className="hidden md:block w-full h-[280px] bg-gray-200 rounded-sm overflow-hidden relative group cursor-pointer shadow-sm">
            <img src="/images/banners/banner1.jpg" alt="Freedom Sale" className="w-full h-full object-cover" />
          </div>
          {/* Mobile Banner */}
          <div className="md:hidden w-full h-[180px] bg-gray-200 rounded-sm overflow-hidden relative cursor-pointer shadow-sm">
            <img src="/images/banners/banner1.jpg" alt="Freedom Sale Mobile" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">Loading products...</div>
      ) : (
        <>
          {Object.entries(groupedProducts).map(([category, items]) => (
            <div key={category} className="max-w-7xl mx-auto mt-2 sm:mt-4 bg-white p-4 shadow-sm relative">
              <div className="flex justify-between items-center mb-4 border-b pb-3">
                <h2 className="text-xl font-bold text-gray-800">Best of {category}</h2>
                <button className="bg-primary hover:bg-blue-700 text-white p-2 rounded-full transition-colors">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-2">
                {items.map((product) => (
                  <div key={product._id} className="min-w-[160px] sm:min-w-[200px] md:min-w-[220px] flex-shrink-0">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Home;
