import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft } from 'lucide-react';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const isSuccess = searchParams.get('success');
  const utr = searchParams.get('utr');
  
  const [status, setStatus] = useState(isSuccess === 'true' ? 'success' : 'loading');
  const navigate = useNavigate();

  // Load simulated order data if available
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const savedData = sessionStorage.getItem('lastOrderData');
    if (savedData) {
      setOrderData(JSON.parse(savedData));
    }

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
    <div className="bg-[#f1f3f6] min-h-screen font-sans pb-20">
      {status !== 'success' && (
        <div className="bg-[#2874f0] text-white px-4 py-3 flex items-center gap-3 shadow-sm sticky top-0 z-50">
          <ArrowLeft className="h-6 w-6 cursor-pointer" onClick={() => navigate('/')} />
          <h1 className="text-[18px] font-medium">Order Details</h1>
        </div>
      )}
      <div className="max-w-md mx-auto">
        {status === 'success' ? (
          <>
            {/* Panel 1 */}
            <div className="bg-white px-5 pt-8 pb-5 mb-2">
              <div className="w-[72px] h-[72px] rounded-full bg-[#1dbf73] flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-[22px] font-bold text-black mb-1">Thanks for shopping with us!</h2>
              <p className="text-[15px] text-[#666666] mb-3">Delivery by {orderData?.deliveryDate || 'Sun, Aug 02, 2026'}</p>
              <div className="flex items-center text-[#1dbf73] text-[15px] font-bold">
                <span className="mr-1.5 text-lg">⚡</span> 99 SuperCoins on the way
              </div>
            </div>

            {/* Panel 2 */}
            <div className="bg-white px-5 py-4 mb-2">
              <h3 className="text-[16px] font-bold text-black">Delivery by {orderData?.deliveryDate || 'Sun, Aug 02, 2026'}</h3>
            </div>

            {/* Panel 3 */}
            <div className="bg-white px-5 py-4 mb-2">
              <h3 className="text-[16px] font-bold text-black mb-2">Delivered to:</h3>
              <p className="text-[15px] text-black">{orderData?.address || ', , , '}</p>
            </div>

            {/* Panel 4 */}
            <div className="bg-white px-5 py-5 pb-8 mb-4">
              <div className="bg-[#f9f9f9] rounded-lg p-4">
                <div className="flex items-center mb-3 text-[14px] font-bold text-[#424242]">
                  <span className="mr-2 text-lg">📦</span> Delivery requires an OTP
                </div>
                <p className="text-[13.5px] text-[#424242] leading-relaxed mb-4">
                  We will open the package at your doorstep to check for damages or wrong product delivery. An OTP will be shared when the order is out for delivery.
                </p>
                <p className="text-[13.5px] text-[#424242] leading-relaxed">
                  Share the OTP with the agent to confirm open box delivery.
                </p>
              </div>
            </div>

            {/* Floating button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white p-3 flex justify-center">
              <div className="max-w-md w-full px-2">
                 <Link to="/" className="block w-full text-center bg-[#2874f0] text-white py-3.5 rounded-lg font-bold text-[16px]">
                    Continue Shopping
                 </Link>
              </div>
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
