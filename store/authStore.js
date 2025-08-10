import { create } from "zustand";

const authStore = create((set) => ({
  authUser: null,
  setAuthUser: (userData) => {
    set({ authUser: userData });
  },
  SignUp: async (userData) => {
    try {
      const res = await fetch("/api/auth/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userData }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  SignIn: async (userData) => {
    try {
      const res = await fetch("/api/auth/signIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userData }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      set({ authUser: data.user });
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  Logout: async () => {
    await fetch("/api/auth/logout");
  },
  forgotPassword: async (email) => {
    try {
      let res = await fetch("/api/auth/forgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        throw new Error("Failed to send password reset email");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  resetPassword: async (password) => {
    try {
      let res = await fetch("/api/auth/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        throw new Error("Failed to send password reset email");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  updateUser: async (userData) => {
    try {
      let res = await fetch("/api/auth/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userData }),
      });
      if (!res.ok) {
        return;
      }
      const data = await response.json();
      // set({ authUser:  })
    } catch (error) {
      console.error(error);
    }
  },
}));
export default authStore;
