import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchPosts, createPost, toggleClaim, deletePost, addComment, deleteComment } from '../api/posts';
import { connectSocket } from '../utils/socket';

export default function Dashboard() {
  const { user, logout } = useAuth();
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

    const refresh = () => {
      loadPosts();
    };

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const submitPost = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('post_type', form.postType);
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
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold">DropPoint</div>
            <div className="text-sm text-gray-600">{user?.fullName}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Sign out
            </button>
            {canAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="px-4 py-2 rounded bg-orange-500 text-black hover:bg-black hover:text-white"
              >
                Admin
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Lost anything? Found anything?</h2>
                <p className="text-sm text-gray-600">Share details with the community.</p>
              </div>
              <button
                onClick={() => setShowForm((prev) => !prev)}
                className="px-4 py-2 rounded bg-orange-500 text-black hover:bg-black hover:text-white"
              >
                {showForm ? 'Close' : 'Post'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={submitPost} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <select
                    value={form.postType}
                    onChange={(e) => setForm((f) => ({ ...f, postType: e.target.value }))}
                    required
                    className="border rounded px-3 py-2"
                  >
                    <option value="">Select Type</option>
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                  </select>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Title (optional)"
                    className="border rounded px-3 py-2"
                  />
                </div>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe the item..."
                  required
                  className="w-full border rounded px-3 py-2"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="Location"
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="date"
                    value={form.itemDate}
                    onChange={(e) => setForm((f) => ({ ...f, itemDate: e.target.value }))}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.files?.[0] }))}
                    className="border rounded px-3 py-2"
                  />
                </div>
                <div className="flex gap-2">
                  <button className="bg-orange-500 text-black px-4 py-2 rounded hover:bg-black hover:text-white">
                    Post
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="border px-4 py-2 rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                placeholder="Search posts or location..."
                className="border rounded px-3 py-2"
              />
              <select
                value={filters.type}
                onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
                className="border rounded px-3 py-2"
              >
                <option value="">All</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>
          </div>

          {error && <div className="text-red-600">{error}</div>}

          {loading ? (
            <div className="text-gray-600">Loading posts…</div>
          ) : posts.length === 0 ? (
            <div className="bg-white p-6 rounded shadow text-center text-gray-600">No posts found.</div>
          ) : (
            posts.map((post) => (
              <article key={post._id} className="bg-white p-4 rounded shadow">
                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                  <div>
                    <div className="text-sm text-gray-500">
                      {post.user?.fullName || 'Unknown'} • <span className="font-medium text-sm">{post.postType}</span>
                    </div>
                    {post.title && <h3 className="font-bold text-lg mt-1">{post.title}</h3>}
                    <p className="text-gray-700 mt-2 whitespace-pre-line">{post.description}</p>
                    {post.image && <img src={post.image} alt="post" className="mt-3 w-full max-h-80 object-cover rounded" />}
                    <div className="mt-2 text-sm text-gray-500">
                      Location: {post.location || '—'} • {new Date(post.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    {(post.user?._id === user?._id) && (
                      <>
                        <button
                          onClick={() => handleClaim(post._id)}
                          className="bg-yellow-500 text-black px-3 py-1 rounded text-sm"
                        >
                          {post.isClaimed ? 'Unclaim' : 'Mark as Claimed'}
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {!(post.user?._id === user?._id) && post.isClaimed && (
                      <div className="text-green-600 text-xl font-semibold">✅ Claimed</div>
                    )}
                  </div>
                </div>

                <CommentsBlock
                  comments={post.comments || []}
                  postId={post._id}
                  currentUser={user}
                  onAddComment={handleAddComment}
                  onDeleteComment={handleDeleteComment}
                />
              </article>
            ))
          )}
        </section>

        <aside className="flex flex-col items-center space-y-4 text-center">
          <div className="w-full bg-white p-4 rounded shadow">
            <div className="flex items-center gap-4">
              {user?.profileImage ? (
                <img src={user.profileImage} className="w-24 h-24 rounded-full object-cover" alt="Profile" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center text-3xl">
                  {user?.fullName?.slice(0, 1)}
                </div>
              )}
              <div className="text-left">
                <div className="text-lg font-semibold">{user?.fullName}</div>
                <div className="text-sm text-gray-500">{user?.email}</div>
              </div>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="mt-4 inline-block bg-orange-500 hover:bg-black hover:text-white text-black font-semibold px-5 py-2 rounded-full transition"
            >
              Edit Profile
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}

function CommentsBlock({ comments, postId, currentUser, onAddComment, onDeleteComment }) {
  const [text, setText] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddComment(postId, text.trim());
    setText('');
  };

  return (
    <div className="mt-4 border-t pt-3">
      {comments?.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} className="mb-3">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>{comment.user?.fullName || 'Anonymous'}</span>
              <span className="text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
            </div>
            <div className="text-gray-700 mt-1 whitespace-pre-line">{comment.comment}</div>
            {comment.user?._id === currentUser?._id && (
              <button
                onClick={() => onDeleteComment(postId, comment._id)}
                className="text-xs text-red-500 mt-1"
              >
                Delete
              </button>
            )}
          </div>
        ))
      ) : (
        <div className="text-sm text-gray-500 mb-2">No comments yet.</div>
      )}

      <form onSubmit={submit} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border px-3 py-2 rounded"
        />
        <button className="bg-gray-800 text-white px-4 py-2 rounded">Comment</button>
      </form>
    </div>
  );
}
