import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/profile', icon: '👤', label: 'Profile' },
  ];

  if (!user) return null;

  return (
    <div className="w-full h-screen flex flex-col bg-white/90 backdrop-blur-md border-r border-slate-100 shadow-sm">
      {/* Profile Header */}
      <div className="p-8 border-b border-slate-100 flex flex-col items-center space-y-4">
        <div className="relative">
          {user.profileImage ? (
            <img 
              src={`http://localhost:5000${user.profileImage}`} 
              alt="Profile" 
              className="w-20 h-20 rounded-3xl object-cover ring-4 ring-slate-100 shadow-lg hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-slate-100 hover:scale-105 transition-transform">
              {user.fullName?.slice(0,1)?.toUpperCase() || 'U'}
            </div>
          )}
        </div>
        <div className="text-center">
          <h3 className="font-bold text-xl tracking-tight font-[Geist] truncate max-w-[200px]">{user.fullName}</h3>
          <p className="text-sm text-slate-500 font-[Inter]">{user.studentId}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all group font-[Inter] text-sm font-semibold ${
              location.pathname === item.path
                ? 'bg-indigo-50 text-indigo-700 border-2 border-indigo-200 shadow-sm'
                : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50 hover:shadow-sm'
            }`}
          >
            <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
        {user.role === 'admin' && (
          <Link
            to="/admin"
            className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all group font-[Inter] text-sm font-semibold ${
              location.pathname === '/admin'
                ? 'bg-indigo-50 text-indigo-700 border-2 border-indigo-200 shadow-sm'
                : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50 hover:shadow-sm'
            }`}
          >
            <span className="text-xl group-hover:scale-110 transition-transform">⚙️</span>
            <span>Admin</span>
          </Link>
        )}
      </nav>

      {/* Logout */}
      <div className="p-6 border-t border-slate-100">
        <button 
          onClick={logout}
          className="btn-danger w-full justify-start flex items-center gap-3 font-[Inter]"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

