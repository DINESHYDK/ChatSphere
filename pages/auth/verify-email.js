import React, { useRef, useState } from "react";
import { InputOTP } from "../../components/ui/input-otp";
export default function VerifyEmail() {
  const [otp, setOtp] = useState(Array(4).fill("")); // Array with 6 empty strings
  const inputRefs = useRef([]); // Array of refs for each input field

  const handleKeyDown = (e) => {
    if (
      !/^[0-9]{1}$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    if (e.key === "Delete" || e.key === "Backspace") {
      const index = inputRefs.current.indexOf(e.target);
      if (index > 0) {
        setOtp((prevOtp) => [
          ...prevOtp.slice(0, index - 1),
          "",
          ...prevOtp.slice(index),
        ]);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleInput = (e) => {
    const { target } = e;
    const index = inputRefs.current.indexOf(target);
    if (target.value) {
      setOtp((prevOtp) => [
        ...prevOtp.slice(0, index),
        target.value,
        ...prevOtp.slice(index + 1),
      ]);
      if (index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (!new RegExp(`^[0-9]{${otp.length}}$`).test(text)) {
      return;
    }
    const digits = text.split("");
    setOtp(digits);
  };

  return (
    <InputOTP/>
    // <section className="bg-white py-10 dark:bg-dark">
    //   <div className="container">
    //   <div className="sm:mx-auto sm:w-full sm:max-w-sm">
    //     <h2 className="mt-10 text-center text-2xl/9  tracking-tight text-gray-900">
    //       Verify your email
    //     </h2>
    //     <p>Enter a 6-digit code sent to your email address</p>
    //   </div>
    //     <div>
    //       <form id="otp-form" className="flex gap-2">
    //         {otp.map((digit, index) => (
    //           <input
    //             key={index}
    //             type="text"
    //             maxLength={1}
    //             value={digit}
    //             onChange={handleInput}
    //             onKeyDown={handleKeyDown}
    //             onFocus={handleFocus}
    //             onPaste={handlePaste}
    //             ref={(el) => (inputRefs.current[index] = el)}
    //             className="shadow-xs flex w-[64px] items-center justify-center rounded-lg border border-stroke bg-white border-black p-2 text-center text-2xl font-medium  outline-none sm:text-4xl dark:border-dark-3 dark:bg-white/5"
    //           />
    //         ))}
    //         {/* You can conditionally render a submit button here based on otp length */}
    //       </form>
    //     </div>
    //   </div>
    // </section>
  );
}
