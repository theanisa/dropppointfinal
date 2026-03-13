import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/profile', icon: '👤', label: 'Profile' },
  ];

  if (!user) return null;

  return (
    <aside className="fb-sidebar p-4 space-y-1">
      <div className="mb-8">
        <div className="fb-avatar-large mx-auto mb-3">
          {user.profileImage ? (
            <img src={`http://localhost:5000${user.profileImage}`} alt="Profile" className="fb-avatar-large" />
          ) : (
            <div className="fb-avatar-large bg-gradient-to-br from-orange-primary to-black flex items-center justify-center text-2xl font-bold text-white">
              {user.fullName?.slice(0,1)?.toUpperCase() || 'U'}
            </div>
          )}
        </div>
        <h3 className="font-bold text-lg text-center truncate">{user.fullName}</h3>
        <p className="text-xs text-gray-500 text-center">{user.studentId}</p>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`fb-btn-secondary w-full justify-start hover:bg-gray-50 rounded-fb p-3 transition-colors ${
              location.pathname === item.path ? 'bg-orange-50 border-orange-primary' : ''
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
        {user.role === 'admin' && (
          <Link
            to="/admin"
            className={`fb-btn-secondary w-full justify-start hover:bg-gray-50 rounded-fb p-3 transition-colors ${
              location.pathname === '/admin' ? 'bg-orange-50 border-orange-primary' : ''
            }`}
          >
            <span>⚙️</span>
            <span>Admin</span>
          </Link>
        )}
      </nav>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <button className="fb-btn-danger w-full justify-start">
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

