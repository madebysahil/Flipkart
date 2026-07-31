import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Zap, Star, ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react';

const dummyReviews = [
  { rating: 5, title: "Terrific purchase", comment: "Awesome phone, camera quality is superb. Battery backup is also very good. Delivery was on time.", author: "Ramesh Kumar", location: "New Delhi", date: "1 month ago", likes: 234, dislikes: 12 },
  { rating: 4, title: "Good quality product", comment: "Everything is good but the charger could have been faster. Display is buttery smooth.", author: "Priya Sharma", location: "Mumbai", date: "2 months ago", likes: 145, dislikes: 5 },
  { rating: 5, title: "Simply awesome", comment: "Best in this price segment. Value for money. Highly recommended!", author: "Suresh", location: "Bengaluru", date: "15 days ago", likes: 89, dislikes: 2 },
];

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const scrollRef = useRef(null);

  const handleThumbnailClick = (idx) => {
    setActiveImage(idx);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: idx * scrollRef.current.offsetWidth, behavior: 'smooth' });
    }
  };

  const handleScroll = (e) => {
    const scrollPosition = e.target.scrollLeft;
    const itemWidth = e.target.offsetWidth;
    const newIndex = Math.round(scrollPosition / itemWidth);
    if (newIndex !== activeImage) {
      setActiveImage(newIndex);
    }
  };

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
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="w-full flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mb-4 h-64 sm:h-96 relative scroll-smooth"
          >
            {product.images && product.images.length > 0 ? (
              product.images.map((img, idx) => (
                <div key={idx} className="w-full shrink-0 flex justify-center snap-center relative">
                  <img src={img} alt={product.title} className="max-h-full object-contain cursor-crosshair" />
                </div>
              ))
            ) : (
              <div className="w-full shrink-0 flex justify-center snap-center relative">
                <img src="https://via.placeholder.com/400" alt={product.title} className="max-h-full object-contain" />
              </div>
            )}
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 mb-8 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleThumbnailClick(idx)}
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
          <h1 className="text-xl sm:text-2xl font-medium text-[#212121]">{product.title}</h1>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="bg-[#388e3c] text-white text-xs font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-1">
              {product.rating} <Star className="h-3 w-3 fill-current" />
            </div>
            <span className="text-[#878787] font-medium text-sm">
              {((product.numReviews && product.numReviews > 0) ? product.numReviews : 14295).toLocaleString()} Ratings & {Math.floor(((product.numReviews && product.numReviews > 0) ? product.numReviews : 14295) / 8).toLocaleString()} Reviews
            </span>
            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="f-assured" className="h-5 ml-2" />
          </div>

          <div className="mt-4 flex items-end gap-3">
            <span className="text-[28px] font-medium text-[#212121]">₹{product.price.toLocaleString()}</span>
            {product.oldPrice && <span className="text-[#878787] line-through mb-1.5 text-sm">₹{product.oldPrice.toLocaleString()}</span>}
            {product.discount && <span className="text-[#388e3c] font-bold mb-1.5 text-sm">{product.discount}% off</span>}
          </div>

          {/* Highlights */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="mt-6 border border-gray-200 rounded-sm">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                 <h2 className="text-[16px] font-medium text-[#212121]">Highlights</h2>
              </div>
              <div className="p-4 sm:p-6">
                <ul className="space-y-2">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="text-[#c2c2c2] mt-2 text-[8px]">●</span>
                      <span className="text-[14px] text-[#212121]">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="mt-6 border border-gray-200 rounded-sm mb-4">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-[20px] font-medium text-[#212121]">Specifications</h3>
              </div>
              
              <div className="p-4 sm:p-6">
                {product.specifications.map((cat, idx) => (
                  <div key={idx} className="mb-6 last:mb-0">
                    <h4 className="text-[16px] font-medium text-[#212121] mb-4 pb-2 border-b border-gray-100">{cat.category}</h4>
                    <div className="flex flex-col space-y-3">
                      {cat.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex text-[14px]">
                          <div className="text-[#878787] w-1/3 pr-2">{item.name}</div>
                          <div className="text-[#212121] w-2/3">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ratings & Reviews */}
          <div className="mt-6 border border-gray-200 rounded-sm mb-4">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-[20px] font-medium text-[#212121]">Ratings & Reviews</h3>
              <button className="bg-white text-[#2874f0] text-[14px] font-medium px-4 py-2 rounded-sm shadow-[0_1px_2px_0_rgba(0,0,0,0.2)]">Rate Product</button>
            </div>
            
            <div className="flex flex-col">
              {dummyReviews.map((review, idx) => (
                <div key={idx} className="p-4 sm:p-6 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`${review.rating >= 4 ? 'bg-[#388e3c]' : 'bg-[#ff9f00]'} text-white text-xs font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-1`}>
                      {review.rating} <Star className="h-3 w-3 fill-current" />
                    </div>
                    <span className="font-medium text-[#212121]">{review.title}</span>
                  </div>
                  <p className="text-[#212121] text-[14px] mb-4">{review.comment}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2 text-[12px] text-[#878787]">
                      <span>{review.author}</span>
                      <CheckCircle className="h-3 w-3 text-[#878787] ml-1 hidden sm:block" />
                      <span className="hidden sm:inline">Certified Buyer, {review.location}</span>
                      <span className="mx-1 hidden sm:inline">•</span>
                      <span>{review.date}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-[#878787] text-[12px]">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-[#212121]">
                        <ThumbsUp className="h-4 w-4" /> {review.likes}
                      </div>
                      <div className="flex items-center gap-1 cursor-pointer hover:text-[#212121]">
                        <ThumbsDown className="h-4 w-4" /> {review.dislikes}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
