import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
import { CreditCard, Info, Lock, Truck, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import LiveSaleTimer from '../components/layout/LiveSaleTimer';
import config from '../../config.json';

const InputField = ({ name, label, type="text", required = false, pattern, maxLength, className="w-full", register, errors, clearErrors }) => (
  <div className={`relative ${className}`}>
    <input 
      type={type}
      id={name}
      placeholder=" "
      className={`peer w-full border ${errors[name] ? 'border-red-500' : 'border-[#e0e0e0]'} px-3 py-3 rounded-sm text-[14px] focus:outline-none focus:border-[#2874f0] bg-transparent`}
      {...register(name, { 
        required: required ? `${label} is required` : false,
        ...(pattern && { pattern }),
        ...(maxLength && { maxLength }),
        onChange: () => clearErrors(name)
      })}
    />
    <label 
      htmlFor={name}
      className={`absolute left-3 top-3 text-[#878787] text-[14px] transition-all duration-200 bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:text-[14px] peer-focus:-top-2 peer-focus:text-[12px] peer-focus:text-[#2874f0] ${!errors[name] && 'peer-valid:-top-2 peer-valid:text-[12px]'}`}
    >
      {label}
    </label>
    {errors[name] && <p className="text-red-500 text-[11px] mt-1">{errors[name].message}</p>}
  </div>
);

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/');
    }
  }, [cartItems, navigate]);

  const [step, setStep] = useState(1);
  const [showQRPage, setShowQRPage] = useState(false);
  const [utr, setUtr] = useState('');
  
  const [selectedPayment, setSelectedPayment] = useState('upi'); 
  const [isProcessing, setIsProcessing] = useState(false);
  
  const UPI_ID = config.UPI_ID || 'merchant@upi';
  const PAYEE_NAME = encodeURIComponent(config.ACCOUNT_HOLDER_NAME || 'Store');
  
  const { register, handleSubmit, formState: { errors }, clearErrors } = useForm({
    defaultValues: selectedAddress || {}
  });



  const getProductPrice = (productId, defaultPrice) => {
    return config.PRODUCTS?.[productId]?.sellingPrice || defaultPrice;
  };

  const getProductOldPrice = (productId, defaultOldPrice) => {
    return config.PRODUCTS?.[productId]?.originalMrp || defaultOldPrice;
  };

  const itemsPrice = cartItems.reduce((acc, item) => acc + (getProductOldPrice(item.product._id, item.product.oldPrice || item.product.price) * item.quantity), 0);
  const currentPrice = cartItems.reduce((acc, item) => acc + (getProductPrice(item.product._id, item.product.price) * item.quantity), 0);
  const discount = itemsPrice - currentPrice;
  const deliveryCharge = 0;
  
  let extraDiscount = 0;

  const totalAmount = currentPrice + deliveryCharge;
  const finalPayable = totalAmount - extraDiscount;
  const totalSavings = discount + extraDiscount + (deliveryCharge === 0 ? 40 : 0);

  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const onSubmitAddress = async (data) => {
    try {
      if (user) {
        const response = await api.post('/users/address', data);
        const updatedAddresses = response.data;
        setSelectedAddress(updatedAddresses[updatedAddresses.length - 1]);
      } else {
        setSelectedAddress(data);
      }
      setStep(2);
    } catch (error) {
      console.error('Error saving address', error);
    }
  };

  const handleCreateOrder = async () => {
    try {
      const payload = user 
        ? { addressId: selectedAddress._id }
        : { guestAddress: selectedAddress, guestCartItems: cartItems, guestEmail: selectedAddress.email };
      
      const { data } = await api.post('/payment/create', payload);
      setTransactionId(`TR_${Date.now()}`);
      setStep(3);
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to initialize order');
    }
  };



  const handleSubmitUTR = () => {
    if (utr.trim().length < 10) {
      alert("Must put minimum 10 digit UTR number");
      return;
    }
    if (!user) {
      localStorage.removeItem('cartItems');
      window.dispatchEvent(new Event('storage'));
    }
    const orderData = {
      address: selectedAddress ? `${selectedAddress.fullName}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}` : ', , , ',
      deliveryDate: getDeliveryDate()
    };
    sessionStorage.setItem('lastOrderData', JSON.stringify(orderData));
    navigate(`/payment/status?success=true&utr=${utr}`);
  };
  
  const handlePayNow = () => {
    if (selectedPayment === 'qr') {
      setShowQRPage(true);
    } else if (selectedPayment === 'upi') {
      const am = Number(finalPayable).toFixed(2);
      window.location.href = `upi://pay?pa=${UPI_ID}&pn=${PAYEE_NAME}&tr=${transactionId}&tn=Payment&am=${am}&cu=INR&mode=04`;
    } else {
      alert('Please select a payment method');
    }
  };

  const getStepTitle = () => {
    if (step === 1) return 'Add delivery address';
    if (step === 2) return 'Order Summary';
    return 'Payments';
  };

  if (showQRPage) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <div className="bg-[#2874f0] text-white px-4 py-3 flex items-center gap-3">
          <ArrowLeft className="h-6 w-6 cursor-pointer" onClick={() => setShowQRPage(false)} />
          <h1 className="text-[18px] font-medium">Scan to Pay</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6 text-black">Scan QR Code to Pay</h2>
          <div className="mb-8 p-1">
            <QRCodeSVG value={`upi://pay?pa=${UPI_ID}&pn=Store&tr=${transactionId}&tn=Payment&am=${Number(finalPayable).toFixed(2)}&cu=INR`} size={220} />
          </div>
          <div className="text-xl font-bold text-black mb-6">
            Order Amount ₹{finalPayable}
          </div>
          <h3 className="text-xl font-bold text-black mb-3">
            Enter UTR Number
          </h3>
          <input 
            type="text" 
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
            placeholder="Enter Your UTR No." 
            className="w-full border border-gray-300 rounded-sm px-3 py-2.5 mb-5 focus:outline-none focus:border-gray-400 text-gray-700 placeholder-gray-400"
          />
          <button 
            onClick={handleSubmitUTR}
            className="bg-[#f25c27] hover:bg-[#d85020] text-white px-8 py-2.5 rounded-sm font-medium mb-8"
          >
            Submit UTR
          </button>
          <h3 className="text-[19px] font-bold text-black mb-3 w-full text-center">
            Instructions for Payment
          </h3>
          <div className="w-full border border-gray-300">
            <div className="flex border-b border-gray-300">
              <div className="w-16 p-2.5 border-r border-gray-300 text-sm text-gray-800">Step 1:</div>
              <div className="flex-1 p-2.5 text-sm text-gray-800">Scan the QR code using your mobile banking app.</div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-16 p-2.5 border-r border-gray-300 text-sm text-gray-800">Step 2:</div>
              <div className="flex-1 p-2.5 text-sm text-gray-800">Enter the payment amount shown above.</div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-16 p-2.5 border-r border-gray-300 text-sm text-gray-800">Step 3:</div>
              <div className="flex-1 p-2.5 text-sm text-gray-800">Complete the payment and note your UTR number.</div>
            </div>
            <div className="flex">
              <div className="w-16 p-2.5 border-r border-gray-300 text-sm text-gray-800">Step 4:</div>
              <div className="flex-1 p-2.5 text-sm text-gray-800">Enter your UTR number above and click Submit.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#483635] min-h-screen md:flex md:justify-center">
      {isProcessing && (
        <div className="fixed inset-0 bg-black/75 z-[99999] flex flex-col items-center justify-center text-white p-4">
          <Loader2 className="h-12 w-12 animate-spin mb-4 text-[#ffc200]" />
          <h2 className="text-xl font-bold mb-2">Processing Payment...</h2>
          <p className="text-sm text-gray-300 text-center max-w-xs">
            Please wait while we process your payment. Do not close this window or press the back button.
          </p>
        </div>
      )}
      <div className="bg-white w-full max-w-md min-h-screen shadow-lg relative flex flex-col pb-0">
        
        <div className="flex items-center gap-4 p-4 pt-5 pb-2">
          <ArrowLeft className="h-6 w-6 cursor-pointer text-[#212121]" onClick={() => { if(step > 1) setStep(step - 1); else navigate(-1); }} />
          <h1 className="text-[18px] text-[#212121]">{getStepTitle()}</h1>
        </div>

        <div className="px-8 py-5 border-b border-gray-100 bg-white flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-1/2 left-12 right-12 h-[1px] bg-gray-200 -z-0 -translate-y-2.5" />
          {[1, 2, 3].map((s, i) => (
             <div key={i} className="flex flex-col items-center z-10 bg-white px-2">
               <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[13px] font-bold border-[1.5px] ${step >= s ? 'bg-[#2874f0] border-[#2874f0] text-white' : 'bg-white border-[#2874f0] text-[#2874f0]'}`}>
                 {s}
               </div>
               <span className={`text-[11px] mt-1.5 ${step === s ? 'text-black font-bold' : 'text-gray-400'}`}>
                 {s === 1 ? 'Address' : s === 2 ? 'Order Summary' : 'Payment'}
               </span>
             </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          
          {step === 1 && (
            <div className="p-4 pt-6">
              <form id="address-form" onSubmit={handleSubmit(onSubmitAddress)} className="space-y-4">
                <InputField name="fullName" label="Full Name" register={register} errors={errors} clearErrors={clearErrors} />
                <InputField name="mobile" label="Mobile number" type="tel" pattern={{value: /^[0-9]{10}$/, message: "Invalid mobile"}} maxLength={10} register={register} errors={errors} clearErrors={clearErrors} />
                <InputField name="pincode" label="Pincode" type="text" pattern={{value: /^[0-9]{6}$/, message: "Invalid pincode"}} maxLength={6} register={register} errors={errors} clearErrors={clearErrors} />
                
                <div className="flex gap-4">
                  <InputField name="city" label="City" className="flex-1" register={register} errors={errors} clearErrors={clearErrors} />
                  <div className="relative flex-1">
                    <select
                      className="peer w-full border border-[#2874f0] px-3 py-3 rounded-sm text-[14px] focus:outline-none focus:border-[#2874f0] appearance-none bg-transparent"
                      {...register("state", { required: true })}
                    >
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                      <option value="Assam">Assam</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Goa">Goa</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Himachal Pradesh">Himachal Pradesh</option>
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Manipur">Manipur</option>
                      <option value="Meghalaya">Meghalaya</option>
                      <option value="Mizoram">Mizoram</option>
                      <option value="Nagaland">Nagaland</option>
                      <option value="Odisha">Odisha</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Sikkim">Sikkim</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Tripura">Tripura</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                      <option value="Chandigarh">Chandigarh</option>
                      <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                      <option value="Ladakh">Ladakh</option>
                      <option value="Lakshadweep">Lakshadweep</option>
                      <option value="Puducherry">Puducherry</option>
                    </select>
                    <label className="absolute left-3 -top-2 text-[12px] text-gray-500 bg-white px-1">State</label>
                    <div className="absolute right-3 top-4 pointer-events-none">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                </div>

                <InputField name="houseNumber" label="House No., Building Name" register={register} errors={errors} clearErrors={clearErrors} />
                <InputField name="area" label="Road name, Area, Colony" register={register} errors={errors} clearErrors={clearErrors} />
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="bg-gray-100">
              <LiveSaleTimer />
              <div className="bg-white p-4 mb-2">
                <h3 className="text-gray-800 text-lg mb-2">Delivered to:</h3>
                <p className="text-sm text-gray-700">{selectedAddress?.fullName}, {selectedAddress?.area}, {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.pincode}</p>
              </div>

              <div className="bg-white px-4 py-3 mb-2 flex items-center gap-2 border-y border-gray-200">
                <Truck className="h-5 w-5 text-green-700" />
                <span className="text-green-700 font-bold text-sm">Delivery by {getDeliveryDate()}</span>
              </div>

              <div className="bg-white mb-2">
                {cartItems.map((item) => {
                  const livePrice = getProductPrice(item.product._id, item.product.price);
                  const liveOldPrice = getProductOldPrice(item.product._id, item.product.oldPrice || item.product.price);
                  return (
                  <div key={item.product._id} className="p-4 flex gap-4 border-b border-gray-100 relative">
                    <div className="w-24 h-24 shrink-0 flex items-center justify-center">
                      <img src={item.product.images?.[0]} alt="" className="max-h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-900 font-bold uppercase">{item.product.brand || 'BRAND'}</h4>
                      <p className="text-gray-600 text-sm line-clamp-1">{item.product.title}</p>
                      <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="assured" className="h-4 my-1.5" />
                                           <div className="flex items-center gap-2 mt-1 mb-3">
                        <span className="text-xl font-bold">₹{livePrice}</span>
                        <span className="text-gray-400 line-through text-sm">₹{liveOldPrice}</span>
                        <span className="text-green-600 font-bold text-sm">{Math.round((liveOldPrice - livePrice)/liveOldPrice * 100)}% off</span>
                      </div>

                      <div className="mt-1 flex items-center gap-6">
                        <div className="text-sm text-gray-800 border px-3 py-1 bg-gray-50 font-medium">Qty: {item.quantity}</div>
                        <button 
                          onClick={() => removeFromCart(item.product._id)} 
                          className="text-[14px] font-semibold text-black hover:text-[#2874f0] tracking-wide cursor-pointer uppercase"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>

              <div className="bg-white p-4 mb-2">
                <h3 className="text-gray-800 text-lg mb-4">Price Details</h3>
                <div className="space-y-3 text-sm border-b border-gray-200 pb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Price ({cartItems.length} item)</span>
                    <span className="text-gray-900">₹{itemsPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Discount</span>
                    <span className="text-green-600">- ₹{discount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Delivery Charges</span>
                    <span className="text-green-600">{deliveryCharge === 0 ? 'FREE Delivery' : `₹${deliveryCharge}`}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-lg pt-4 mb-4">
                  <span>Total Amount</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="text-green-600 font-medium border-t border-gray-100 pt-4">
                  You will save ₹{totalSavings} on this order
                </div>
              </div>

              <div className="bg-gray-100 p-6 flex items-center justify-center gap-3 text-gray-500 font-bold text-[11px] text-center">
                <ShieldCheck className="h-8 w-8 text-gray-400 shrink-0" />
                <p className="text-left">Safe and secure payments. Easy<br/>returns. 100% Authentic products.</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-gray-100">
              <LiveSaleTimer />

              <div className="bg-white p-4 mb-2 space-y-3">
                
                <div onClick={() => setSelectedPayment('upi')} className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedPayment === 'upi' ? 'border-blue-500 bg-blue-50/10' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="shrink-0 flex items-center gap-1.5">
                        <img src="/payment/phonepe.svg" alt="PhonePe" className="h-6 w-6 object-contain" />
                        <img src="/payment/gpay.svg" alt="GPay" className="h-6 w-6 object-contain" />
                        <img src="/payment/paytm.svg" alt="Paytm" className="h-6 w-8 object-contain" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-gray-900 text-[15px] block">Pay via UPI</span>
                        <span className="text-gray-500 text-[11px]">PhonePe, GPay, Paytm & more</span>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-sm shrink-0 ml-2">EXTRA 20% OFF</div>
                  </div>
                </div>

                <div onClick={() => setSelectedPayment('qr')} className={`border rounded-lg p-4 flex flex-col cursor-pointer transition-colors ${selectedPayment === 'qr' ? 'border-blue-500 bg-blue-50/10' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-9 w-9 text-gray-700" strokeWidth={1.5} />
                      <div>
                        <span className="font-bold text-gray-900 text-lg block">Scan to Pay</span>
                        <span className="text-gray-500 text-xs">Scan QR code with any UPI app</span>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-sm">EXTRA 20% OFF</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 flex items-center justify-between border-gray-200 opacity-50 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Truck className="h-9 w-9 text-gray-500" strokeWidth={1.5} />
                    <span className="font-bold text-gray-500 text-lg">Cash on Delivery</span>
                  </div>
                  <div className="text-gray-500 text-sm flex items-center gap-1">Unavailable <Info className="h-4 w-4"/></div>
                </div>

              </div>

              <div className="bg-white p-4 mb-2">
                <h3 className="text-gray-800 text-lg mb-4">Price Details</h3>
                <div className="space-y-3 text-sm border-b border-gray-200 pb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Price (1 item)</span>
                    <span className="text-gray-900">₹{totalAmount}</span>
                  </div>
                  {extraDiscount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">Extra Discount</span>
                      <span className="text-green-600">- ₹{extraDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-700">Delivery Charges</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-lg pt-4">
                  <span>Amount Payable</span>
                  <span>₹{finalPayable}</span>
                </div>
              </div>

              <div className="bg-[#f1f3f6] h-3 w-full"></div>
              
              <div className="bg-white px-4 py-6 flex flex-col items-center border-t border-gray-100">
                <div className="flex justify-between text-[#878787] text-[10px] text-center w-full mb-6 px-1 font-medium">
                  <div className="flex flex-col items-center gap-2">
                    <img src="/payment/original-badge.jpg" alt="Original" className="h-[30px] w-[30px] object-contain mix-blend-multiply" />
                    <span>Authentic Products</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Lock className="h-[30px] w-[30px]" strokeWidth={1.2}/>
                    <span>Secure Payments</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Truck className="h-[30px] w-[30px]" strokeWidth={1.2}/>
                    <span>Easy Returns</span>
                  </div>
                </div>
                
                <div className="flex gap-4 items-center justify-center mt-2 w-full px-4">
                   <img src="/payment/visa-logo.png" alt="VISA" className="h-6 object-contain" />
                   <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-[18px] object-contain" />
                   <img src="https://upload.wikimedia.org/wikipedia/commons/d/d1/RuPay.svg" alt="RuPay" className="h-[18px] object-contain" />
                   <img src="/payment/razorpay-logo.png" alt="Razorpay" className="h-[14px] object-contain" />
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="sticky mt-auto bottom-0 left-0 w-full bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50">
          
          {step === 1 && (
            <div className="p-4 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] border-t border-gray-100">
              <button form="address-form" type="submit" className="w-full bg-[#ff6116] text-white font-medium text-[16px] py-3.5 rounded-sm flex items-center justify-center">
                Proceed
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col">
              <div className="flex">
                <div className="w-1/2 p-3 px-4 bg-white border-t border-gray-200 flex flex-col justify-center">
                  <div className="flex items-baseline gap-2 mb-1 text-gray-900">
                    <span className="text-gray-400 line-through text-sm">₹{itemsPrice}</span>
                    <span className="text-2xl font-bold">₹{totalAmount}</span>
                  </div>
                  <div className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-sm w-max">
                    You Save ₹{totalSavings}
                  </div>
                </div>
                <div className="w-1/2 p-3 bg-white border-t border-gray-200 flex items-center justify-center">
                  <button onClick={handleCreateOrder} className="w-full h-full bg-[#ff6116] text-white font-medium text-[16px] rounded-sm flex items-center justify-center hover:bg-[#e05312] transition-colors py-3">
                    Place Order <span className="ml-1 -mt-0.5 text-2xl font-light">›</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center gap-8 py-3 text-[11px] font-medium text-gray-600 bg-gray-50 border-t border-gray-200">
                <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-gray-500" /> Secure Checkout</span>
                <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-gray-500" /> Fast Delivery</span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col">
              <div className="flex">
                <div className="w-1/2 p-3 px-4 bg-white border-t border-gray-200 flex flex-col justify-center relative">
                  <div className="absolute top-[-10px] left-4 bg-[#ff3f6c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm z-10 shadow-sm">
                    {Math.round((itemsPrice - finalPayable)/itemsPrice * 100)}% OFF
                  </div>
                  <div className="flex items-baseline gap-2 mb-1 mt-1 text-gray-900">
                    <span className="text-gray-400 line-through text-sm">₹{itemsPrice}</span>
                    <span className="text-2xl font-bold">₹{finalPayable}</span>
                  </div>
                  <div className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-sm w-max">
                    You Save ₹{totalSavings}
                  </div>
                </div>
                <div className="w-1/2 p-3 bg-white border-t border-gray-200 flex items-center justify-center">
                  <button onClick={handlePayNow} className="w-full h-full bg-[#ff6116] text-white font-medium text-[16px] rounded-sm flex items-center justify-center hover:bg-[#e05312] transition-colors py-3">
                    {selectedPayment === 'qr' ? 'Continue' : 'Pay Now'}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center gap-8 py-3 text-[11px] font-medium text-gray-600 bg-gray-50 border-t border-gray-200">
                <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-gray-500" /> Secure Checkout</span>
                <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-gray-500" /> Fast Delivery</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Checkout;
