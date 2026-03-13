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
    <>
      <div className="bento-grid gap-8 max-w-7xl mx-auto">
        {/* Quick Actions */}
        <div className="bento-xl glass-card">
          <div className="flex items-center gap-6 h-full">
            <div className="p-8 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl backdrop-blur-md">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white shadow-2xl">
                {user?.fullName?.slice(0,1)?.toUpperCase() || 'U'}
              </div>
            </div>
            <div className="flex-1">
              <button 
                onClick={() => setShowForm(!showForm)}
                className="btn-primary w-full h-16 text-lg font-[Inter] mb-4"
              >
                + What's Lost or Found Today?
              </button>
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-card p-4 text-center hover:shadow-md transition-all rounded-2xl">
                  <div className="text-3xl mb-2">🔍</div>
                  <div className="text-sm font-[Inter]">Lost Items</div>
                  <span className="text-2xl font-bold text-indigo-600">23</span>
                </div>
                <div className="glass-card p-4 text-center hover:shadow-md transition-all rounded-2xl">
                  <div className="text-3xl mb-2">✅</div>
                  <div className="text-sm font-[Inter]">Found Items</div>
                  <span className="text-2xl font-bold text-emerald-600">15</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bento-lg glass-card p-8">
          <h3 className="text-2xl font-black tracking-tight font-[Geist] mb-6 text-slate-900">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                ✅
              </div>
              <div>
                <p className="font-semibold text-slate-900 font-[Inter]">Laptop recovered</p>
                <p className="text-sm text-slate-500 font-[Inter]">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                👤
              </div>
              <div>
                <p className="font-semibold text-slate-900 font-[Inter]">New user joined</p>
                <p className="text-sm text-slate-500 font-[Inter]">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="glass-card p-6 col-span-full">
          <div className="flex flex-col lg:flex-row gap-4 items-center lg:items-stretch">
            <div className="flex-1 relative">
              <input
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                placeholder="🔍 Search posts, locations, items..."
                className="w-full pl-14 pr-6 py-4 bg-slate-100/60 backdrop-blur-sm border border-slate-200 rounded-3xl focus:ring-4 focus:ring-indigo-500/20 focus:border-transparent transition-all font-[Inter] text-lg placeholder-slate-500 shadow-sm"
              />
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-slate-400">🔍</span>
            </div>
            <select
              value={filters.type}
              onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
              className="px-6 py-4 bg-slate-100/60 backdrop-blur-sm border border-slate-200 rounded-3xl focus:ring-4 focus:ring-indigo-500/20 focus:border-transparent font-[Inter] text-lg shadow-sm"
            >
              <option>All Posts</option>
              <option>Lost Only</option>
              <option>Found Only</option>
            </select>
          </div>
        </div>

        {/* Create Post Form */}
        {showForm && (
          <div className="bento-xl glass-card p-8 col-span-full lg:col-span-4">
            <h3 className="text-2xl font-black tracking-tight font-[Geist] mb-8 text-slate-900">
              Create New Post
            </h3>
            <form onSubmit={submitPost} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <select
                  value={form.postType}
                  onChange={(e) => setForm((f) => ({ ...f, postType: e.target.value }))}
                  required
                  className="w-full p-5 rounded-2xl bg-slate-100/50 backdrop-blur-sm border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-transparent transition-all font-[Inter] text-lg shadow-sm"
                >
                  <option value="">Select Type</option>
                  <option value="lost">🔍 Lost Item</option>
                  <option value="found">✅ Found Item</option>
                </select>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Item title (optional)"
                  className="w-full p-5 rounded-2xl bg-slate-100/50 backdrop-blur-sm border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-transparent transition-all font-[Inter] text-lg shadow-sm"
                />
              </div>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Describe the item, where/when seen, key details..."
                required
                rows="4"
                className="w-full p-5 rounded-2xl bg-slate-100/50 backdrop-blur-sm border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-transparent transition-all resize-vertical font-[Inter] text-lg shadow-sm"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="📍 Location (Library, Cafeteria, etc)"
                  className="w-full p-5 rounded-2xl bg-slate-100/50 backdrop-blur-sm border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-transparent transition-all font-[Inter] text-lg shadow-sm"
                />
                <input
                  type="date"
                  value={form.itemDate}
                  onChange={(e) => setForm((f) => ({ ...f, itemDate: e.target.value }))}
                  className="w-full p-5 rounded-2xl bg-slate-100/50 backdrop-blur-sm border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-transparent transition-all font-[Inter] text-lg shadow-sm"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.files?.[0] }))}
                  className="w-full p-5 rounded-2xl bg-slate-100/50 backdrop-blur-sm border border-slate-200 border-dashed file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:bg-white file:text-lg file:font-semibold file:text-slate-700 hover:file:bg-slate-50 transition-all shadow-sm cursor-pointer"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button type="submit" className="btn-primary flex-1 h-16 text-xl shadow-xl hover:shadow-2xl font-[Geist]">
                  📤 Post to Campus
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary h-16 flex items-center justify-center text-xl font-[Geist]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="glass-card p-8 bg-red-50/80 border-2 border-red-200 col-span-full">
            <div className="flex items-center gap-4 text-red-800">
              <div className="text-3xl">⚠️</div>
              <p className="text-lg font-semibold font-[Inter]">{error}</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="col-span-full grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4].map((i) => (
              <div key={i} className="glass-card p-8 animate-pulse">
                <div className="w-16 h-16 bg-slate-200 rounded-2xl mb-4"></div>
                <div className="h-6 bg-slate-200 rounded-xl mb-3 w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded-xl w-1/2 mb-6"></div>
                <div className="h-64 bg-slate-200 rounded-2xl"></div>
              </div>
            ))}
          </div>
        )}

        {/* Posts Grid */}
        {!loading && posts.length === 0 ? (
          <div className="col-span-full text-center py-32">
            <div className="text-8xl mb-8 opacity-20">📭</div>
            <h3 className="text-4xl font-black tracking-tight font-[Geist] mb-4 text-slate-700">
              No posts yet
            </h3>
            <p className="text-xl text-slate-600 mb-12 font-[Inter] max-w-md mx-auto">
              Be the first to post or try different filters
            </p>
            <button onClick={() => setShowForm(true)} className="btn-primary px-12 py-6 text-xl shadow-2xl">
              + Create First Post
            </button>
          </div>
        ) : (
          <div className="col-span-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 lg:gap-8">
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
    </>
  );
}

