import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
    image: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    verifyToken: String,
    verifyTokenExpiresAt: Date,
    resetToken: String,
    resetTokenExpiresAt: Date,
  },
  { timestamps: true }
);
const UserModel = mongoose.models.user || mongoose.model("user", UserSchema);
export default UserModel;
