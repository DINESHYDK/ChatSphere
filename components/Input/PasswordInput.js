import React, { useState } from "react";
import { LuEyeClosed } from "react-icons/lu";
import { IoMdEye } from "react-icons/io";

const PasswordInput = ({ value, onChange, placeholder = "" }) => {
  const [isTypePassword, setIsTypePassword] = useState(true);

  function handleEyeClick() {
    setIsTypePassword(!isTypePassword);
  }

  return (
    <div className="mt-1 relative flex items-center">
      <input
        type={isTypePassword ? "password" : "text"}
        name="password"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={true}
        autoComplete="current-password"
        spellCheck="false"
        minLength={7}
        className="w-full bg-[#1A1A1A] border border-[#333] text-gray-200 placeholder-gray-500 rounded-sm p-2 pr-12 text-sm "
      />
      <button
        type="button"
        onClick={handleEyeClick}
        className="absolute right-3.5 text-gray-400 hover:text-[#CCFF00] focus:outline-none transition-colors cursor-pointer p-1"
        tabIndex={-1}
      >
        {isTypePassword ? (
          <LuEyeClosed className="text-xl" />
        ) : (
          <IoMdEye className="text-xl" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;