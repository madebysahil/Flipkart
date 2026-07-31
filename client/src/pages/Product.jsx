import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Zap, Star } from 'lucide-react';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading product details...</div>;
  if (!product) return <div className="p-8 text-center">Product not found</div>;

  const handleAddToCart = () => {
    addToCart(product._id, 1);
    navigate('/cart');
  };

  const handleBuyNow = () => {
    addToCart(product._id, 1);
    navigate('/checkout'); // Direct to checkout/address page
  };

  return (
    <div className="bg-background min-h-screen pt-4 pb-24 sm:pb-8">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 sm:flex gap-4">
        
        {/* Left Side - Image Gallery */}
        <div className="sm:w-2/5 p-4 sm:p-8 flex flex-col items-center bg-white border-b sm:border-b-0 sm:border-r border-gray-200 sm:sticky sm:top-20 sm:h-[calc(100vh-80px)] overflow-y-auto">
          <div className="w-full flex justify-center mb-4 h-64 sm:h-96 relative">
            <img 
              src={product.images?.[activeImage] || 'https://via.placeholder.com/400'} 
              alt={product.title} 
              className="max-h-full object-contain cursor-crosshair"
            />
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 mb-8 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`border-2 p-1 rounded-sm ${activeImage === idx ? 'border-primary' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={img} alt="" className="h-12 w-12 object-contain" />
                </button>
              ))}
            </div>
          )}
          
          <div className="flex gap-2 sm:gap-4 w-full mt-4 hidden sm:flex">
            <button onClick={handleAddToCart} className="flex-1 bg-[#ff9f00] text-white py-3 px-2 font-bold flex items-center justify-center gap-2 rounded-sm shadow-sm hover:bg-[#f39800] transition-colors">
              <ShoppingCart className="h-5 w-5" /> ADD TO CART
            </button>
            <button onClick={handleBuyNow} className="flex-1 bg-[#fb641b] text-white py-3 px-2 font-bold flex items-center justify-center gap-2 rounded-sm shadow-sm hover:bg-[#f15e19] transition-colors">
              <Zap className="h-5 w-5" /> BUY NOW
            </button>
          </div>
        </div>

        {/* Right Side - Details */}
        <div className="sm:w-3/5 p-4 sm:p-8 bg-white mt-2 sm:mt-0">
          <h1 className="text-xl sm:text-2xl font-medium text-gray-900">{product.title}</h1>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              {product.rating} <Star className="h-3 w-3 fill-current" />
            </div>
            <span className="text-gray-500 font-medium text-sm">{product.numReviews} Ratings</span>
            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="f-assured" className="h-5 ml-2" />
          </div>

          <div className="mt-4 flex items-end gap-3">
            <span className="text-3xl font-medium text-gray-900">₹{product.price}</span>
            {product.oldPrice && <span className="text-gray-500 line-through mb-1">₹{product.oldPrice}</span>}
            {product.discount && <span className="text-green-600 font-bold mb-1">{product.discount}% off</span>}
          </div>

          {/* Highlights */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="mt-8 flex flex-col sm:flex-row gap-2 sm:gap-8 border-t border-b border-gray-100 py-6">
              <div className="text-gray-500 sm:w-24">Highlights</div>
              <ul className="list-disc pl-6 sm:pl-4 space-y-2 text-sm text-gray-800 font-medium">
                {product.highlights.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="mt-8">
              <div className="border border-gray-200 rounded-sm">
                <h3 className="text-xl sm:text-2xl font-medium text-gray-900 mb-4 border-b p-4 sm:p-6">Specifications</h3>
                
                {product.specifications.map((cat, idx) => (
                  <div key={idx} className="px-4 sm:px-6 mb-6">
                    <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-4 mt-2">{cat.category}</h4>
                    <div className="space-y-4">
                      {cat.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="grid grid-cols-12 text-sm">
                          <div className="text-gray-500 col-span-4 sm:col-span-3 pr-2">{item.name}</div>
                          <div className="text-gray-900 col-span-8 sm:col-span-9">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Sticky Action Buttons */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)] flex z-[9999] pb-[env(safe-area-inset-bottom)]">
        <button onClick={handleAddToCart} className="flex-1 bg-white text-gray-800 py-3.5 font-bold flex items-center justify-center gap-2 border-t border-r border-gray-300">
          ADD TO CART
        </button>
        <button onClick={handleBuyNow} className="flex-1 bg-[#fb641b] text-white py-3.5 font-bold flex items-center justify-center gap-2 border-t border-[#fb641b]">
          BUY NOW
        </button>
      </div>
    </div>
  );
};

export default Product;
