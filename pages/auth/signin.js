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
    <>
      <div className="flex min-h-screen flex-col  px-6 py-12 lg:px-8 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-4xl/9  tracking-tight font-inria">
            Login your account
          </h2>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-4" onSubmit={handleSubmit}>
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
                  value={userData.email || ""}
                  onChange={handleDataChange}
                  required
                  autoComplete="email"
                  placeholder=""
                  className="inputStyle"
                  spellCheck={false}
                />
              </div>
            </div>

            <div>
              <div
                className="text-right flex justify-between
"
              >
                <label
                  htmlFor="password"
                  className="block text-2sm/6 font-medium  font-bold"
                >
                  Password
                </label>

                <div className="text-2sm">
                  <Link
                    href="/auth/forgot-password"
                    className="font-semibold text-[#6A89A7] hover:text-indigo-500"
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

            <div>
              <button
                type="submit"
                className="authSubmitBtn"
                disabled={is_auth_request_pending}
              >
                {loading ? <Loader1 /> : "Sign In"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Don't have an account?
            <Link
              href="/auth/signup"
              className=" text-lg font-semibold text-[#6A89A7] hover:text-indigo-500 mx-1 underline"
            >
              Sign Up
            </Link>
            here
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
