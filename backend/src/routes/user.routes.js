import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';
import { hashPassword } from '../utils/authUtils.js';

const router = express.Router();

// Get current user
router.get('/me', authenticate, async (req, res) => {
  res.json({ user: req.user });
});

// Update current user
router.put('/me', authenticate, uploadSingle('profile_image'), async (req, res) => {
  try {
    const updates = {};
    const { fullName, email, contact, password } = req.body;

    if (fullName) updates.fullName = fullName;
    if (email) updates.email = email;
    if (contact) updates.contact = contact;

    if (password) {
      updates.passwordHash = await hashPassword(password);
    }

    if (req.file) {
      updates.profileImage = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-passwordHash');
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
