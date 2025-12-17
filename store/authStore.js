import { create } from "zustand";
import Router from "next/router";
import { toast } from "react-toastify";
import devLog from "../utils/logger";
import { ROUTES } from "../constants/page-routes";
import { API_ENDPOINTS } from "../constants/api-endpoints";


const authStore = create((set, get) => ({
  is_auth_request_pending: false, //for auth related request
  is_email_verified: false, // *** so that no outside user can access the OTP  verification ***//
  is_reset_otp_verified: false,
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
        devLog("Invalid credentials");
        if (res.status === 403 || res.status === 401 || res.status === 500) {
          toast.error(data.message);
        }
        throw { status: res.status, message: data.message || "Unknown error" };
      }
      set({ authUser: data.user });
      await Router.push(ROUTES.HOMEPAGE);
      return data;
    } catch (error) {
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
        } else if (res.status === 429) {
          toast.warning(data.message);
        }
        throw { status: res.status, message: res.message || "" }; //this is an err object
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
        devLog("Password reset unsuccessful");
        Router.push(ROUTES.SIGNIN);
        return;
      }
      await Router.push("/");
      if (res.status === 200) toast.success(data.message);
    } catch (error) {
      console.error(error);
    } finally {
      set({ is_auth_request_pending: false });
    }
  },
  // updateUser: async (userData) => {
  //   try {
  //     let res = await fetch(API_ENDPOINTS.AUTH.UPDATE_USER, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ userData }),
  //     });
  //     if (!res.ok) {
  //       return;
  //     }
  //     const data = await response.json();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // },
  verify_email: async (token, resend = false) => {
    try {
      if (!token) return;
      const url = new URL(
        API_ENDPOINTS.AUTH.VERIFY_EMAIL,
        window.location.origin
      );
      url.searchParams.set("token", token);
      if (resend) url.searchParams.set("resend", "true");
      const res = await fetch(url.toString());
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 404) Router.push(ROUTES.SIGNIN);
        if (res.status == 500) {
          toast.error(data.message);
        } else if (res.status === 429) toast.warning(data.message);
        throw { status: res.status, message: data.message };
      }
      if (res.status === 429 && resend === "true")
        toast.info("Email sent again");
      set({ is_email_verified: true });
    } catch (err) {
      devLog("Error during email verification ", err.message || "");
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
        devLog("OTP verification failed");
        if (res.status === 401 || res.status === 500) {
          toast.error(data.message);
        }
        throw { status: res.status, message: data.message };
      }
      set({ authUser: data.user });
      await Router.push("/");
    } catch (err) {
      devLog("Error during OTP verification ", err.message || "");
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
      devLog("Error during password reset", err);
    }
  },
}));
export default authStore;
