import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    studentId: { type: String, trim: true, required: true, unique: true },
    fullName: { type: String, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    contact: { type: String, trim: true },
    profileImage: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
