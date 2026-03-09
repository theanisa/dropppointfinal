import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login({ studentId, password });
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Sign in</h1>
        {error && <div className="text-red-600 mb-3">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold">Student ID</span>
            <input
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </label>
          <button className="w-full bg-orange-500 text-black font-semibold py-2 rounded hover:bg-black hover:text-white">
            Sign in
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          New here? <Link to="/register" className="text-orange-600">Create an account</Link>
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Forgot your password? <Link to="/forgot-password" className="text-orange-600">Reset it</Link>
        </p>
      </div>
    </div>
  );
}
