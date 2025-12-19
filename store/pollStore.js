import { create } from "zustand";
import { API_ENDPOINTS } from "../constants/api-endpoints";
import devLog from "../utils/logger";
const pollStore = create((set, get) => ({
  is_poll_saving: false, // *** For Loader ***
  is_image_fetch_pending: false, // *** For Loader ***

  // polls: [],
  // myPolls: [],
  // createImagePoll: () => {},
  // createTextPoll: async (pollData) => {
  //   try {
  //     const res = await fetch(API_ENDPOINTS.POLLS.SAVE_POLL, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ pollData }),
  //     });
  //     const data = await res.json();
  //     if (!res.ok) {
  //       throw { message: data.message };
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  poll_images: [], // *** To store the links of images ***

  uploadPollImages: async (pollObj) => {
    set({ is_image_fetch_pending: true });

    try {
      const res = await fetch(API_ENDPOINTS.CLOUDINARY.GET_SIGNATURE);
      const obj = await res.json();
      if (!res.ok) throw err;
      const { signature, timestamp, api_key, cloud_name } = obj;

      const poll_data = pollObj.options?.filter((option) => option.rawFile);
      if (poll_data.length == 0) return;

      const promiseArr = poll_data.map(async (option) => {
        const formData = new FormData();
        formData.append("file", option.imageUrl);
        formData.append("signature", signature);
        formData.append("api_key", api_key);
        formData.append("timestamp", timestamp);
        formData.append("folder", "poll_images_chatsphere");
        formData.append("source", "uw");

        const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

        const res = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw data;

        return {
          id: option.id,
          url: data.secure_url,
        };
      });
      const result = await Promise.all(promiseArr);
      set({ poll_images: result });
      // console.log("result is ", result);
      const { savePoll } = get();
    } catch (err) {
      throw err;
    } finally {
      set({ is_image_fetch_pending: false });
    }
  },

  savePoll: async (pollObj) => {
    try {
      const { title, gender, options } = pollObj;
      const { poll_images } = get();
      if (
        !title ||
        !gender ||
        !options ||
        options.length < 2 ||
        options.length > 6
      )
        throw "Invalid Poll!!";
      const pollOptions = options;
      // console.log('done1');

      // *** RawFile deleted  ***
      for (let option of pollObj.options) delete option.rawFile;

      for (let image of poll_images) {
        pollOptions[image.id] = { ...pollOptions[image.id], imageUrl };
      }

      const pollData = { title, gender, pollOptions };
      console.log("final poll data is ", pollData);
      const res = await fetch(API_ENDPOINTS.POLLS.SAVE_POLL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pollData }),
      });
      const data = await res.json();
      if (!res.ok) throw data;
    } catch (err) {
      throw err;
    }
  },
}));
export default pollStore;
