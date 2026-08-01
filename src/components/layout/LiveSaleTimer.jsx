import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const LiveSaleTimer = () => {
  const [timeLeft, setTimeLeft] = useState(12 * 60); // Default 12 mins
  const [viewers, setViewers] = useState(12312);
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if end time is already in session storage
    let endTime = sessionStorage.getItem('liveSaleEndTime');
    let storedViewers = sessionStorage.getItem('liveSaleViewers');
    const now = Date.now();

    if (!endTime || parseInt(endTime) <= now) {
      // Set new end time: 12 minutes from now
      endTime = now + 12 * 60 * 1000;
      sessionStorage.setItem('liveSaleEndTime', endTime);
    }
    
    if (!storedViewers) {
      storedViewers = 12312;
      sessionStorage.setItem('liveSaleViewers', storedViewers);
    }
    
    setViewers(parseInt(storedViewers));
    
    // Calculate initial time left
    const initialTimeLeft = Math.floor((parseInt(endTime) - now) / 1000);
    setTimeLeft(initialTimeLeft > 0 ? initialTimeLeft : 0);
    setIsLoaded(true);

    const timer = setInterval(() => {
      const currentTime = Date.now();
      const remaining = Math.floor((parseInt(endTime) - currentTime) / 1000);
      setTimeLeft(remaining > 0 ? remaining : 0);
      
      // Randomly increase viewers
      if (Math.random() > 0.7) {
        setViewers(prev => {
          const newV = prev + Math.floor(Math.random() * 3) + 1;
          sessionStorage.setItem('liveSaleViewers', newV);
          return newV;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isLoaded) return null;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}min ${s.toString().padStart(2, '0')}sec`;
  };

  return (
    <div className="bg-white pb-3 pt-2 text-center border-b border-gray-200">
      <div className="flex flex-col items-center justify-center gap-1.5">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-gray-900 text-[17px]">Live Sale : </span>
          <span className="font-bold text-[#ff5722] text-[17px]">{formatTime(timeLeft)}</span>
        </div>
        {location.pathname === '/' && (
          <div className="flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-semibold border border-red-100 shadow-sm">
            <span>{viewers.toLocaleString()} people are watching</span>
            <span className="inline-block animate-[blink_2s_infinite]">👁️</span>
          </div>
        )}
      </div>
      <style>{`
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
      `}</style>
    </div>
  );
};

export default LiveSaleTimer;
