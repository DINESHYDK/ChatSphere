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
    const promiseArr = poll_data.map((option) => async () => {
      const myOptions = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(imageFile, myOptions);
        option.rawFile = compressedFile;
        return option;
      } catch (error) {
        console.log(error);
      }

      poll_data = await Promise.all(promiseArr);
    });
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

      const poll_data = pollObj.options?.filter((option) => option.rawFile);
      console.log("poll data is ", poll_data);
      if (poll_data.length == 0) return;

      poll_data = await compressImages(poll_data);
      // for (let i = 0; i < poll_data.length; i++) {
      //   poll_data[i].rawFile = await compressImage(poll_data[i].rawFile);
      // }

      // // *** Describe what this does ***
      // // async function handleImageUpload(event) {
      // const imageFile = poll_data[0].rawFile;
      // console.log("image file received");
      // // const imageFile = event.target.files[0];
      // console.log("originalFile instanceof Blob", imageFile instanceof Blob);
      // console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

      // const options = {
      //   maxSizeMB: 1,
      //   maxWidthOrHeight: 1920,
      //   useWebWorker: true,
      // };
      // try {
      //   const compressedFile = await imageCompression(imageFile, options);
      //   console.log(
      //     "compressedFile instanceof Blob",
      //     compressedFile instanceof Blob,
      //   );
      //   console.log(
      //     `compressedFile size ${compressedFile.size / 1024 / 1024} MB`,
      //   );

      //   // await uploadToServer(compressedFile);
      // } catch (error) {
      //   console.log(error);
      // }
      // // }
      // // *** Describe what this does ***

      return;

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
