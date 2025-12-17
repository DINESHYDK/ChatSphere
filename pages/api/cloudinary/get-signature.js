import devLog from "@/utils/logger";
import { NextResponse } from "next/server";
import generateSignature from "@/utils/cloudinarySignature";

export default function getSignature(req, res) {
  if (req.method === "GET") {
    try {
      const obj = generateSignature();
      const { signature, timestamp, api_key, cloud_name } = obj;
      return res.status(200).json({
        signature: signature,
        timestamp: timestamp,
        api_key: api_key,
        cloud_name: cloud_name
      });
    } catch (err) {
      devLog("Error while uplading image", err);
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}