import PostCard from '../components/PostCard';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchPosts, createPost, toggleClaim, deletePost, addComment, deleteComment } from '../api/posts';
import { connectSocket } from '../utils/socket';

export default function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ search: '', type: '' });

  const [form, setForm] = useState({
    postType: '',
    title: '',
    description: '',
    location: '',
    itemDate: new Date().toISOString().split('T')[0],
    image: null,
  });

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { posts } = await fetchPosts(filters);
      setPosts(posts);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [filters]);

  useEffect(() => {
    const socket = connectSocket();

    const refresh = () => loadPosts();
    socket.on('post:created', refresh);
    socket.on('post:updated', refresh);
    socket.on('post:deleted', refresh);
    socket.on('comment:created', refresh);
    socket.on('comment:deleted', refresh);

    return () => {
      socket.off('post:created', refresh);
      socket.off('post:updated', refresh);
      socket.off('post:deleted', refresh);
      socket.off('comment:created', refresh);
      socket.off('comment:deleted', refresh);
      socket.disconnect();
    };
  }, []);

  const submitPost = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('postType', form.postType);
    data.append('title', form.title);
    data.append('description', form.description);
    data.append('location', form.location);
    data.append('item_date', form.itemDate);
    if (form.image) data.append('image', form.image);

    try {
      await createPost(data);
      setShowForm(false);
      setForm({ postType: '', title: '', description: '', location: '', itemDate: new Date().toISOString().split('T')[0], image: null });
      loadPosts();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create post');
    }
  };

  const handleClaim = async (postId) => {
    try {
      await toggleClaim(postId);
      loadPosts();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update');
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete post?')) return;
    try {
      await deletePost(postId);
      loadPosts();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete');
    }
  };

  const handleAddComment = async (postId, text) => {
    try {
      await addComment(postId, text);
      loadPosts();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to comment');
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm('Delete comment?')) return;
    try {
      await deleteComment(postId, commentId);
      loadPosts();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete comment');
    }
  };

  const canAdmin = useMemo(() => user?.role === 'admin', [user]);

  return (
    <div className="py-8 space-y-6">
      {/* Stories Bar */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mb-4 scrollbar-hide">
        <div className="flex flex-col items-center min-w-[70px] cursor-pointer group">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-primary to-orange-600 rounded-full border-3 border-white shadow-fb group-hover:shadow-fb-elevated p-1 transition-all">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-lg font-bold text-orange-primary">
              +
            </div>
          </div>
          <span className="text-xs text-center mt-1 text-gray-600 group-hover:text-gray-900">Create Story</span>
        </div>
        <div className="flex flex-col items-center min-w-[70px]">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-3 border-white shadow-fb">
            <div className="w-12 h-12 rounded-full bg-white m-1.5 flex items-center justify-center text-sm font-bold text-purple-600">
              J
            </div>
          </div>
          <span className="text-xs text-center mt-1 text-gray-600 truncate max-w-[70px]">John Doe</span>
        </div>
      </div>

      {/* Create Post Form */}
      <div className="fb-card">
        <div className="flex items-center gap-4 p-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600 flex-shrink-0">
            {user?.fullName?.slice(0,1) || 'U'}
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex-1 fb-btn-secondary justify-start h-12"
          >
            What's lost or found?
          </button>
        </div>
        {showForm && (
          <form onSubmit={submitPost} className="space-y-4 p-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={form.postType}
                onChange={(e) => setForm((f) => ({ ...f, postType: e.target.value }))}
                required
                className="w-full p-3 border border-gray-300 rounded-fb focus:ring-1 focus:ring-orange-primary focus:border-orange-primary"
              >
                <option value="">Select Type</option>
                <option value="lost">🔍 Lost</option>
                <option value="found">✅ Found</option>
              </select>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Title (optional)"
                className="w-full p-3 border border-gray-300 rounded-fb focus:ring-1 focus:ring-orange-primary focus:border-orange-primary"
              />
            </div>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Describe the item, location, date..."
              required
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-fb focus:ring-1 focus:ring-orange-primary focus:border-orange-primary resize-none"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="📍 Location (e.g. Library, Cafeteria)"
                className="w-full p-3 border border-gray-300 rounded-fb focus:ring-1 focus:ring-orange-primary focus:border-orange-primary"
              />
              <input
                type="date"
                value={form.itemDate}
                onChange={(e) => setForm((f) => ({ ...f, itemDate: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-fb focus:ring-1 focus:ring-orange-primary focus:border-orange-primary"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.files?.[0] }))}
                className="w-full p-3 border border-gray-300 rounded-fb file:mr-4 file:py-2 file:px-4 file:rounded-fb file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="fb-btn-primary flex-1">
                📤 Post Item
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-gray-300 rounded-fb font-semibold hover:bg-gray-50 transition flex-shrink-0"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <input
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          placeholder="🔍 Search posts..."
          className="flex-1 fb-search"
        />
        <select
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
          className="px-4 py-2 border border-gray-300 rounded-fb focus:ring-1 focus:ring-orange-primary focus:border-orange-primary"
        >
          <option value="">All</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
      </div>

      {error && (
        <div className="fb-card p-4 bg-red-50 border-l-4 border-red-400">
          <p className="text-red-800 font-semibold">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <div className="fb-card p-8 text-center animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
          <div className="fb-card p-6">
            <div className="h-64 bg-gray-200 rounded-fb mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-6">📭</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No posts found</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">Try adjusting your search or be the first to post!</p>
          <button onClick={() => setShowForm(true)} className="fb-btn-primary px-8 py-3 text-lg">
            + Create First Post
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUser={user}
              onClaim={handleClaim}
              onDelete={handleDelete}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}

