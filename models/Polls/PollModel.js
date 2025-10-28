import mongoose from "mongoose";

const PollSchema = new mongoose.Schema(
  {
    pollAutherId: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      type: String,
      required: true,
    },
    pollTitle: {
      type: String,
      required: true,
    },
    pollOptions: [
      {
        content: String, // *** if user have non-image poll ***
        imageUrl: {
          type: String,
          default: "",
        },
        votesCount: {
          type: Number,
          default: 0,
        },
      },
    ],
    pollFor: {
      type: String,
      enum: ["A", "F", "M"],
      default: "A",
    },
    totalVotes: {
      type: Number,
      default: 0,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const PollModel = mongoose.models.poll || mongoose.model("poll", PollSchema);
export default PollModel;
