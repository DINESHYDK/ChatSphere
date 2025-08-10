import { create } from "zustand";

const globalOpinionStore = create((set) => ({
  polls: [],
  myPolls: [],
  createImagePoll: () => {},
  createTextPoll: () => {},
}));
