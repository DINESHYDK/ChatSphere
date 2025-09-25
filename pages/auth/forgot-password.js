import React from "react";
import { useState } from "react";
import authStore from "../../store/authStore";
import Loader1 from "../../components/Loader/Loader1";

const ForgotPassword = () => {
  const { is_auth_request_pending, forgot_password } = authStore();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await forgot_password(email);
    } catch (err) {
      if (err.status === 401) {
        setEmail("");
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-3xl/9  tracking-tight text-gray-900 font-inria">
          Forgot Password
        </h2>
      </div>

      <div className="mt-2  sm:mx-auto sm:w-full sm:max-w-sm">
        <p className=" text-center text-sm/6 text-gray-500">
          Enter your Email address and we'll send you a link to reset password.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <div className="mt-8">
              <label
                htmlFor="email"
                className="block text-2sm/6 font-medium  font-bold"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="inputStyle"
                spellCheck={false}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="authSubmitBtn"
              // disabled={is_auth_request_pending}
            >
              {loading ? <Loader1 /> : "Send Reset Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
