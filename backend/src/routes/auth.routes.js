import crypto from 'crypto';
import express from 'express';
import User from '../models/User.js';
import { hashPassword, comparePassword, createToken } from '../utils/authUtils.js';
import { sendMail } from '../utils/mail.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { studentId, fullName, email, password } = req.body;
    if (!studentId || !fullName || !password) {
      return res.status(400).json({ message: 'studentId, fullName and password are required' });
    }

    const existing = await User.findOne({ studentId });
    if (existing) {
      return res.status(400).json({ message: 'Student ID already registered' });
    }

    const passwordHash = await hashPassword(password);
    const isAdmin = studentId === process.env.ADMIN_STUDENT_ID;

    const user = await User.create({
      studentId,
      fullName,
      email,
      passwordHash,
      role: isAdmin ? 'admin' : 'user',
    });

    const token = createToken(user);
    res.status(201).json({ token, user: { id: user._id, studentId, fullName, email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { studentId, password } = req.body;
    if (!studentId || !password) {
      return res.status(400).json({ message: 'studentId and password are required' });
    }

    const user = await User.findOne({ studentId });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user);
    res.json({ token, user: { id: user._id, studentId: user.studentId, fullName: user.fullName, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot password: send reset token via email
router.post('/forgot-password', async (req, res) => {
  try {
    const { studentId, email } = req.body;
    if (!studentId && !email) {
      return res.status(400).json({ message: 'studentId or email is required' });
    }

    const user = await User.findOne({ $or: [{ studentId }, { email }] });
    if (!user) {
      return res.status(200).json({ message: 'If the account exists, a reset link has been sent.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const subject = 'DropPoint Password Reset';
    const html = `<p>Hi ${user.fullName},</p>
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <p><a href="${resetUrl}">Reset password</a></p>
      <p>This link will expire in 1 hour.</p>`;

    await sendMail({ to: user.email, subject, html });

    res.json({ message: 'If the account exists, a reset link has been sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password using token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.passwordHash = await hashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
