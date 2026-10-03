import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import authStore from "../../store/authStore";
import PasswordInput from "../../components/Input/PasswordInput";
import Loader1 from "../../components/Loader/Loader1";
import Link from "next/link";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const {
    verify_reset_token,
    is_auth_request_pending,
    is_reset_otp_verified,
    reset_password,
  } = authStore();

  useEffect(() => {
    if (!router.isReady || !token) {
      return;
    }
    verify_reset_token(token);
  }, [router.isReady, token]);

  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== rePassword) {
      setRePassword("");
      return;
    }
    setLoading(true);
    try {
      await reset_password(password, token); // *** Global zustand state ***
    } catch (err) {
      
    } finally {
      setLoading(false);
    }
  };

  return !is_reset_otp_verified ? (
    <>
      <h1>Token is not verified yet</h1>
    </>
) : (
    <div className="flex min-h-screen flex-col px-6 py-12 lg:px-8 bg-[#121212] text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-3xl sm:text-4xl/9 tracking-tight font-inria font-bold text-white">
          Reset Password
        </h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div>
              <label
                htmlFor="new-password"
                className="text-gray-500 font-geist font-bold text-[10px] md:text-[11px] uppercase tracking-wider block mb-1"
              >
                NEW PASSWORD
              </label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                spellCheck={false}
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="text-gray-500 font-geist font-bold text-[10px] md:text-[11px] uppercase tracking-wider block mb-1"
              >
                CONFIRM PASSWORD
              </label>
              <PasswordInput
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                placeholder="Re-enter new password"
                spellCheck={false}
                required
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={is_auth_request_pending || loading}
              className="w-full mt-2 bg-transparent text-white font-bold py-3 px-4 rounded-xl border-2 border-b-4 border-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.2)] hover:shadow-[0_0_25px_rgba(204,255,0,0.4)] hover:bg-[#CCFF00]/10 active:scale-[0.98] active:border-b-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
            >
              {loading ? <Loader1 /> : "Reset Password"}
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
}
