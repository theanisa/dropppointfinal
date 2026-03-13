import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/auth';
import { fetchMyPosts, toggleClaim, deletePost } from '../api/posts';

export default function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    contact: user?.contact || '',
    password: '',
    profileImage: null,
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const loadMyPosts = async () => {
    try {
      const { posts } = await fetchMyPosts();
      setMyPosts(posts);
    } catch (err) {
      console.error('Failed to load posts', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    loadMyPosts();
  }, []);

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
      setMessage('Profile updated!');
      setActiveTab('posts');
    } catch (err) {
      setError(err?.response?.data?.message || 'Update failed');
    }
  };

  const handleClaim = async (postId) => {
    try {
      await toggleClaim(postId);
      loadMyPosts();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete post?')) return;
    try {
      await deletePost(postId);
      loadMyPosts();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container">
        <div className="max-w-2xl mx-auto mb-8">
          {/* Profile Header - PHP style */}
          <div className="card flex flex-col items-center text-center">
            <div className="profile-avatar bg-gradient-to-br from-orange-500 to-gray-800 flex items-center justify-center text-4xl font-bold text-white">
              {user.profileImage ? (
                <img src={`http://localhost:5000${user.profileImage}`} alt="Profile" className="profile-avatar" />
              ) : (
                user.fullName.slice(0, 1).toUpperCase()
              )}
            </div>
            <h1 className="mt-6 text-3xl font-extrabold text-gray-900">{user.fullName}</h1>
            <p className="text-gray-500 font-medium text-lg mt-1">Student ID: {user.studentId}</p>
            
            <div className="mt-6 space-y-2 text-gray-700">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Contact:</strong> {user.contact || 'Not set'}</p>
              <p><strong>Role:</strong> <span className={`px-3 py-1 rounded-full text-sm font-bold ${user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{user.role.toUpperCase()}</span></p>
            </div>

            <div className="mt-8">
              <button 
                onClick={() => setActiveTab('edit')}
                className="btn-secondary mr-4"
              >
                Edit Profile
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-black transition"
              >
                View Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`pb-4 px-6 font-bold ${activeTab === 'posts' ? 'border-orange-500 border-b-4 text-orange-500' : 'text-gray-600 hover:text-gray-900'}`}
          >
            My Posts ({myPosts.length})
          </button>
          {activeTab === 'edit' && (
            <button 
              onClick={() => setActiveTab('posts')}
              className="pb-4 px-6 font-bold text-gray-600 hover:text-gray-900"
            >
              ← Back to Posts
            </button>
          )}
        </div>

        {message && <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg mb-6">{message}</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg mb-6">{error}</div>}

        {/* Edit Form */}
        {activeTab === 'edit' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6 gradient-text">Edit Profile</h2>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Full Name</label>
                  <input
                    value={form.fullName}
                    onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Contact (optional)</label>
                <input
                  value={form.contact}
                  onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">New Password (optional)</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Leave blank to keep current"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm((f) => ({ ...f, profileImage: e.target.files?.[0] }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-8 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" className="btn-primary flex-1">
                  Save Changes
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveTab('posts')}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* My Posts */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-2xl font-bold mb-4 gradient-text">My Posts</h2>
              {loadingPosts ? (
                <div className="text-gray-600 text-center py-12">Loading posts...</div>
              ) : myPosts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">📝</div>
                  You haven't posted yet. <a href="/dashboard" className="text-orange-500 hover:underline font-semibold">Create one now →</a>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myPosts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      currentUser={user}
                      onClaim={handleClaim}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
