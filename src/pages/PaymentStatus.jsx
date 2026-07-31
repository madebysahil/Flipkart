import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const isSuccess = searchParams.get('success');
  const amountStr = searchParams.get('amount');
  const amount = amountStr ? parseFloat(amountStr) : 490;
  const utr = searchParams.get('utr');
  
  const [status, setStatus] = useState(isSuccess === 'true' ? 'success' : 'loading');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (orderId && !isSuccess) {
      verifyPayment(orderId);
    } else if (isSuccess !== 'true' && !orderId) {
      setStatus('failed');
    }
  }, [orderId, isSuccess]);

  const verifyPayment = async (order_id) => {
    try {
      const { data } = await api.post('/payment/verify', { order_id });
      if (data.success) {
        setStatus('success');
      } else {
        setStatus('failed');
      }
    } catch (error) {
      console.error('Payment verification error', error);
      setStatus('failed');
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-[#f1f3f6]">Verifying your payment...</div>;
  }

  const superCoins = Math.floor(amount / 100 * 4); // Fake Flipkart logic for SuperCoins

  if (utr) {
    return (
      <div className="bg-[#f1f3f6] min-h-screen flex items-center justify-center p-4 font-sans">
        <div className="bg-white max-w-[360px] w-full rounded-xl shadow-sm p-6 text-center shadow-lg">
          <div className="w-16 h-16 rounded-full bg-[#e6f4ea] flex items-center justify-center mx-auto mb-4">
            <div className="w-10 h-10 rounded-full bg-[#34a853] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">UTR Submitted!</h2>
          <p className="text-[13px] text-gray-500 mb-6 leading-tight">
            Your payment details have been received. We will verify and confirm your order shortly.
          </p>

          <div className="bg-[#f3f4f6] py-3 rounded-lg mb-4 text-sm font-medium text-gray-700">
            UTR Number: <span className="text-[#2874f0]">{utr}</span>
          </div>

          <div className="bg-[#fff8e1] border-l-4 border-[#ffc107] p-3 text-left mb-6 text-[12px] text-gray-700 rounded-r-sm">
            Please allow 5-10 minutes for payment verification. You will receive a confirmation once your order is confirmed.
          </div>

          <Link to="/" className="block w-full text-center bg-[#2874f0] text-white py-3 rounded-md font-medium hover:bg-[#1a5fcd] transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f1f3f6] min-h-screen font-sans">
      {/* Blue Header */}
      <div className="bg-[#2874f0] text-white px-4 py-3 flex items-center gap-3 shadow-sm sticky top-0 z-50">
        <ArrowLeft className="h-6 w-6 cursor-pointer" onClick={() => navigate('/')} />
        <h1 className="text-[18px] font-medium">Order Details</h1>
      </div>

      <div className="max-w-md mx-auto mt-2">
        {status === 'success' ? (
          <>
            {/* Success Card */}
            <div className="bg-white p-6 flex flex-col items-center justify-center border-b border-gray-200">
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-16 h-16 rounded-full bg-[#26a541] flex items-center justify-center mb-4 shadow-md"
              >
                <motion.svg 
                  initial={{ pathLength: 0 }} 
                  animate={{ pathLength: 1 }} 
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-8 h-8 text-white" 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                >
                  <motion.path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </motion.svg>
              </motion.div>

              <h2 className="text-xl font-medium text-gray-900 mb-1">Order placed for ₹{amount}</h2>
              <p className="text-sm text-gray-500">Your order has been placed successfully.</p>
            </div>

            {/* SuperCoin Card */}
            <div className="bg-white mt-2 p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#fffcf5] flex items-center justify-center shadow-[0_0_8px_rgba(255,200,0,0.3)]">
                <img src="https://rukminim1.flixcart.com/lockin/32/32/images/super_coin_icon_22x22.png" alt="SuperCoin" className="w-6 h-6 object-contain" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">You earned {superCoins} SuperCoins!</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Will be credited after the return period is over</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 px-4 space-y-3">
              {user ? (
                <Link to="/profile" className="block w-full text-center bg-[#2874f0] text-white py-3 rounded-sm font-medium shadow-sm hover:bg-[#1a5fcd] transition-colors">
                  View Order Details
                </Link>
              ) : null}
              <Link to="/" className="block w-full text-center bg-white text-[#2874f0] border border-[#2874f0] py-3 rounded-sm font-medium shadow-sm hover:bg-gray-50 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </>
        ) : (
          <div className="bg-white p-8 text-center mt-2 border-b border-gray-200">
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-sm text-gray-500 mb-6">Something went wrong with your transaction. Please try again.</p>
            <Link to="/checkout" className="inline-block w-full bg-[#fb641b] text-white py-3 rounded-sm font-medium shadow-sm">
              Retry Payment
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
