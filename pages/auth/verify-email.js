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

  const hasVerifed = useRef(false); //to prevent calling verify_email twice.
  useEffect(() => {
    if (!router.isReady || !token || hasVerifed.current) return;
    verify_email(token); // *** Global state ***
    hasVerifed.current = true;
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
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-[#121212] text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight font-inria text-white">
          Verify your Email
        </h2>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6 w-full max-w-sm mx-auto"
          onSubmit={handleSubmit}
        >
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-400 font-geist">
              An OTP has been sent to your email. It will expire in{" "}
              <span className="font-semibold text-[#CCFF00]">15 minutes</span>.
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
              disabled={is_auth_request_pending || loading}
              className="w-full bg-transparent text-white font-bold py-3 px-4 rounded-xl border-2 border-b-4 border-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.2)] hover:shadow-[0_0_25px_rgba(204,255,0,0.4)] hover:bg-[#CCFF00]/10 active:scale-[0.98] active:border-b-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
            >
              {loading ? <Loader1 /> : "Submit"}
            </button>
          </div>

          {/* Extra: Resend OTP link */}
          <div className="text-center">
            <button
              type="button"
              className="text-xs font-semibold text-gray-400 hover:text-gray-200 active:text-white focus:text-white transition-all cursor-pointer outline-none"
              onClick={async () => await verify_email(token, true)}
            >
              Didn’t get the code? <span className="text-[#CCFF00] hover:underline">Resend OTP</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// *** Kaam ki baat ***
// *** Difference between useRef and useState ***
// *** useState: when a state changes it causes rerendering of page. ***
// *** If i wanted a state which i don't have to show on page(while updating) then useRef is best ***

// *** Que. Then i can use UseRef instead of useState everywhere? ***
// *** Ans. No, const countRef = useRef(0);
/* <button onClick={() => countRef.current++}>Increment</button> */
/* <p>Count: {countRef.current}</p> *** */
// *** Above will not change as useRef doesn't render page. ***
