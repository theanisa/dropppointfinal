import { useState } from 'react';

export default function PostCard({ post, currentUser, onClaim, onDelete, onAddComment, onDeleteComment }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);

  const isOwner = post.user?._id === currentUser?._id;
  const comments = post.comments || [];

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(post._id, newComment);
      setNewComment('');
    }
  };

  const typeBadge = post.postType === 'lost' ? 
    'bg-gradient-to-r from-red-400 to-red-500 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide shadow-lg' :
    'bg-gradient-to-r from-emerald-400 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide shadow-lg';

  return (
    <article className="glass-card group cursor-pointer hover:shadow-xl transition-all duration-300 p-8 hover:-translate-y-2">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-100">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-md ring-2 ring-slate-100 flex-shrink-0 ${
          post.user?.fullName ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white' : 'bg-slate-200 text-slate-600'
        }`}>
          {post.user?.fullName?.slice(0,1)?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-lg text-slate-900 font-[Geist] truncate mb-1">
            {post.user?.fullName || 'Anonymous'}
          </h4>
          <p className="text-sm text-slate-500 font-[Inter] mb-2">
            {new Date(post.createdAt).toLocaleDateString()} • 📍 {post.location || 'Campus'}
          </p>
          <span className={typeBadge}>
            {post.postType === 'lost' ? 'Lost' : 'Found'}
          </span>
          {post.isClaimed && (
            <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800 font-semibold">
              ✅ Claimed
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      {post.title && (
        <h3 className="text-xl font-bold text-slate-900 font-[Geist] mb-4 leading-tight group-hover:text-indigo-700 transition-colors">
          {post.title}
        </h3>
      )}
      <p className="text-slate-700 text-lg leading-relaxed mb-6 font-[Inter] line-clamp-3">
        {post.description}
      </p>

      {/* Image */}
      {post.image && (
        <div className="mb-8 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <img 
            src={`http://localhost:5000${post.image}`} 
            alt="Post image" 
            className="w-full h-80 object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Reactions */}
      <div className="flex items-center gap-6 mb-6 pt-4 border-t border-slate-100">
        <button 
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold font-[Inter] transition-all ${
            liked 
              ? 'bg-indigo-100 text-indigo-700 shadow-sm' 
              : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          👍 Like ({Math.floor(Math.random()*10 + 1)})
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 px-4 py-2 rounded-2xl text-sm font-semibold font-[Inter] hover:bg-slate-100 transition-all"
        >
          💬 Comment ({comments.length})
        </button>
        <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 px-4 py-2 rounded-2xl text-sm font-semibold font-[Inter] hover:bg-slate-100 transition-all">
          🔗 Share
        </button>
      </div>

      {/* Owner Actions */}
      {isOwner && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => onClaim(post._id)}
            className="btn-secondary h-12 flex items-center justify-center font-[Inter] text-sm"
          >
            {post.isClaimed ? 'Unclaim' : 'Mark Claimed'}
          </button>
          <button
            onClick={() => onDelete(post._id)}
            className="btn-danger h-12 flex items-center justify-center font-[Inter] text-sm"
          >
            Delete
          </button>
        </div>
      )}

      {/* Comments Section */}
      {showComments && (
        <div>
          {/* Comments List */}
          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment._id} className="flex gap-4 p-4 bg-slate-50/80 backdrop-blur-sm rounded-2xl hover:bg-slate-100 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  comment.user?.fullName ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {comment.user?.fullName?.slice(0,1)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-bold text-sm text-slate-900 font-[Geist] truncate">
                      {comment.user?.fullName || 'Anonymous'}
                    </h5>
                    <span className="text-xs text-slate-500 font-[Inter]">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-800 font-[Inter]">{comment.comment}</p>
                  {comment.user?._id === currentUser?._id && (
                    <button 
                      onClick={() => onDeleteComment(post._id, comment._id)}
                      className="mt-2 text-sm text-red-500 hover:text-red-700 font-semibold font-[Inter] ml-auto block"
                    >
                      Delete comment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          <form onSubmit={handleCommentSubmit} className="glass-card p-4 rounded-2xl flex gap-3">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-4 py-3 bg-slate-100/50 backdrop-blur-sm border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-[Inter] placeholder-slate-500 text-lg"
            />
            <button 
              type="submit" 
              disabled={!newComment.trim()}
              className="btn-primary px-8 whitespace-nowrap font-[Inter] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </article>
  );
}

