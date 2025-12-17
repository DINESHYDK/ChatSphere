import mongoose from "mongoose";

const PollSchema = new mongoose.Schema(
  {
    userId: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    pollOptions: [  
      {
        content: {
          type: String,
          required: true,
        },
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
    gender: {
      type: String,
      enum: ["A", "F", "M"],
      default: "A",
    },
    totalVotes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const PollModel = mongoose.models.poll || mongoose.model("poll", PollSchema);
export default PollModel;
