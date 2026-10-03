import React from "react";
import { useState } from "react";
import authStore from "../../store/authStore";
import LoaderWithTick from "@/components/Loader/Loader2";
import Link from "next/link";

const ForgotPassword = () => {
  const { is_auth_request_pending, forgot_password } = authStore();

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await forgot_password(email);
      setIsSuccess(true);
    } catch (err) {
      if (err.status === 401) {
        setEmail("");
      }
    } finally {
      setLoading(false);
    }
  }
return (
  <div className="flex min-h-screen flex-col px-6 py-12 lg:px-8 bg-[#121212] text-white">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 className="mt-10 text-center text-3xl/9 tracking-tight text-white font-inria font-bold">
        Forgot Password
      </h2>
    </div>

    <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
      <p className="text-center text-sm/6 text-gray-400 font-geist">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <div className="mt-8">
            <label
              htmlFor="email"
              className="text-gray-500 font-geist font-bold text-[10px] md:text-[11px] uppercase tracking-wider"
            >
              EMAIL ADDRESS
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-[#1A1A1A] border border-[#333] text-gray-200 rounded-lg p-2 "
              spellCheck={false}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading || isSuccess}
            className={`w-full mt-2 bg-transparent text-white font-bold py-3 px-4 rounded-xl border-2 border-b-4 border-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.2)] transition-all duration-200 flex items-center justify-center ${
              isSuccess
                ? "border-[#CCFF00] bg-[#CCFF00]/10 pointer-events-none cursor-not-allowed"
                : "hover:shadow-[0_0_25px_rgba(204,255,0,0.4)] hover:bg-[#CCFF00]/10 active:scale-[0.98] cursor-pointer"
            }`}
          >
            {loading || isSuccess ? (
              <LoaderWithTick
                isSuccess={isSuccess}
                onComplete={() => {
                }}
              />
            ) : (
              "Send Reset Link"
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/auth/signin"
          className="text-xs font-semibold text-gray-400 hover:text-gray-200 active:text-white focus:text-white transition-all cursor-pointer outline-none"
        >
          ← Back to Sign In
        </Link>
      </div>
    </div>
  </div>
);
};

export default ForgotPassword;
