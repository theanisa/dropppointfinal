import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ studentId, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <span className="text-2xl font-bold text-white">DP</span>
            </div>
            <h1 className="text-3xl font-extrabold gradient-text mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your DropPoint account</p>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 p-4 rounded-xl mb-6 text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Student ID */}
            <div>
              <label className="block text-sm font-bold mb-2 gradient-text">Student ID</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                  placeholder="231-115-024"
                  required
                  disabled={loading}
                  className="w-full px-12 py-4 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-lg"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🆔</span>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold mb-2 gradient-text">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  autoComplete="off"
                  className="w-full px-12 py-4 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-lg"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-3 text-sm">
                <input type="checkbox" className="w-5 h-5 accent-orange-500 rounded border-gray-300" />
                <span className="text-gray-700 font-medium">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition">Forgot Password?</Link>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary text-lg font-bold py-4 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group hover:scale-[1.02]"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">🔄</span>
                  Signing In...
                </>
              ) : (
                '🚀 Sign In'
              )}
            </button>
          </form>

          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              Don't have an account?
            </p>
            <Link 
              to="/register" 
              className="inline-block w-full btn-secondary text-lg font-bold py-4 shadow-xl hover:shadow-2xl"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
