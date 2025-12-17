import devLog from "./logger";

export default async function uploadImage(pollObj) {
  const res = await fetch("/api/cloudinary/get-signature");
  const obj = await res.json();
  const { signature, timestamp, api_key, cloud_name } = obj;

  const poll_data = pollObj.options?.filter((option) => option.image != "");
  if (poll_data.length == 0) return;

  const promiseArr = poll_data.map(async (option) => {
    const formData = new FormData();
    formData.append("file", option.image);
    formData.append("signature", signature);
    formData.append("api_key", api_key);
    formData.append("timestamp", timestamp);
    formData.append("folder", "poll_images_chatsphere");
    formData.append("source", "uw");

    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

    let data;
    try {
      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
      data = await res.json();
    } catch (err) {
      devLog("Something went wrong", err);
    }

    return {
      id: option.id,
      url: data,
    };
  });
  const result = await Promise.all(promiseArr);
  return result;
}
