import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      type: String,
      required: true,
    },
    receiverId: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const MessageModel =
  mongoose.models.message || mongoose.model("message", MessageSchema);
export default MessageModel;

MessageSchema.index({
  senderId: 1,
  receiverId: 1,
  _id: -1,
});
