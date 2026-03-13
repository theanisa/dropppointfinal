import express from 'express';
import mongoose from 'mongoose';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// List posts with optional search & type filters
router.get('/', async (req, res) => {
  try {
    const { search, type } = req.query;
    const filter = {};
    if (type) {
      filter.postType = type;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { title: regex },
        { description: regex },
        { location: regex },
      ];
    }

    const posts = await Post.find(filter)
      .populate('user', 'fullName')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'fullName' },
      })
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create post
router.post('/', authenticate, uploadSingle('image'), async (req, res) => {
  try {
    const { postType, title, description, location, itemDate } = req.body;
    if (!postType || !description) {
      return res.status(400).json({ message: 'postType and description are required' });
    }

    const post = await Post.create({
      user: req.user._id,
      postType,
      title,
      description,
      location,
      itemDate: itemDate ? new Date(itemDate) : undefined,
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('post:created', post);
    }

    res.status(201).json({ post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle claimed state (owner only)
router.post('/:id/claim', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!post.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.isClaimed = !post.isClaimed;
    await post.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('post:updated', post);
    }

    res.json({ post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post (owner or admin)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (!post.user.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Comment.deleteMany({ post: post._id });
    await post.remove();

    const io = req.app.get('io');
    if (io) {
      io.emit('post:deleted', { postId: post._id.toString() });
    }

    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment
router.post('/:id/comments', authenticate, async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment) return res.status(400).json({ message: 'Comment is required' });

    const postId = req.params.id;
    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ message: 'Invalid post id' });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = await Comment.create({
      post: post._id,
      user: req.user._id,
      comment,
    });

    await newComment.populate('user', 'fullName');

    const io = req.app.get('io');
    if (io) {
      io.emit('comment:created', { postId, comment: newComment });
    }

    res.status(201).json({ comment: newComment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete comment (owner or admin)
router.delete('/:id/comments/:commentId', authenticate, async (req, res) => {
  try {
    const { commentId } = req.params;
    if (!mongoose.isValidObjectId(commentId)) {
      return res.status(400).json({ message: 'Invalid comment id' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (!comment.user.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.remove();

    const io = req.app.get('io');
    if (io) {
      io.emit('comment:deleted', {
        postId: comment.post.toString(),
        commentId: comment._id.toString(),
      });
    }

    res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: list all posts (same as GET / but only for admin, pass-through)
router.get('/admin/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'fullName studentId').sort({ createdAt: -1 });
    res.json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user's posts
router.get('/my-posts', authenticate, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id })
      .populate('user', 'fullName')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'fullName' },
      })
      .sort({ createdAt: -1 });
    res.json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
