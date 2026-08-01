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

const SvgForYou = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M9.93061 6.51562H22.0706C24.0006 6.51562 25.6206 7.98562 25.8306 9.92562L27.5106 25.2356C27.7606 27.5056 26.0006 29.4856 23.7506 29.4856H8.25061C5.99061 29.4856 4.24061 27.5056 4.49061 25.2356L6.17061 9.92562C6.38061 7.98562 8.00061 6.51562 9.93061 6.51562Z" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round"></path>
    <path d="M22.0507 11.7061C22.0507 15.0861 19.3407 17.8261 16.0107 17.8261C12.6807 17.8261 9.9707 15.0861 9.9707 11.7061" fill="#ffe51f"></path>
    <path d="M22.0507 11.7061C22.0507 15.0861 19.3407 17.8261 16.0107 17.8261C12.6807 17.8261 9.9707 15.0861 9.9707 11.7061" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round"></path>
  </svg>
);

const SvgFashion = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M8.58301 24.6445H23.3717V25.7525C23.3717 27.4093 22.0285 28.7525 20.3717 28.7525H11.583C9.92615 28.7525 8.58301 27.4093 8.58301 25.7525V24.6445Z" fill="#ffe51f"></path>
    <path d="M16.0003 10.6766C13.1536 10.6766 12.1563 8.21071 11.9404 6.48294C11.8966 6.13193 11.5352 5.88942 11.2056 6.01794C10.418 6.3251 9.33827 6.73537 8.60601 6.97946C7.6201 7.3081 6.82589 8.75958 6.55203 9.44424L4.79622 14.7117C4.62878 15.214 4.88191 15.7597 5.37351 15.9564L8.60601 17.2494V26.7517C8.60601 27.8562 9.50144 28.7517 10.606 28.7517H21.3947C22.4992 28.7517 23.3947 27.8562 23.3947 26.7517V17.2494L26.6645 15.9414C27.1406 15.751 27.3961 15.232 27.2499 14.7405C26.631 12.6601 25.6079 9.47765 25.0379 8.62264C24.3806 7.63673 23.6685 7.11639 23.3947 6.97946L20.7839 6.00041C20.457 5.87783 20.1047 6.11968 20.0623 6.4662C19.8508 8.19473 18.8563 10.6766 16.0003 10.6766Z" stroke="#333333" strokeWidth="1.4"></path>
    <path d="M8.99414 24.6445H22.9612" stroke="#333333" strokeWidth="1.4" strokeLinecap="round"></path>
    <path d="M23.3941 17.661V13.9639M8.60547 17.661V13.9639" stroke="#333333" strokeWidth="1.4" strokeLinecap="round"></path>
  </svg>
);

const SvgMobiles = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M9.7998 24.9199V27.1199C9.7998 28.5899 10.9898 29.7799 12.4598 29.7799H19.7598C21.2298 29.7799 22.4198 28.5899 22.4198 27.1199V25.0799" fill="#ffe51f"></path>
    <path d="M9.7998 24.9199V27.1199C9.7998 28.5899 10.9898 29.7799 12.4598 29.7799H19.7598C21.2298 29.7799 22.4198 28.5899 22.4198 27.1199V25.0799" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round"></path>
    <path d="M12.4198 6.7998H19.7998C21.2498 6.7998 22.4198 7.9698 22.4198 9.4198V27.1298C22.4198 28.5998 21.2298 29.7898 19.7598 29.7898H12.4598C10.9898 29.7898 9.7998 28.5998 9.7998 27.1298V9.4198C9.7998 7.9698 10.9698 6.7998 12.4198 6.7998Z" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round"></path>
    <path d="M14.8994 9.24023H16.8994" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round"></path>
    <path d="M14.1699 27.4102H18.1699" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round"></path>
  </svg>
);

const SvgBeauty = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M12.2291 14.4229H19.5191C20.3191 14.4229 20.9691 15.0729 20.9691 15.8729V26.9529C20.9691 28.2529 19.9091 29.3129 18.6091 29.3129H13.1491C11.8491 29.3129 10.7891 28.2529 10.7891 26.9529V15.8729C10.7891 15.0729 11.4391 14.4229 12.2391 14.4229H12.2291Z" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round"></path>
    <path d="M18.1886 14.4427V9.24269C18.1886 9.06269 18.1086 8.88269 17.9586 8.77269L14.5386 6.03269C14.1386 5.71269 13.5586 6.00269 13.5586 6.50269V14.4427H18.1886Z" fill="#ffe51f" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round"></path>
    <path d="M11.3691 17.4727L20.8691 17.6027" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round"></path>
  </svg>
);

const SvgElectronics = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M4.99121 23.2591V10.0236C4.99121 9.03574 5.78867 8.23828 6.77657 8.23828H25.3086C26.2965 8.23828 27.094 9.03574 27.094 10.0236V23.2591" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round"></path>
    <path d="M2.26483 24.3418H29.7475V26.508C29.7475 28.0315 28.5096 29.2694 26.9861 29.2694H5.01428C3.49078 29.2694 2.25293 28.0315 2.25293 26.508V24.3418H2.26483Z" fill="#ffe51f" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round"></path>
    <path d="M13.751 26.9131H18.3453" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round"></path>
  </svg>
);

const SvgHome = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
    <path fill="#ffe51f" d="M20.86,8.76h-9.69l1.07-3.25h7.41l.56,1.75.5,1.51h.15Z"></path>
    <path fill="none" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" d="M16.03,27.82v-10.18"></path>
    <line strokeLinecap="round" fill="none" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" x1="10.67" y1="27.82" x2="21.33" y2="27.82"></line>
    <path strokeLinecap="round" fill="none" stroke="#333333" strokeWidth="1.4" strokeLinejoin="round" d="M9.05,17.64h13.95c.66,0,1.13-.64.92-1.27l-3.57-10.87c-.13-.4-.5-.67-.92-.67h-6.91c-.42,0-.79.27-.92.67l-3.47,10.87c-.2.62.27,1.26.92,1.26Z"></path>
  </svg>
);

const SvgFurniture = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M28.1679 23.9892C28.0729 24.8557 27.2301 25.5205 26.2211 25.5205H5.13934C4.09475 25.5205 3.22821 24.8083 3.1926 23.918L2.21923 18.2439C2.17175 17.8641 2.51599 17.5317 2.95519 17.5317H5.28179C5.60229 17.5317 5.88718 17.7098 5.98214 17.9709C5.98214 17.9709 5.98214 17.9828 5.98214 17.9946L7.08609 21.4133C7.19292 21.7338 7.52529 21.9475 7.90514 21.9475H23.9302C24.3219 21.9475 24.6661 21.7219 24.7611 21.3896L25.7345 17.9828C25.8175 17.6979 26.1143 17.4961 26.4585 17.4961H29.0344C29.3291 17.4961 29.5804 17.6451 29.7028 17.8545C29.7727 17.9741 29.8006 18.1134 29.7704 18.2558L28.1679 23.9892Z" fill="#ffe51f" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round"></path>
    <path d="M5.38965 29.1298L6.65978 26.9219" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round"></path>
    <path d="M26.3277 29.1298L25.0576 26.9219" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round"></path>
    <path d="M8.03613 21.7937L9.22317 12.1193C9.22317 10.505 10.5289 9.19922 12.1433 9.19922H19.7047C21.3191 9.19922 22.6248 10.505 22.6248 12.1193L23.8119 21.7937" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round"></path>
  </svg>
);

const CategoryCircles = () => {
  const cats = [
    { name: 'For You', SvgIcon: SvgForYou, active: true },
    { name: 'Fashion', SvgIcon: SvgFashion },
    { name: 'Mobiles', SvgIcon: SvgMobiles },
    { name: 'Beauty', SvgIcon: SvgBeauty },
    { name: 'Electroni..', SvgIcon: SvgElectronics },
    { name: 'Home', SvgIcon: SvgHome },
    { name: 'Furnitu..', SvgIcon: SvgFurniture },
  ];

  return (
    <div className="bg-[#f0f8ff] bg-gradient-to-b from-[#eaf3ff] to-white pt-2 shadow-sm overflow-x-auto hide-scrollbar border-b border-gray-200">
      <div className="flex gap-4 px-3 min-w-max pb-0">
        {cats.map((cat, i) => (
          <div key={i} className={`flex flex-col items-center gap-0.5 cursor-pointer ${cat.active ? 'border-b-[3px] border-[#2874f0]' : 'border-b-[3px] border-transparent pb-0'}`}>
            <div className={`w-[52px] h-[52px] flex items-center justify-center rounded-[14px] ${cat.active ? 'bg-[#d8e9fd] shadow-sm' : 'bg-transparent'}`}>
              <cat.SvgIcon />
            </div>
            <span className={`text-[11px] mb-1 font-medium ${cat.active ? 'text-[#2874f0] font-bold' : 'text-gray-700'}`}>{cat.name}</span>
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
          {Number(product.rating) > 0 ? product.rating : '4.8'} <Star className="h-2 w-2 fill-current" />
        </div>
        <span className="text-[11px] font-medium text-gray-500">{(Number(product.numReviews) > 0 ? Number(product.numReviews) : 14295).toLocaleString()} Ratings</span>
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

      {/* Freedom Sale Banner */}
      <div className="w-full bg-white px-2 pt-2 pb-1">
        <div className="w-full rounded-lg overflow-hidden relative bg-gradient-to-r from-[#ff9933] via-white to-[#138808] p-[2px] shadow-sm">
          <div className="bg-white rounded-md w-full h-full flex flex-col items-center justify-center py-3 relative overflow-hidden">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-400 via-transparent to-green-500 pointer-events-none"></div>
            <h2 className="text-[22px] font-black italic text-transparent bg-clip-text bg-gradient-to-r from-[#ff6100] via-[#212121] to-[#0a6600] uppercase tracking-wide leading-tight mb-1 relative z-10 drop-shadow-sm">
              The Freedom Sale
            </h2>
            <div className="flex items-center gap-2 relative z-10">
              <span className="bg-[#fb641b] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider animate-pulse">Live Now</span>
              <span className="text-[#212121] text-[13px] font-bold">Up to 80% Off</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-1 font-medium relative z-10">On Electronics, Fashion & more</p>
          </div>
        </div>
      </div>

      {/* Existing Hero Banner Area */}
      <div className="w-full bg-white px-2 py-1">
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
