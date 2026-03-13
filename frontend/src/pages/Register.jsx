import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    studentId: '',
    fullName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [idError, setIdError] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateID = () => {
    if (!form.studentId.includes('-115-')) {
      setIdError(true);
      return false;
    }
    setIdError(false);
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateID()) return;
    
    setError(null);
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
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
            <h1 className="text-3xl font-extrabold gradient-text mb-2">Join DropPoint</h1>
            <p className="text-gray-600">Create your account in seconds</p>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 p-4 rounded-xl mb-6 text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Student ID */}
            <div>
              <label className="block text-sm font-bold mb-2 gradient-text">Student ID *</label>
              <div className="relative">
                <input 
                  type="text"
                  value={form.studentId}
                  onChange={(e) => setForm({ ...form, studentId: e.target.value.toUpperCase() })}
                  placeholder="231-115-024"
                  required
                  disabled={loading}
                  className={`w-full px-12 py-4 bg-white/50 backdrop-blur-sm border-2 rounded-2xl shadow-lg transition-all focus:ring-4 focus:ring-orange-500/20 ${
                    idError ? 'border-red-400 focus:border-red-400 bg-red-50/50' : 'border-gray-200 focus:border-orange-500'
                  }`}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🆔</span>
              </div>
              {idError && (
                <p className="text-red-500 text-xs mt-2 font-semibold">Must be CSE format (contains -115-)</p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold mb-2 gradient-text">Full Name *</label>
              <div className="relative">
                <input 
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="John Doe"
                  required
                  disabled={loading}
                  className="w-full px-12 py-4 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 shadow-lg transition-all"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold mb-2 gradient-text">Email *</label>
              <div className="relative">
                <input 
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="student@metrouni.edu.bd"
                  required
                  disabled={loading}
                  className="w-full px-12 py-4 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 shadow-lg transition-all"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📧</span>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold mb-2 gradient-text">Password *</label>
              <div className="relative">
                <input 
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Create a strong password"
                  required
                  disabled={loading}
                  className="w-full px-12 py-4 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 shadow-lg transition-all"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || idError}
              className="w-full btn-primary text-lg font-bold py-4 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group hover:scale-[1.02]"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">🚀</span>
                  Creating Account...
                </>
              ) : (
                '🚀 Create Account'
              )}
            </button>
          </form>

          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              Already have an account?
            </p>
            <Link 
              to="/login" 
              className="inline-block w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all"
            >
              Sign In Instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
