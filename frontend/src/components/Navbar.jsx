import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight font-[Geist] hover:scale-105 transition-transform">
          DropPoint
        </Link>
        
        {/* Search - desktop */}
        {user && (
          <div className="hidden lg:block flex-1 mx-12 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search lost & found..."
                className="w-full pl-12 pr-4 py-3 bg-slate-100/80 backdrop-blur-sm border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-[Inter] placeholder-slate-500"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            </div>
          </div>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <button className="p-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all backdrop-blur-sm">
                🔔
              </button>
              <button className="p-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all backdrop-blur-sm">
                💬
              </button>
              <button 
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="btn-secondary hidden md:block"
              >
                Logout
              </button>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:scale-110 transition-all shadow-sm hover:shadow-md ring-2 ring-slate-200 hover:ring-indigo-200">
                {user.fullName?.slice(0,1)?.toUpperCase() || 'U'}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary hidden md:block">
                Login
              </Link>
              <Link to="/register" className="btn-primary hidden md:block">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
