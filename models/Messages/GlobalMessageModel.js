import mongoose from "mongoose";
const GlobalMessageSchema = new mongoose.Schema(
  {
    senderId: {
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
  },
  { timestamps: true }
);
const GlobalMessageModel =
  mongoose.models.globalMessage ||
  mongoose.model("globalMessage", GlobalMessageSchema);
export default GlobalMessageModel;
