import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postType: { type: String, enum: ['lost', 'found'], required: true },
    title: { type: String, trim: true },
    description: { type: String, trim: true, required: true },
    location: { type: String, trim: true },
    itemDate: { type: Date },
    image: { type: String },
    isClaimed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  justOne: false,
  options: { sort: { createdAt: 1 } },
});

export default mongoose.model('Post', postSchema);
