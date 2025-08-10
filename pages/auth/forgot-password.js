import React from "react";
import { useState } from "react";
import authStore from "../../store/authStore";

const ForgotPassword = () => {
  const { forgotPassword } = authStore();

  const [email, setEmail] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    forgotPassword(email);
  }
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9  tracking-tight text-gray-900">
          Forgot Password
        </h2>
      </div>

      <div className="mt-2  sm:mx-auto sm:w-full sm:max-w-sm">
        <p className=" text-center text-sm/6 text-gray-500">
          Enter your Email address and we'll send you a link to reset password.
        </p>

        <form className="space-y-4">
          <div>
            <div className="mt-8">
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="Email Address."
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleSubmit}
            >
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
