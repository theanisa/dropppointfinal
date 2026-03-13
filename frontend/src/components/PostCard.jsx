import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function PostCard({ post, currentUser, onClaim, onDelete, onAddComment, onDeleteComment }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false); // Placeholder for like state

  const isOwner = post.user?._id === currentUser?._id;
  const comments = post.comments || [];

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(post._id, newComment);
      setNewComment('');
    }
  };

  return (
    <article className="fb-card group">
      {/* Post Header */}
      <div className="fb-post-header">
        <div className="fb-avatar-small bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">
          {post.user?.fullName?.slice(0,1) || 'U'}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-sm truncate">{post.user?.fullName || 'Anonymous'}</h4>
          <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          post.postType === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {post.postType?.toUpperCase()}
        </span>
      </div>

      {/* Post Content */}
      {post.title && (
        <h3 className="font-bold text-base mb-2 leading-tight">{post.title}</h3>
      )}
      <p className="text-gray-700 mb-4 text-sm leading-relaxed line-clamp-3">{post.description}</p>

      {post.image && (
        <div className="mb-4 rounded-fb-lg overflow-hidden shadow-fb group-hover:shadow-fb-elevated">
          <img 
            src={`http://localhost:5000${post.image}`} 
            alt="Post" 
            className="w-full h-64 object-cover hover:scale-[1.02] transition-transform duration-200"
          />
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
        <span>📍 {post.location || 'Campus'}</span>
        {post.isClaimed && <span className="text-green-600 font-semibold">✅ Claimed</span>}
      </div>

      {/* Reactions */}
      <div className="fb-reactions">
        <button 
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            liked ? 'text-orange-primary bg-orange-50' : 'text-gray-600 hover:text-orange-primary hover:bg-orange-50'
          }`}
        >
          👍 Like ({Math.floor(Math.random()*10 + 1)})
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900 px-3 py-1 rounded-full text-xs font-medium transition-colors"
        >
          💬 Comment ({comments.length})
        </button>
        <button className="text-gray-600 hover:text-gray-900 px-3 py-1 rounded-full text-xs font-medium transition-colors">
          🔗 Share
        </button>
      </div>

      {/* Action Buttons (owner only) */}
      {isOwner && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={() => onClaim(post._id)}
            className="fb-btn-secondary flex-1"
          >
            {post.isClaimed ? 'Unclaim' : 'Claim'}
          </button>
          <button
            onClick={() => onDelete(post._id)}
            className="fb-btn-danger flex-1"
          >
            Delete
          </button>
        </div>
      )}

      {/* Comments */}
      {showComments && (
        <>
          <div className="mt-4 space-y-2 max-h-48 overflow-y-auto border-t border-gray-100 pt-3">
            {comments.map((comment) => (
              <div key={comment._id} className="flex gap-3 p-2 bg-gray-50 rounded-fb">
                <div className="w-8 h-8 rounded-full bg-orange-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {comment.user?.fullName?.slice(0,1) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate pr-2">{comment.user?.fullName || 'Anonymous'}</div>
                  <div className="text-xs text-gray-500 mb-1">{new Date(comment.createdAt).toLocaleDateString()}</div>
                  <p className="text-sm text-gray-900 break-words">{comment.comment}</p>
                </div>
                {comment.user?._id === currentUser?._id && (
                  <button 
                    onClick={() => onDeleteComment(post._id, comment._id)}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold ml-2"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-3 p-3 bg-gray-50 rounded-fb">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-fb focus:ring-1 focus:ring-orange-primary focus:border-transparent text-sm"
            />
            <button type="submit" className="fb-btn-primary whitespace-nowrap">
              Post
            </button>
          </form>
        </>
      )}
    </article>
  );
}

