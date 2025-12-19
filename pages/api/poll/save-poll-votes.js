import connectToDatabase from "../../../config/mongoose";
import PollVoteModel from "../../../models/Polls/PollVoteModel";
import checkAuthAndCookie from "@/utils/checkAuth";
import PollModel from "../../../models/Polls/PollModel";

export default async function SavePollVotes(req, res) {
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      const obj = checkAuthAndCookie(req);
      if (!obj)
        return res.status(500).json({ message: "SOMETHING_WENT_WRONG" });
      if (obj.statusCode === 401)
        return res.status(401).json({ message: obj.message });

      const { pollId, optionIndex } = req.body;

      if (!pollId)
        return res.status(400).json({ message: "MISSING_REQUIRED_FIELDS" });

      const poll = await PollModel.findById(pollId);
      if (!poll) return res.status(400).json({ message: "INVALID_REQUEST" });
      const pollGender = poll.pollFor;

      if (!pollGender || !userGender)
        return res.status(400).json({ message: "MISSING_REQUIRED_FIELDS" });

      if (pollGender !== "A" && userGender !== pollGender)
        return res.status(403).json({ message: "FORBIDDEN_TO_VOTE" });

      if (optionIndex >= poll.pollOptions.length)
        return res.status(400).json({ message: "INVALID_REQUEST" });

      const newPollVote = await PollVoteModel.create({
        pollId,
        userId,
        optionIndex,
        userGender,
      });

      return res.status(200).json({ message: "SUCCESS" });
    } catch (err) {
      console.log("error is", err);
      return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
