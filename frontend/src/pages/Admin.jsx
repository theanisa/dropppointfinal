import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchAllPosts, deletePost } from '../api/posts';

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.role || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const load = async () => {
      try {
        const { posts } = await fetchAllPosts();
        setPosts(posts);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate, user]);

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete post?')) return;
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold">DropPoint Admin</div>
            <div className="text-sm text-gray-600">{user?.fullName}</div>
          </div>
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

      <main className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-4">All Posts</h2>
        {error && <div className="text-red-600 mb-3">{error}</div>}
        {loading ? (
          <div className="text-gray-600">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-gray-600">No posts found.</div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post._id} className="bg-white p-4 rounded shadow">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="text-sm text-gray-500">{post.user?.fullName}</div>
                    <div className="font-semibold">{post.title || 'No title'}</div>
                    <div className="text-sm text-gray-600">{post.postType}</div>
                    <div className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</div>
                  </div>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
