import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password, mobile);
      }
      navigate(-1); // Go back to previous page
    } catch (error) {
      alert(error.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md flex rounded-sm overflow-hidden h-[500px]">
        {/* Left Side */}
        <div className="w-2/5 bg-primary p-10 text-white flex flex-col justify-between hidden md:flex">
          <div>
            <h2 className="text-3xl font-medium mb-4">{isLogin ? 'Login' : 'Looks like you\'re new here!'}</h2>
            <p className="text-gray-200 text-lg leading-relaxed">
              {isLogin ? 'Get access to your Orders, Wishlist and Recommendations' : 'Sign up with your mobile number to get started'}
            </p>
          </div>
          <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" alt="Login" className="w-full object-contain" />
        </div>

        {/* Right Side */}
        <div className="flex-1 p-10 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            {!isLogin && (
              <input 
                type="text" 
                placeholder="Enter Name" 
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-primary placeholder-gray-500"
                value={name} onChange={(e) => setName(e.target.value)} required 
              />
            )}
            <input 
              type="email" 
              placeholder="Enter Email" 
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-primary placeholder-gray-500"
              value={email} onChange={(e) => setEmail(e.target.value)} required 
            />
            {!isLogin && (
              <input 
                type="text" 
                placeholder="Enter Mobile Number" 
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-primary placeholder-gray-500"
                value={mobile} onChange={(e) => setMobile(e.target.value)} 
              />
            )}
            <input 
              type="password" 
              placeholder="Enter Password" 
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-primary placeholder-gray-500"
              value={password} onChange={(e) => setPassword(e.target.value)} required 
            />
            
            <p className="text-xs text-gray-500 mt-2">
              By continuing, you agree to Flipkart's <span className="text-primary cursor-pointer">Terms of Use</span> and <span className="text-primary cursor-pointer">Privacy Policy</span>.
            </p>
            
            <button type="submit" className="w-full bg-[#fb641b] text-white py-3 font-medium shadow-sm hover:bg-[#f15e19] transition-colors rounded-sm">
              {isLogin ? 'Login' : 'Continue'}
            </button>
            
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="w-full bg-white text-primary py-3 font-medium shadow-sm hover:shadow-md transition-shadow rounded-sm border border-gray-200 mt-4">
              {isLogin ? 'New to Flipkart? Create an account' : 'Existing User? Log in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
