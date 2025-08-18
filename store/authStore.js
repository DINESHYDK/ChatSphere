import { create } from "zustand";
import Router from "next/router";

const authStore = create((set, get) => ({
  is_auth_request_pending: false, //for auth related request
  is_email_verified: false, // *** so that no outside user can access the OTP  verification ***
  is_reset_otp_verified: false,
  authUser: null,
  setAuthUser: (userData) => {
    set({ authUser: userData });
  },
  SignUp: async (userData) => {
    if (get().is_auth_request_pending || !userData) return;
    try {
      set({ is_auth_request_pending: true });
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
      const { newUser } = data;
      Router.push(`/auth/verify-email?token=${newUser.emailVerificationToken}`);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      set({ is_auth_request_pending: false });
    }
  },
  SignIn: async (userData) => {
    if (get().is_auth_request_pending || !userData) return;
    try {
      set({ is_auth_request_pending: true });
      const res = await fetch("/api/auth/signIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userData }),
      });
      if (!res.ok) {
        console.log("Invalid credentials");
        return;
      }
      console.log("Sign in successful");
      const data = await res.json();
      set({ authUser: data.user });
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      set({ is_auth_request_pending: false });
    }
  },
  Logout: async () => {
    await fetch("/api/auth/logout");
  },
  forgot_password: async (email) => {
    if (get().is_auth_request_pending || !email) return;
    try {
      set({ is_auth_request_pending: true });
      let res = await fetch("/api/auth/forgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        console.log("Invalid Credentials");
        return;
      }
    } catch (err) {
      console.log("Something went wrong ", err);
    } finally {
      set({ is_auth_request_pending: false });
    }
  },
  reset_password: async (password, token) => {
    if (get().is_auth_request_pending || !password || !token) return;
    try {
      set({ is_auth_request_pending: true });
      let res = await fetch(`/api/auth/resetPassword?token=${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        Router.push("/auth/signin");
        return;
      }
      console.log("Password reset successful");
    } catch (error) {
      console.error(error);
    } finally {
      set({ is_auth_request_pending: false });
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
  verifyEmail: async (token) => {
    try {
      if (!token) return;
      let res = await fetch(`/api/auth/verify-email?token=${token}`);
      if (!res.ok) {
        Router.push(`/auth/signup`);
        return;
      }
      set({ is_email_verified: true });
    } catch (err) {
      console.log("Error during email verification", err);
    }
  },
  verify_otp: async (token) => {
    if (get().is_auth_request_pending || !token) return;
    try {
      set({ is_auth_request_pending: true });
      let res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        console.log("OTP verification failed");
        return;
      }
      const data = await res.json();
      set({ authUser: data.user });
      console.log("User verification successful");
    } catch (err) {
      console.log("Error during email verification", err);
    } finally {
      set({ is_auth_request_pending: false });
    }
  },
  verify_reset_token: async (token) => {
    try {
      if (!token) return;
      let res = await fetch(`/api/auth/verify-reset-token?token=${token}`);
      if (!res.ok) {
        Router.push(`/auth/forgot-password`);
        return;
      }
      set({ is_reset_otp_verified: true });
    } catch (err) {
      console.log("Error during password reset", err);
    }
  },
}));
export default authStore;
