import React, { useState } from "react";
import { LuEyeClosed } from "react-icons/lu";
import { IoMdEye } from "react-icons/io";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isTypePassword, setIsTypePassword] = useState(true);
  function handleEyeClick() {
    setIsTypePassword(!isTypePassword);
  }
  return (
    <div className="mt-1 relative">
      <input
        type={`${isTypePassword ? "password" : "text"}`}
        name="password"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={true}
        autoComplete="current-password"
        className="inputStyle"
        spellCheck="false"
        minLength={7}
      />
      {!isTypePassword && (
        <IoMdEye
          className="absolute right-4 top-2.5 text-2xl cursor-pointer "
          onClick={handleEyeClick}
        />
      )}
      {isTypePassword && (
        <LuEyeClosed
          className="absolute right-4 top-2.5 text-2xl cursor-pointer "
          onClick={handleEyeClick}
        />
      )}
    </div>
  );
};

export default PasswordInput;
