import React, { useRef, useState, useEffect } from "react";
import authStore from "../../store/authStore";
import VerifyOtpInput from "../../components/Input/OtpInput";
import Loader1 from "../../components/Loader/Loader1";
import { useRouter } from "next/router";
import { ROUTES } from "../../store/authStore";

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
  const {
    verify_email,
    is_email_verified,
    is_auth_request_pending,
    verify_otp,
  } = authStore();

  useEffect(() => {
    if (!router.isReady || !token) return;
    verify_email(token); // *** Global state ***
  }, [router.isReady, token]);

  const [otp, setOtp] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (is_auth_request_pending || !otp) return;
    try {
      setLoading(true);
      await verify_otp(otp);
    } catch (err) {
      if (err.status === 401 || err.status === 500) {
        setOtp("");
      }
    } finally {
      setLoading(false);
    }
  }
  const [loading, setLoading] = useState(false);
  return !is_email_verified ? (
    <>
      <h1>Loading</h1>
    </>
  ) : (
    <>
      <div className="flex min-h-screen flex-col  px-6 py-12 lg:px-8 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-2 text-center text-3xl  tracking-tight font-inria">
            Verify your Email
          </h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6 w-full max-w-sm mx-auto"
            onSubmit={handleSubmit}
          >
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                An OTP has been sent to your email. It will expire in{" "}
                <span className="font-medium text-foreground">15 minutes</span>.
              </p>
            </div>

            {/* OTP Input */}
            <div className="flex justify-center">
              <VerifyOtpInput otp={otp} setOtp={setOtp} />
            </div>
            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={is_auth_request_pending}
                className="authSubmitBtn w-full"
              >
                {loading ? <Loader1 /> : "Submit"}
              </button>
            </div>

            {/* Extra: Resend OTP link */}
            <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={async()=>await verify_email(token, true)}
                >
                  Didn’t get the code? Resend OTP
                </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
