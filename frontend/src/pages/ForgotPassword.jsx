import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

export default function ForgotPassword() {
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const payload = {};
      if (studentId) payload.studentId = studentId;
      if (email) payload.email = email;

      await api.post('/auth/forgot-password', payload);
      setMessage('If an account exists, a reset link has been sent.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send reset link');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Reset password</h1>
        <p className="text-sm text-gray-600 mb-4">
          Enter your student ID or email to receive a password reset link.
        </p>
        {message && <div className="text-green-600 mb-3">{message}</div>}
        {error && <div className="text-red-600 mb-3">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold">Student ID</span>
            <input
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </label>
          <button className="w-full bg-orange-500 text-black font-semibold py-2 rounded hover:bg-black hover:text-white">
            Send reset link
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Remembered your password? <Link to="/login" className="text-orange-600">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
