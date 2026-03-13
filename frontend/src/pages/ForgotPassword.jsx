import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
      } else {
        setError(data.message || 'Failed to process request');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Forgot Your Password?</h2>
        
        {message && (
          <div className="text-green-600 mb-4 p-2 bg-green-50 rounded">
            {message}
          </div>
        )}
        
        {error && (
          <div className="text-red-600 mb-4 p-2 bg-red-50 rounded">
            {error}
          </div>
        )}

        <p className="text-gray-600 mb-6">
          If you have forgotten your password, please contact the administrator to reset it for you.
        </p>
        
        <div className="bg-gray-200 p-4 rounded mb-4">
          <p className="font-semibold text-gray-800">Admin Contact</p>
          <p className="text-gray-700">📱 Phone: 01319632951</p>
        </div>

        <div className="mt-4">
          <Link to="/login" className="text-orange-500 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

