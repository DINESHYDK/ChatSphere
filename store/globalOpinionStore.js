import { create } from "zustand";
import { API_ENDPOINTS } from "../constants/api-endpoints";
import devLog from '../utils/logger'

const globalOpinionStore = create((set) => ({
  polls: [],
  myPolls: [],
  createImagePoll: () => {},
  createTextPoll: async (pollData) => {
    try{
      const res = await fetch(API_ENDPOINTS.AUTH.SIGNUP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pollData }),
      });
      const data = await res.json();
      if (!res.ok){
        
      }
    }catch(err){

    }
  },
}));
