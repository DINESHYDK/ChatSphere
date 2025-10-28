import connectToDatabase from "../../../config/mongoose";
import PollVoteModel from "../../../models/Polls/PollVoteModel";
import UserModel from "../../../models/User/UserModel";
import Cryptr from "cryptr";
import PollModel from "../../../models/Polls/PollModel";

export default async function SavePollVotes(req, res) {
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      const cookie_name = process.env.AUTH_USERID_COOKIE;
      const encryptId = req.cookies[cookie_name];
      if (!encryptId) res.status(401).json({ message: "Unauthorised" });

      const secret = process.env.JWT_SECRET;
      const cryptr = new Cryptr(secret);

      const userId = cryptr.decrypt(encryptId);
      const { pollId, optionIndex } = req.body;

      if (!pollId) return res.status(400).json({ message: "Missing data" });

      const user = await UserModel.findById(userId);
      if (!user) return res.status(404).json({ message: "Unauthorised" });
      const userGender = user.gender;

      const poll = await PollModel.findById(pollId);
      if (!poll) return res.status(400).json({ message: "Poll not exist" });
      const pollGender = poll.pollFor;

      if (!pollGender || !userGender)
        return res.status(400).json({ message: "Missing data" });

      if (pollGender !== "A" && userGender !== pollGender)
        return res.status(400).json({ message: "Voting not allowed" });

      if (optionIndex >= poll.pollOptions.length)
        return res.status(400).json({ message: "Invalid" });

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
