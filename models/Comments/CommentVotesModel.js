import mongoose from "mongoose";
const CommentVotesSchema = new mongoose.schema(
  {
    commentId: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "comment" },
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    disLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  { timeStampe: true }
);
const CommentVotesModel =
  mongoose.models.commentVotes ||
  mongoose.model("commentVotes", CommentVotesSchema);
export default CommentVotesModel;
