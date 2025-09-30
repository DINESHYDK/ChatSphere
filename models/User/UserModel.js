import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minLength: 7,
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
    emailVerificationToken: {
      type: String, // *** Later will be used as a slug during email verification ***
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    blockedUsers: {
      type: Array,
      id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    },
    totalOpinionSubmit: {
      type: Number,
    },
    verifyToken: String,
    verifyTokenExpiresAt: Date,
    resetToken: String,
    resetTokenExpiresAt: Date,
    // email_verification_requests: {
    //   type: Number,
    //   default: 0,
    // },
    // password_reset_requests: {
    //   type: Number,
    //   default: 0,
    // },
    email_verification: {
      last_updation_time: { type: Date },
      no_of_requests: { type: Number, default: 0 },
    },
    password_reset: {
      last_updation_time: { type: Date },
      no_of_requests: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);
const UserModel = mongoose.models.user || mongoose.model("user", UserSchema);
export default UserModel;
