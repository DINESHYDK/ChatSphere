import { useState } from "react";
import { useRouter } from "next/router";
import authStore from "../../store/authStore";
import PasswordInput from '../../components/Input/PasswordInput'
export default function ResetPassword() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const { resetPassword } = authStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== rePassword) {
      setRePassword("");
      return;
    }
    resetPassword(password);
  };

  return (
    <div className="flex min-h-screen flex-col px-6 py-12 lg:px-8 bg-black">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-4xl/9  tracking-tight text-white">
          Reset Password
        </h2>
      </div>

      <div className="mt-2  sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <PasswordInput
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="Enter new password"
            />
            <PasswordInput
            value={rePassword}
            onChange={(e)=>setRePassword(e.target.value)}
            placeholder="Re-enter new password"
            />
          </div>

          <div>
            <button
              type="submit"
              className="authSubmitBtn"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
