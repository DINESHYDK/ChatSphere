import React from "react";
import { useState } from "react";
import authStore from "../../store/authStore";
import PasswordInput from '../../components/Input/PasswordInput'


const Signup = () => {
  const { SignIn } = authStore();
  
  const [userData, setUserData] = useState({
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
    if (email === "" || password === "") {
      return;
    }
    SignIn(userData); // *** calling SignIn (zustand state) ***
  }


  return (
    <div className="flex min-h-screen flex-col  px-6 py-12 lg:px-8 ">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-4xl/9  tracking-tight text-white">
          Login your account
        </h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <div className="mt-1">
              <input
                id="email"
                type="email"
                name="email"
                value={userData.email}
                onChange={handleDataChange}
                required
                autoComplete="email"
                placeholder="Email address."
                className="inputStyle"
              />
            </div>
          </div>

          <div>
            <div className="text-right">
              <div className="text-sm">
                <a
                  href="/auth/forgot-password"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <PasswordInput
             value={userData.password}
             onChange={handleDataChange}
             placeholder="Password."
            />
          </div>

          <div>
            <button
              type="submit"
              className="authSubmitBtn"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Don't have an account?
          <a
            href="/auth/signup"
            className=" text-lg font-semibold text-indigo-600 hover:text-indigo-500 mx-1 underline"
          >
            Sign Up
          </a>
          here
        </p>
      </div>
    </div>
  );
};

export default Signup;
