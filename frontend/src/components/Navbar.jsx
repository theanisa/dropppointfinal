import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fb-navbar">
      <div className="container py-3 flex items-center">
        {/* Left: Logo */}
        <Link to="/" className="text-xl font-bold text-gray-900 hover:text-orange-primary transition-colors">
          DropPoint
        </Link>
        
        {/* Center: Search - for logged in */}
        {user && (
          <div className="mx-auto hidden md:block">
            <input
              type="text"
              placeholder="Search DropPoint..."
              className="fb-search"
            />
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {user ? (
            <>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                🔔
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                💬
              </button>
              <button 
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="fb-btn-secondary"
              >
                Logout
              </button>
              <div className="w-8 h-8 rounded-full bg-orange-primary flex items-center justify-center text-white font-bold cursor-pointer hover:ring-2 hover:ring-orange-400 transition-all">
                {user.fullName?.slice(0,1)?.toUpperCase()}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="fb-btn-secondary mr-2">
                Login
              </Link>
              <Link to="/register" className="fb-btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
