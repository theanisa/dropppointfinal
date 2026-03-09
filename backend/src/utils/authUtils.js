import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const hashPassword = async (plainText) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
};

export const comparePassword = async (plainText, hash) => {
  return bcrypt.compare(plainText, hash);
};

export const createToken = (user) => {
  const payload = { id: user._id, studentId: user.studentId, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};
