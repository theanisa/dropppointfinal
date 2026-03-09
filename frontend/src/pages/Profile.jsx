import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/auth';

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    contact: user?.contact || '',
    password: '',
    profileImage: null,
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const data = new FormData();
      data.append('fullName', form.fullName);
      data.append('email', form.email);
      data.append('contact', form.contact);
      if (form.password) data.append('password', form.password);
      if (form.profileImage) data.append('profile_image', form.profileImage);

      const { user: updated } = await updateProfile(data);
      setUser(updated);
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err?.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">Edit Profile</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {message && <div className="text-green-600 mb-4">{message}</div>}
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <div className="bg-white p-6 rounded shadow">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-semibold">Full name</span>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  required
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-semibold">Contact (optional)</span>
              <input
                value={form.contact}
                onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold">New password (optional)</span>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="mt-1 w-full border rounded px-3 py-2"
                placeholder="Leave blank to keep current password"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold">Profile image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm((f) => ({ ...f, profileImage: e.target.files?.[0] }))}
                className="mt-1 w-full"
              />
            </label>

            <button className="bg-orange-500 text-black px-4 py-2 rounded hover:bg-black hover:text-white">
              Save
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
