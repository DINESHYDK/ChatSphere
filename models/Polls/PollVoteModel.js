import mongoose from "mongoose";
const PollVoteSchema = new mongoose.schema(
  {
    pollId: { type: mongoose.Schema.Types.ObjectId, ref: "poll" },
    optionIndex: {
        type: Number,
        required: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { timeStampe: true }
);
const PollVoteModel =
  mongoose.models.pollVotes || mongoose.model("pollVotes", PollVoteSchema);
export default PollVoteModel;
