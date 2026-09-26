import React from "react";
import { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import GenderInput from "../../components/Input/GenderInput";
import Loader1 from "../../components/Loader/Loader1";
import Link from "next/link";
import authStore from "../../store/authStore";

const Signup = () => {
  const { SignUp, is_auth_request_pending } = authStore();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [userData, setUserData] = useState({
    userName: "",
    email: "",
    password: "",
    gender: "M",
  });

  function handleDataChange(e) {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    if (errorMsg) setErrorMsg("");
  }
  
  function onGenderChange(g) {
    setUserData({ ...userData, gender: g });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { userName, email, password, gender } = userData;
    setErrorMsg("");
    
    if (userName === "" || email === "" || password === "") {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    
    try {
      setLoading(true);
      await SignUp(userData);
    } catch (err) {
      setErrorMsg(err.message || "An error occurred during sign up.");
      if (err.status === 409)
        setUserData({ userName: "", email: "", password: "", gender: "M" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950 px-6 py-12 lg:px-8">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 sm:p-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-inria">
            Welcome to{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              SiteName
            </span>
          </h2>
          <p className="mt-2 text-center text-md text-gray-600 dark:text-gray-400 font-inria">
            Create your account
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          {errorMsg && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-500/10 p-3 sm:p-4 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">
              {errorMsg}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1.5"
              >
                Name
              </label>
              <input
                id="userName"
                type="text"
                name="userName"
                value={userData.userName}
                onChange={handleDataChange}
                required
                autoComplete="name"
                className="inputStyle"
                spellCheck={false}
              />
            </div>

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
                value={userData.email}
                onChange={handleDataChange}
                required
                autoComplete="email"
                className="inputStyle"
                spellCheck={false}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1.5"
              >
                Password
              </label>
              <PasswordInput
                value={userData.password}
                onChange={handleDataChange}
                placeholder=""
              />
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                Password must be at least 7 characters long
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1.5">
                Select gender
              </label>
              <GenderInput value={userData.gender} onChange={onGenderChange} />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="authSubmitBtn"
                disabled={is_auth_request_pending || loading}
              >
                {loading ? <Loader1 /> : "Sign Up"}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
