import mongoose from "mongoose";
const PollVoteSchema = new mongoose.Schema(
  {
    pollId: { type: mongoose.Schema.Types.ObjectId, ref: "poll" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    optionIndex: {
      type: Number,
      required: true,
    },
    // userGender: {
    //   type: String,
    //   enum: ["M", "F"],
    // },
  },
  { timeStampe: true }
);
const PollVoteModel =
  mongoose.models.pollVotes || mongoose.model("pollVotes", PollVoteSchema);
export default PollVoteModel;
