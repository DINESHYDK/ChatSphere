// import React, { useState } from "react";
// import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

// export default function VerifyOtpInput({ otp, setOtp }) {
//   return (
//     <InputOTP
//       maxLength={6}
//       value={otp}
//       onChange={setOtp} // *** Logic for this have been already handled by shadCN ***
//     >
//       <InputOTPGroup>
//         <InputOTPSlot index={0} />
//         <InputOTPSlot index={1} />
//         <InputOTPSlot index={2} />
//         <InputOTPSlot index={3} />
//         <InputOTPSlot index={4} />
//         <InputOTPSlot index={5} />
//       </InputOTPGroup>
//     </InputOTP>
//   );
// }

import React from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

export default function VerifyOtpInput({ otp, setOtp }) {
  return (
    <div className="relative">
      {/* Hidden native input for browser required validation */}
      <input
        type="text"
        value={otp || ""}
        onChange={(e) => setOtp(e.target.value)}
        required
        minLength={6}
        maxLength={6}
        className="absolute inset-0 opacity-0 pointer-events-none w-full h-full"
        tabIndex={-1}
        aria-hidden="true"
      />

      <InputOTP
        maxLength={6}
        value={otp}
        onChange={setOtp}
      >
        <InputOTPGroup className="gap-2">
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}