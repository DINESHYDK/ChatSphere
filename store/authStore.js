import { create } from "zustand";
import Router from "next/router";
import { toast, ToastContainer } from "react-toastify";

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
      const res = await fetch("/api/auth/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userData }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          toast.error("Email already in use");
        } else if (res.status === 500) {
          toast.error("Something went wrong");
        }
        throw { status: res.status, message: data.message || "Unknown error" };
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
      const data = await res.json();
      if (!res.ok) {
        console.log("Invalid credentials");
        if (res.status === 403) {
          toast.error("Please verify your email first");
        } else if (res.status === 401) {
          toast.error("Invalid Credentials");
        } else if (res.status === 500) {
          toast.error("Something went wrong");
        }
        throw { status: res.status, message: data.message || "Unknown error" };
      }
      console.log("Sign in successful");
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
        console.log("reset not successful");
        Router.push("/auth/signin");
        return;
      }
      Router.push("/");
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
  verify_email: async (token) => {
    try {
      if (!token) return;
      let res = await fetch(`/api/auth/verify-email?token=${token}`);
      const data = await res.json();
      if (!res.ok) {
        Router.push(`/auth/signup`);
        if (res.status == 500) {
          toast.error(data.message);
        }
        throw error({ status: res.status, message: data.message });
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
      const data = await res.json();
      if (!res.ok) {
        console.log("OTP verification failed");
        if (res.status === 401 || res.status === 500) {
          toast.error(data.message);
        }else if (res.status === 200) {
          toast.success(data.message);
        }
        throw (
          { status: res.status, messsage: data.message || "" } ||
          "Something went wrong"
        );
      }
      set({ authUser: data.user });
      Router.push("/");
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
