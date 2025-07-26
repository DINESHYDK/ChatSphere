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
    imageUrl: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
const UserModel = mongoose.models.user || mongoose.model("user", UserSchema);
export default UserModel;
