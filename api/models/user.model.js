import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        'https://www.shutterstock.com/image-vector/blog-writing-line-icon-web-600nw-2366232875.jpg',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// MongoDB Index for Fast User Chronological Queries
userSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);

export default User;
