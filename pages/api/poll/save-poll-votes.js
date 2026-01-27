import connectToDatabase from "../../../config/mongoose";
import PollVoteModel from "../../../models/Polls/PollVoteModel";
import UserModel from "../../../models/User/UserModel";
import PollModel from "../../../models/Polls/PollModel";
import checkAuthAndCookie from "@/utils/checkAuth";

export default async function SavePollVotes(req, res) {
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      const obj = await checkAuthAndCookie(req);
      if (!obj)
        return res.status(500).json({ message: "SOMETHING_WENT_WRONG(AUTH)" });
      if (obj.statusCode === 401)
        return res.status(401).json({ message: obj.message });

      const userId = obj.message._id;

      const { pollId, optionIndex } = req.body;

      if (!pollId) return res.status(400).json({ message: "MISSING_POLL_ID" });

      const user = await UserModel.findById(userId);
      if (!user) return res.status(404).json({ message: "UNAUTHORIZED" });
      const userGender = user.gender;

      const poll = await PollModel.findById(pollId);

      if (!poll) return res.status(400).json({ message: "INVALID_POLL_ID" });

      const pollGender = poll.gender;
      if (!pollGender || !userGender)
        return res.status(400).json({ message: "INVALID_REQUEST" });

      if (pollGender !== "A" && userGender !== pollGender)
        return res.status(400).json({ message: "FORBIDDEN" });

      if (optionIndex >= poll.pollOptions.length)
        return res.status(400).json({ message: "INVALID_INDEX" });

      poll.pollOptions[optionIndex].votesCount =
        poll.pollOptions[optionIndex].votesCount + 1;
      poll.totalVotes = poll.totalVotes + 1;
      await poll.save();

      const newPollVote = await PollVoteModel.create({
        pollId,
        userId,
        optionIndex,
        userGender,
      });

      return res.status(200).json({ message: "success" });
    } catch (err) {
      console.log("error is", err);
      return res.status(500).json({ message: "Internal server error: " });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
