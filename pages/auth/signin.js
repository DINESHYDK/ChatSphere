import React from "react";
import { useState } from "react";
import authStore from "../../store/authStore";
import PasswordInput from "../../components/Input/PasswordInput";
import Loader1 from "../../components/Loader/Loader1";
import Link from "next/link";
import devLog from "../../utils/logger";

const Signup = () => {
  const { SignIn, is_auth_request_pending } = authStore();
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  function handleDataChange(e) {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  }

  async function handleSubmit(e) {
    console.log("userDate is ", userData);
    e.preventDefault();
    const { email, password } = userData;
    try {
      if (email === "" || password === "") {
        return;
      }
      setLoading(true);
      await SignIn(userData); // *** calling SignIn (zustand state) ***
    } catch (err) {
      devLog(err.message);
      if (err.status === 403) {
        setUserData((prev) => ({ email: "", password: "" }));
      } else if (err.status == 401) {
        setUserData((prev) => ({ ...prev, password: "" }));
      }
    } finally {
      setLoading(false);
    }
  }
  // *** Async-await will stop the execution the downwards just wait for the SignIn to done
  //   if promise if fulfilled then move to the next line else jump directly to catch block
  // finally will run every time don't depend on whether request will succeed or failed
  //  ***
return (
  <div className="flex min-h-screen flex-col px-6 py-12 lg:px-8 bg-[#121212] text-white">
    <h2 className="text-center text-3xl sm:text-4xl font-extrabold tracking-tight font-inria text-white leading-tight">
    Login to{" "}
    <span className="bg-gradient-to-r from-[#CCFF00] via-[#e6ff66] to-[#99cc00] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(204,255,0,0.35)]">
      your account
    </span>
  </h2>

    <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="text-gray-500 font-geist font-bold text-[10px] md:text-[11px] uppercase tracking-wider"
          >
            EMAIL ADDRESS
          </label>
          <div className="mt-1">
            <input
              id="email"
              type="email"
              name="email"
              value={userData.email || ""}
              onChange={handleDataChange}
              required
              autoComplete="email"
              placeholder=""
              className="w-full bg-[#1A1A1A] border border-[#333] text-gray-200 rounded-lg p-2"
              spellCheck={false}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="password"
              className="text-gray-500 font-geist font-bold text-[10px] md:text-[11px] uppercase tracking-wider"
            >
              PASSWORD
            </label>

            <Link
              href="/auth/forgot-password"
              className="text-xs font-semibold text-gray-400 hover:text-gray-200 active:text-white "
            >
              FORGOT PASSWORD?
            </Link>
          </div>

          <PasswordInput
            value={userData.password || ""}
            onChange={handleDataChange}
            placeholder=""
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={is_auth_request_pending}
            className="w-full mt-2 bg-transparent text-white font-bold py-3 px-4 rounded-lg border-2 border-b-4 border-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.2)] hover:shadow-[0_0_25px_rgba(204,255,0,0.4)] hover:bg-[#CCFF00]/10 active:scale-[0.98] active:border-b-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
          >
            {loading ? <Loader1 /> : "Sign In"}
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-400">
        Don't have an account?
        <Link
          href="/auth/signup"
          className="text-base font-bold text-[#CCFF00] hover:text-[#e6ff66] hover:underline mx-1 transition-colors"
        >
          Sign Up
        </Link>
        here
      </p>
    </div>
  </div>
);
};

export default Signup;
