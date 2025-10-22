import connectToDatabase from "../../../config/mongoose";
import messageModel from "../../../models/Messages/MessageModel";

export default async function SaveMessage(req, res) {
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      // let encry_id = req.cookies.USID;
      // console.log(encry_id);
      return res.status(200).json({ message: "success" });
    } catch (err) {
      console.log('error  is ' ,err);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
