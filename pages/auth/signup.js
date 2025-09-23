import React from "react";
import { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import GenderInput from "../../components/Input/GenderInput";
import Loader1 from "../../components/Loader/Loader1";
import authStore from "../../store/authStore";

const Signup = () => {
  const { SignUp, is_auth_request_pending } = authStore(); // *** Zustand global state ***
  const [loading, setLoading] = useState(false); // *** local state ***

  const [userData, setUserData] = useState({
    userName: "",
    email: "",
    password: "",
    gender: "male",
  });
  function handleDataChange(e) {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  }
  function onGenderChange(g) {
    setUserData({ ...userData, gender: g });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { userName, email, password, gender } = userData;
    if (userName == "" || email === "" || password === "") {
      return;
    }
    try {
      setLoading(true);
      await SignUp(userData);
    } catch (err) {
      if (err.status === 409)
        setUserData({ userName: "", email: "", password: "", gender: "male" });
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex min-h-screen flex-col  px-6 py-12 lg:px-8 ">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl  sm:text-3xl/9  tracking-tight font-inria ">
          Welcome to
          <span
            href="/auth/signin"
            className=" text-4xl font-semibold text-[#6A89A7]  mx-1 "
          >
            SiteName
          </span>
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-2 text-center text-2xl  tracking-tight font-inria">
          Register account
        </h2>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-2" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-2sm/6 font-medium  font-bold"
            >
              Name
            </label>
            <div className="mt-1">
              <input
                id="userName"
                type="userName"
                name="userName"
                value={userData.userName}
                onChange={handleDataChange}
                required
                autoComplete="userName"
                className="inputStyle"
                spellCheck={false}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-2sm/6 font-medium  font-bold"
            >
              Email address
            </label>
            <div className="mt-1">
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
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-2sm/6 font-medium "
              >
                Password
              </label>
            </div>
            <PasswordInput
              value={userData.password}
              onChange={handleDataChange}
              placeholder=""
            />
            <p className="mt-1 text-sm/6 text-gray-500">
              Password must be atleast 7 characters long
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="password"
                className="block text-2sm/6 font-medium "
              >
                Select gender
              </label>
            </div>
            <div className="flex items-center justify-between">
              <GenderInput value={userData.gender} onChange={onGenderChange} />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="authSubmitBtn"
              disabled={is_auth_request_pending}
            >
              {loading ? <Loader1 /> : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="mt-3 text-center text-sm/6 text-gray-500">
          Already have an account?
          <a
            href="/auth/signin"
            className=" text-lg font-semibold text-[#6A89A7] hover:text-indigo-500 mx-1 underline"
          >
            Sign In
          </a>
          here
        </p>
      </div>
    </div>
  );
};

export default Signup;
