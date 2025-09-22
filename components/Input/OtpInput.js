import React, { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

export default function VerifyOtpInput({ otp, setOtp }) {
  return (
    <InputOTP
      maxLength={6}
      value={otp}
      onChange={setOtp} // *** Logic for this have been already handled by shadCN ***
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}
