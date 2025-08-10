const { default: mongoose } = require("mongoose");

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
        image: String, // *** if user have a image-involving poll ***
        votesCount: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalVotes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const PollModel = mongoose.models.poll || mongoose.model("poll", PollSchema);
export default PollModel;
