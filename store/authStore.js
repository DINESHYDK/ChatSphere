import { create } from "zustand";
import Router from "next/router";
import { toast, ToastContainer } from "react-toastify";

const ROUTES = {
  HOMEPAGE: "/",
  SIGNUP: "/auth/signup",
  SIGNIN: "/auth/signin",
  VERIFY_EMAIL: "/auth/verify-email?token=", //*** {Token will be provided in link} ***
  FORGOT_PASSWORD: "/auth/forgot-password",
};

const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: "/api/auth/signUp",
    SIGNIN: "/api/auth/signIn",
    LOGOUT: "/api/auth/logout",
    FORGOT_PASSWORD: "/api/auth/forgotPassword",
    RESET_PASSWORD: "/api/auth/resetPassword?token=", // *** {Token will be provided here} ***
    VERIFY_EMAIL: "/api/auth/verify-email?token=",
    VERIFY_OTP: "/api/auth/verify-otp",
    VERIFY_RESET_TOKEN: "/api/auth/verify-reset-token?token=", // *** {Token will be provided} ***
    UPDATE_USER: "/api/auth/update",
  },
};

const authStore = create((set, get) => ({
  is_auth_request_pending: false, //for auth related request
  is_email_verified: false, // *** so that no outside user can access the OTP  verification ***//
  is_reset_otp_verified: false,
  is_password_reset_req_pending: false, // *** { secifically made for password reset request } ***
  authUser: null,
  setAuthUser: (userData) => {
    set({ authUser: userData });
  },
  SignUp: async (userData) => {
    if (get().is_auth_request_pending || !userData) return;
    try {
      set({ is_auth_request_pending: true });
      const res = await fetch(API_ENDPOINTS.AUTH.SIGNUP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userData }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409 || res.status === 500) {
          toast.error(data.message);
        }
        throw { status: res.status, message: data.message || "Unknown error" };
      }
      const { newUser } = data;
      await Router.push(
        `${ROUTES.VERIFY_EMAIL}${newUser.emailVerificationToken}`
      );
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
      const res = await fetch(API_ENDPOINTS.AUTH.SIGNIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userData }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.log("Invalid credentials");
        if (res.status === 403 || res.status === 401 || res.status === 500) {
          toast.error(res.message);
        }
        throw { status: res.status, message: data.message || "Unknown error" };
      }
      console.log("Sign in successful");
      set({ authUser: data.user });
      await Router.push(ROUTES.HOMEPAGE);
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
    if (
      get().is_auth_request_pending ||
      !email 
       || (is_password_reset_req_pending)
    )
      return;
    try {
      set({ is_auth_request_pending: true });
      set({ is_password_reset_req_pending: true });
      let res = await fetch(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401 || res.status === 500) {
          toast.error(data.message);
        }
        throw { status: res.status, message: res.message || "" };
      }
    } catch (err) {
      throw err;
    } finally {
      set({ is_auth_request_pending: false });
    }
  },
  reset_password: async (password, token) => {
    if (get().is_auth_request_pending || !password || !token) return;
    try {
      set({ is_auth_request_pending: true });
      let res = await fetch(`${API_ENDPOINTS.AUTH.RESET_PASSWORD}${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.log("Password reset unsuccessful");
        Router.push(ROUTES.SIGNIN);
        return;
      }
      Router.push("/");
      if (res.status === 200) toast.success(data.message);
      console.log("Password reset successful");
    } catch (error) {
      console.error(error);
    } finally {
      set({ is_auth_request_pending: false });
    }
  },
  updateUser: async (userData) => {
    try {
      let res = await fetch(API_ENDPOINTS.AUTH.UPDATE_USER, {
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
    } catch (error) {
      console.error(error);
    }
  },
  verify_email: async (token) => {
    try {
      if (!token) return;
      let res = await fetch(`${API_ENDPOINTS.AUTH.VERIFY_EMAIL}${token}`);
      const data = await res.json();
      if (!res.ok) {
        Router.push(ROUTES.SIGNUP);
        if (res.status == 500) {
          toast.error(data.message);
        }
        throw { status: res.status, message: data.message };
      }
      set({ is_email_verified: true });
    } catch (err) {
      console.log("Error during email verification ", err.message || "");
      throw err;
    }
  },
  verify_otp: async (token) => {
    if (get().is_auth_request_pending || !token) return;
    try {
      set({ is_auth_request_pending: true });
      let res = await fetch(API_ENDPOINTS.AUTH.VERIFY_OTP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.log("OTP verification failed");
        if (res.status === 401 || res.status === 500) {
          toast.error(data.message);
        }
        throw { status: res.status, message: data.message };
      }
      set({ authUser: data.user });
      await Router.push("/");
      console.log("User verification successful");
    } catch (err) {
      console.log("Error during OTP verification ", err.message || "");
      throw err;
    } finally {
      set({ is_auth_request_pending: false });
    }
  },
  verify_reset_token: async (token) => {
    try {
      if (!token) return;
      let res = await fetch(`${API_ENDPOINTS.AUTH.VERIFY_RESET_TOKEN}${token}`);
      if (!res.ok) {
        Router.push(ROUTES.FORGOT_PASSWORD);
        return;
      }
      set({ is_reset_otp_verified: true });
    } catch (err) {
      console.log("Error during password reset", err);
    }
  },
}));
export default authStore;

// *** { Kaam ki baat } ***
// *** { Whenever throw is written, it directly run into catch statement. } ***
// *** { When a function throws an error, it will propagate up to the nearest catch in the call stack. } ***
// *** { If you catch it inside the function and don’t rethrow, the caller never sees it. } ***
