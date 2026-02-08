import { create } from "zustand";
import { API_ENDPOINTS } from "../constants/api-endpoints";
import devLog from "../utils/logger";
import imageCompression from "browser-image-compression";

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
  poll_images: [], // *** To store the links of images ***,
  is_saving_poll: false,
  set_is_saving_poll: () => {
    set({ is_saving_poll: !get().is_saving_poll });
  },

  compressImages: async (poll_data) => {
    const promiseArr = poll_data.map(async (option) => {
      const imageFile = option.rawFile;
      // console.log("originalFile instanceof Blob", imageFile instanceof Blob); // true
      // console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

      const myOptions = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      try {
        const compressedFile =
          imageFile.size < 400 * 1024 // setting threshold 400 KB
            ? imageFile
            : await imageCompression(option.rawFile, myOptions);

        // console.log(
        //   "compressedFile instanceof Blob",
        //   compressedFile instanceof Blob,
        // ); // true
        // console.log(
        //   `        // console.log(
        //   "compressedFile instanceof Blob",
        //   compressedFile instanceof Blob,
        // ); // true
        // console.log(
        //   `compressedFile size ${compressedFile.size / 1024 / 1024} MB`,
        // ); // smaller than maxSizeMBcompressedFile size ${compressedFile.size / 1024 / 1024} MB`,
        // ); // smaller than maxSizeMB

        return { ...option, rawFile: compressedFile };
      } catch (error) {
        console.log(error);
        return option;
      }
    });
    poll_data = await Promise.all(promiseArr);
    return poll_data;
  },

  uploadPollImages: async (pollObj) => {
    set({ is_image_fetch_pending: true });
    const { compressImages } = get();

    try {
      const res = await fetch(API_ENDPOINTS.CLOUDINARY.GET_SIGNATURE);
      const obj = await res.json();
      if (!res.ok) throw { message: "ERROR_WHILE_UPLOADING_IMAGES" };
      const { signature, timestamp, api_key, cloud_name } = obj;

      let poll_data = pollObj.options?.filter((option) => option.rawFile);
      if (poll_data.length == 0) return;

      poll_data = await compressImages(poll_data);

      // parallelly uploading images on cloudinary
      const promiseArr = poll_data.map(async (option) => {
        const formData = new FormData();
        formData.append("file", option.rawFile);
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

      // *** RawFile deleted  ***
      for (let option of pollObj.options) delete option.rawFile;

      for (let image of poll_images) {
        pollOptions[image.id] = {
          ...pollOptions[image.id],
          imageUrl: image.url,
        };
      }

      const pollData = { title, gender, pollOptions };
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
