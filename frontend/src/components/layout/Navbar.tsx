import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to={user ? (user.role === 'ADMIN' ? '/admin/dashboard' : (user.role === 'FARMER' ? '/farmer/dashboard' : '/marketplace')) : '/'} className="flex items-center gap-2">
          <img src="/logo.jpeg" alt="Farmer2MarketLK Logo" className="h-8 w-auto rounded-md" />
          <span className="font-heading font-bold text-xl text-primary-700 hidden sm:block">Farmer2MarketLK</span>
        </Link>
        
        <div className="flex items-center gap-6">
          {user ? (
            <>
              {user.role === 'ADMIN' ? (
                <Link to="/admin/dashboard" className="text-sm font-medium text-purple-600 hover:text-purple-800">Admin Dashboard</Link>
              ) : user.role === 'FARMER' ? (
                <>
                  <Link to="/farmer/dashboard" className="text-sm font-medium text-slate-600 hover:text-primary-600">Dashboard</Link>
                  <Link to="/farmer/produce/new" className="text-sm font-medium text-slate-600 hover:text-primary-600">Add Produce</Link>
                </>
              ) : (
                <>
                  <Link to="/marketplace" className="text-sm font-medium text-slate-600 hover:text-primary-600">Marketplace</Link>
                  <Link to="/buyer/ai" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                    ✨ AI Assist
                  </Link>
                </>
              )}
              
              <div className="h-6 w-px bg-slate-200 mx-2"></div>
              
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <span className="hidden md:block">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="text-slate-500 hover:text-red-500 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
