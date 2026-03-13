import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchPosts, createPost, toggleClaim, deletePost, addComment, deleteComment } from '../api/posts';
import { connectSocket } from '../utils/socket';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
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
    itemDate: '',
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

  const canAdmin = useMemo(() => user?.role === 'admin', [user]);

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
      setForm({ postType: '', title: '', description: '', location: '', itemDate: '', image: null });
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

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container py-8 grid lg:grid-cols-[2.5fr_1fr] gap-8">
        {/* LEFT: Posts + Form + Search - PHP dashboard.php style */}
        <section className="lg:col-span-2 space-y-6">
          {/* Post Form + Search Card */}
          <div className="card">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold gradient-text mb-1">Lost anything? Found anything?</h2>
                <p className="text-gray-600">Share details with the community.</p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn-secondary self-start lg:self-auto px-8"
              >
                {showForm ? 'Close Form' : '+ Post Item'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={submitPost} className="space-y-4 p-6 bg-gray-50 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={form.postType}
                    onChange={(e) => setForm((f) => ({ ...f, postType: e.target.value }))}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Type</option>
                    <option value="lost">🔍 Lost</option>
                    <option value="found">✅ Found</option>
                  </select>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Title (optional)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe the item, location, date..."
                  required
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-vertical"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="📍 Location on campus"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="date"
                    value={form.itemDate}
                    onChange={(e) => setForm((f) => ({ ...f, itemDate: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.files?.[0] }))}
                    className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button type="submit" className="btn-primary flex-1">
                    📤 Post Item
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-8 py-3 border-2 border-gray-300 rounded-full font-bold hover:bg-gray-100 hover:border-gray-400 transition flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Search Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-orange-50 rounded-xl">
              <input
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                placeholder="🔍 Search posts, descriptions, locations..."
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <select
                value={filters.type}
                onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Posts</option>
                <option value="lost">🔍 Lost Items</option>
                <option value="found">✅ Found Items</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="card p-6 bg-red-50 border-2 border-red-200">
              <div className="text-red-800 font-semibold">{error}</div>
            </div>
          )}

          {loading ? (
            <div className="card p-12 text-center">
              <div className="text-4xl mb-4 animate-spin">🔄</div>
              <p className="text-gray-600 text-lg">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-6xl mb-6">📭</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No posts found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or create the first post!</p>
              <button onClick={() => setShowForm(true)} className="btn-secondary px-8">
                + Post First Item
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
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
        </section>

        {/* RIGHT: Profile Sidebar - PHP style */}
        <aside className="space-y-6">
          {/* Profile Card */}
          <div className="card p-6 text-center sticky top-8">
            <div className="avatar-sidebar mb-4 mx-auto">
              {user?.profileImage ? (
                <img src={`http://localhost:5000${user.profileImage}`} alt="Profile" className="avatar-sidebar" />
              ) : (
                <div className="avatar-sidebar bg-gradient-to-br from-orange-500 to-black flex items-center justify-center text-2xl font-bold text-white">
                  {user?.fullName?.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-extrabold gradient-text mb-1">
                👋 Welcome, {user?.fullName}!
              </h3>
              <p className="text-sm text-gray-500 mb-1">Student ID: {user?.studentId}</p>
              <p className="text-xs text-gray-400">Live updates enabled 🚀</p>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="btn-secondary w-full mt-6"
            >
              Edit Profile
            </button>
            {canAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="w-full mt-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Admin Panel
              </button>
            )}
          </div>

          {/* Quick Stats */}
          <div className="card p-6">
            <h4 className="font-bold text-lg mb-4 gradient-text">Quick Stats</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">My Posts</span>
                <span className="font-bold text-orange-500">{posts.filter(p => p.user?._id === user?._id).length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Lost Items</span>
                <span className="font-bold text-red-500">{posts.filter(p => p.postType === 'lost').length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Found Items</span>
                <span className="font-bold text-green-500">{posts.filter(p => p.postType === 'found').length}</span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

// PostCard Component (reusable)
function PostCard({ post, currentUser, onClaim, onDelete }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const isOwner = post.user?._id === currentUser?._id;
  const comments = post.comments || [];

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      // Parent will handle via prop
    }
  };

  return (
    <article className="post-card group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
            post.postType === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {post.postType.toUpperCase()}
          </span>
          {post.user?.fullName && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-700">
                {post.user.fullName.slice(0, 1)}
              </div>
              <span>{post.user.fullName}</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          {isOwner && (
            <>
              <button
                onClick={() => onClaim(post._id)}
                className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-yellow-600 shadow-md"
              >
                {post.isClaimed ? 'Unclaim' : 'Claim'}
              </button>
              <button
                onClick={() => onDelete(post._id)}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md hover:shadow-lg"
              >
                Delete
              </button>
            </>
          )}
          {!isOwner && post.isClaimed && (
            <span className="text-green-600 text-lg font-bold">✅ Claimed</span>
          )}
        </div>
      </div>

      {post.title && (
        <h3 className="font-bold text-xl mb-3 text-gray-900 leading-tight">{post.title}</h3>
      )}
      
      <p className="text-gray-700 mb-4 leading-relaxed line-clamp-4">{post.description}</p>

      {post.image && (
        <div className="mb-4 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
          <img 
            src={`http://localhost:5000${post.image}`} 
            alt="Post image" 
            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-4 text-sm mb-4">
        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-medium">
          📍 {post.location || 'Campus'}
        </span>
        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
        <span className="text-gray-500">Comments: {comments.length}</span>
      </div>

      {/* Comments Toggle */}
      <div className="border-t pt-4">
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-orange-500 font-semibold hover:text-orange-600 flex items-center gap-1 mb-3"
        >
          💬 {comments.length} {showComments ? 'Hide' : 'Show'} Comments
        </button>

        {showComments && (
          <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment._id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
                  {comment.user?.fullName?.slice(0, 1) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{comment.user?.fullName || 'Anonymous'}</div>
                  <div className="text-xs text-gray-500 mb-1">{new Date(comment.createdAt).toLocaleString()}</div>
                  <div className="text-gray-800 text-sm">{comment.comment}</div>
                  {comment.user?._id === user?._id && (
                    <button className="text-xs text-red-500 mt-1 hover:text-red-600 font-semibold">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Comment */}
        <form className="flex gap-2 p-3 bg-blue-50 rounded-xl" onSubmit={(e) => {
          e.preventDefault();
          handleAddComment(post._id, newComment);
          setNewComment('');
        }}>
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
          />
          <button type="submit" className="bg-orange-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-black hover:text-white shadow-md whitespace-nowrap">
            Comment
          </button>
        </form>
      </div>
    </article>
  );
}

