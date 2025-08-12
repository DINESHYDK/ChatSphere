import mongoose from "mongoose";
const PollVoteSchema = new mongoose.schema(
  {
    pollId: { type: mongoose.Schema.Types.ObjectId, ref: "poll" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    optionIndex: {
        type: Number,
        required: true,
    },
    userGender: {
      type: String,
      enum: ["male", "female"],
    }
  },
  { timeStampe: true }
);
const PollVoteModel =
  mongoose.models.pollVotes || mongoose.model("pollVotes", PollVoteSchema);
export default PollVoteModel;
