import mongoose from "mongoose";
const CommentSchema = new mongoose.schema(
  {
    pollId: {
      type: String,
      id: { type: mongoose.Schema.Types.ObjectId, ref: "poll" },
    },
    userId: {
      type: String,
      id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    },
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    disLikes: {
      type: Number,
      default: 0,
    },
  },
  { timeStampe: true }
);
const CommentModel =
  mongoose.models.comment || mongoose.model("comment", CommentSchema);
export default CommentModel;
