import cloudinary from "../lib/cloudinary.js";

export default function generateSignature(req, res) {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      source: "uw",
      folder: "poll_images_chatsphere",
    },
    process.env.CLOUDINARY_API_SECRET
  );
  return {
    signature,
    timestamp,
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  };
}
