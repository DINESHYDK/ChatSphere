import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import authStore from "../../store/authStore";
import PasswordInput from "../../components/Input/PasswordInput";
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
    reset_password(password, token); // *** Global zustand state ***
  }, [router.isReady, token]);

  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== rePassword) {
      setRePassword("");
      return;
    }
    reset_password(password);
  };

  return !is_reset_otp_verified ? (
    <>
      <h1>Token is not verified yet</h1>
    </>
  ) : (
    <>
      <div className="flex min-h-screen flex-col px-6 py-12 lg:px-8 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-4xl/9  tracking-tight font-inria">
            Reset Password
          </h2>
        </div>

        <div className="mt-2  sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
              <PasswordInput
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                placeholder="Re-enter new password"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="authSubmitBtn"
                disabled={
                  is_auth_request_pending ||
                  password.length < 7 ||
                  rePassword.length < 7
                }
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
