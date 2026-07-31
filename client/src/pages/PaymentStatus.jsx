import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, XCircle } from 'lucide-react';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [status, setStatus] = useState('loading'); // loading, success, failed
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (orderId) {
      verifyPayment(orderId);
    } else {
      setStatus('failed');
    }
  }, [orderId]);

  const verifyPayment = async (order_id) => {
    try {
      const { data } = await api.post('/payment/verify', { order_id });
      if (data.success) {
        setStatus('success');
        setOrderDetails(data.order);
      } else {
        setStatus('failed');
      }
    } catch (error) {
      console.error('Payment verification error', error);
      setStatus('failed');
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-background">Verifying your payment...</div>;
  }

  return (
    <div className="bg-background min-h-[80vh] py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="bg-white max-w-lg w-full rounded-sm shadow-sm p-8 text-center">
        {status === 'success' ? (
          <>
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-500 mb-6">Your order has been placed successfully.</p>
            {orderDetails && (
              <div className="bg-gray-50 p-4 rounded-sm text-left mb-6 border">
                <p className="text-sm"><span className="text-gray-500">Order ID:</span> {orderDetails._id}</p>
                <p className="text-sm"><span className="text-gray-500">Amount:</span> ₹{orderDetails.totalPrice}</p>
              </div>
            )}
            <Link to="/profile" className="inline-block bg-primary text-white px-8 py-3 rounded-sm font-medium">View Orders</Link>
          </>
        ) : (
          <>
            <XCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-500 mb-6">Something went wrong with your transaction. Please try again.</p>
            <Link to="/checkout" className="inline-block bg-[#fb641b] text-white px-8 py-3 rounded-sm font-medium">Retry Payment</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
