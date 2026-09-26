import React from "react";
import { useState } from "react";
import authStore from "../../store/authStore";
import PasswordInput from "../../components/Input/PasswordInput";
import Loader1 from "../../components/Loader/Loader1";
import Link from "next/link";
import devLog from "../../utils/logger";

const SignIn = () => {
  const { SignIn, is_auth_request_pending } = authStore();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  function handleDataChange(e) {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    if (errorMsg) setErrorMsg("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { email, password } = userData;
    setErrorMsg("");
    try {
      if (email === "" || password === "") {
        setErrorMsg("Please enter both email and password.");
        return;
      }
      setLoading(true);
      await SignIn(userData);
    } catch (err) {
      devLog(err.message);
      setErrorMsg(err.message || "Invalid credentials. Please try again.");
      if (err.status === 403) {
        setUserData((prev) => ({ email: "", password: "" }));
      } else if (err.status == 401) {
        setUserData((prev) => ({ ...prev, password: "" }));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950 px-6 py-12 lg:px-8">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 sm:p-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-inria">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          {errorMsg && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-500/10 p-3 sm:p-4 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">
              {errorMsg}
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={userData.email || ""}
                onChange={handleDataChange}
                required
                autoComplete="email"
                className="inputStyle"
                spellCheck={false}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-900 dark:text-gray-200"
                >
                  Password
                </label>
                <div className="text-sm">
                  <Link
                    href="/auth/forgot-password"
                    className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <PasswordInput
                value={userData.password || ""}
                onChange={handleDataChange}
                placeholder=""
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="authSubmitBtn"
                disabled={is_auth_request_pending || loading}
              >
                {loading ? <Loader1 /> : "Sign In"}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              Sign Up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
