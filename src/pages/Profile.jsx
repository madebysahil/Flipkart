import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-background min-h-screen py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-4">
        
        {/* Sidebar */}
        <div className="w-1/4 hidden md:flex flex-col gap-4">
          <div className="bg-white p-4 rounded-sm shadow-sm flex items-center gap-4">
            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg" alt="Profile" className="w-12 h-12" />
            <div>
              <p className="text-xs text-gray-500">Hello,</p>
              <p className="font-medium text-gray-800">{user.name}</p>
            </div>
          </div>
          <div className="bg-white shadow-sm rounded-sm overflow-hidden text-sm">
            <div className="p-4 border-b hover:bg-blue-50 cursor-pointer text-gray-500 hover:text-primary transition-colors font-medium">
              MY ORDERS
            </div>
            <div className="p-4 border-b hover:bg-blue-50 cursor-pointer text-gray-500 hover:text-primary transition-colors font-medium">
              ACCOUNT SETTINGS
            </div>
            <div className="p-4 hover:bg-blue-50 cursor-pointer text-gray-500 hover:text-primary transition-colors font-medium" onClick={handleLogout}>
              LOGOUT
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-sm shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6 pb-4 border-b">Personal Information</h2>
          <div className="max-w-md">
            <div className="mb-4">
              <label className="text-sm text-gray-500">Name</label>
              <div className="bg-gray-50 p-3 rounded mt-1 border border-gray-200">{user.name}</div>
            </div>
            <div className="mb-4">
              <label className="text-sm text-gray-500">Email Address</label>
              <div className="bg-gray-50 p-3 rounded mt-1 border border-gray-200">{user.email}</div>
            </div>
            <div className="mb-4">
              <label className="text-sm text-gray-500">Mobile Number</label>
              <div className="bg-gray-50 p-3 rounded mt-1 border border-gray-200">{user.mobile || 'Not added'}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
