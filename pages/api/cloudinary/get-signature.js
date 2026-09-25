import devLog from "@/utils/logger";
import { NextResponse } from "next/server";
import generateSignature from "@/utils/cloudinarySignature";
import checkAuthAndCookie from "@/utils/checkAuth";

export default async function getSignature(req, res) {
  if (req.method === "GET") {
    try {
      const obj = await checkAuthAndCookie(req);
      if (!obj)
        return res.status(500).json({ message: "SOMETHING_WENT_WRONG" });
      if (obj.statusCode === 401)
        return res.status(401).json({ message: obj.message });

      const myObj = generateSignature();
      const { signature, timestamp, api_key, cloud_name } = myObj;
      return res.status(200).json({
        signature: signature,
        timestamp: timestamp,
        api_key: api_key,
        cloud_name: cloud_name,
      });
    } catch (err) {
      devLog("ERROR_UPLOADING_IMAGE", err);
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
