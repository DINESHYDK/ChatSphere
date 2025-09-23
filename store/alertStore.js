import { ToastContainer, toast } from 'react-toastify';
import { set } from "mongoose";
import { create } from "zustand";
const alertStore = create((set, get) => {
  is_alert_occuring: false
});
