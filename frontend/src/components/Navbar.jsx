import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold italic bg-gradient-to-r from-orange-500 to-gray-900 bg-clip-text text-transparent px-4 py-2 rounded-full shadow-lg font-sans hover:shadow-xl transition-all">
          DropPoint
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard" className="font-semibold text-gray-800 hover:text-orange-500 px-3 py-2 rounded transition">Dashboard</Link>
              <Link to="/profile" className="font-semibold text-gray-800 hover:text-orange-500 px-3 py-2 rounded transition">Profile</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="font-semibold text-gray-800 hover:text-orange-500 px-3 py-2 rounded transition">Admin</Link>
              )}
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="bg-gradient-to-r from-orange-500 to-black text-white px-6 py-2 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="font-semibold text-gray-800 hover:text-orange-500 px-3 py-2 rounded transition">Login</Link>
              <Link to="/register" className="bg-orange-500 text-black px-6 py-2 rounded-full font-bold shadow-lg hover:bg-black hover:text-white transition-all">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
