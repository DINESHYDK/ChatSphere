import { Resend } from "resend";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates";
import { FORGOT_PASSWORD_TEMPLATE } from "./emailTemplates";
import generateToken from "../utils/generateOTP";
import devLog from "../utils/logger";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerifyUserEmail = async (mailId, token) => {
  const { data, error } = await resend.emails.send({
    from: "Your App <onboarding@resend.dev>",
    to: mailId,
    subject: "Verify your email",
  html: VERIFICATION_EMAIL_TEMPLATE(token),
  });

  if (error) {
    devLog("Unable to send verification email", error);
  }
};
export const sendResetPassEmail = async (mailId, token) => {
  const { data, error } = await resend.emails.send({
    from: "Your App <onboarding@resend.dev>",
    to: mailId,
    subject: "Reset your password",
    html: FORGOT_PASSWORD_TEMPLATE(token),
  });

  if (error) {
    devLog("Unable to send verification email", error);
  }
};
