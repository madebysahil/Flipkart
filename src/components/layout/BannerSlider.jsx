import React, { useState, useEffect } from 'react';

const BannerSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="w-full bg-white px-2 pt-2 pb-3">
      <div className="relative w-full rounded-md overflow-hidden shadow-sm">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, idx) => (
            <img 
              key={idx}
              src={img} 
              alt={`Banner ${idx + 1}`} 
              className="w-full flex-shrink-0 object-cover rounded-md"
            />
          ))}
        </div>
      </div>
      
      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-1.5 mt-2.5">
        {images.map((_, idx) => (
          <div 
            key={idx} 
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
              currentIndex === idx 
                ? 'w-4 bg-gray-800' 
                : 'w-1.5 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
