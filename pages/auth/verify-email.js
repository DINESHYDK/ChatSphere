import React, { useRef, useState, useEffect } from "react";
import authStore from "../../store/authStore";
import VerifyOtpInput from "../../components/Input/OtpInput";
import { useRouter } from "next/router";

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
  const {
    verifyEmail,
    is_email_verified,
    is_auth_request_pending,
    verify_otp,
  } = authStore();

  useEffect(() => {
    if (!router.isReady && !token) return;
    verifyEmail(token); // *** Global state ***
  }, [router.isReady, token]);

  const [otp, setOtp] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (is_auth_request_pending || !otp) return;
    verify_otp(otp);
  }
  return;
  !is_email_verified ? (
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
          <form className="space-y-6 w-full max-w-sm mx-auto" onSubmit={handleSubmit}>
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
                disabled={is_auth_request_pending || otp.length < 6}
                className="authSubmitBtn w-full"
              >
                Submit
              </button>
            </div>

            {/* Extra: Resend OTP link */}
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
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
