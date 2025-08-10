import React from "react";
import { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";

const Signup = () => {
  const [userData, setUserData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  function handleDataChange(e) {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { email, password } = userData;
    if (userName == "" || email === "" || password === "") {
      return;
    }
    console.log(userData);
  }
  return (
    <div className="flex min-h-screen flex-col  px-6 py-12 lg:px-8 bg-black">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-4xl/9  tracking-tight text-white">
          Register your account
        </h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-2sm/6 font-medium text-white font-bold"
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
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-2sm/6 font-medium text-white font-bold"
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
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-2sm/6 font-medium text-white"
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
            <button type="submit" className="authSubmitBtn">
              Sign In
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Already have an account?
          <a
            href="/auth/signin"
            className=" text-lg font-semibold text-indigo-600 hover:text-indigo-500 mx-1 underline"
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
