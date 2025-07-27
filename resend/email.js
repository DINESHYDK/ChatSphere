import { Resend } from "resend";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates";
import { FORGOT_PASSWORD_TEMPLATE } from "./emailTemplates";
import generateToken from "../utils/generateToken";

const resend = new Resend(process.env.RESEND_API_KEY);


export const sendVerifyUserEmail = async (mailId) => {
 let verifyToken = generateToken();
 const { data, error } = await resend.emails.send({
    from: '',
    to: mailId,
    subject: 'Verify your email',
    html: VERIFICATION_EMAIL_TEMPLATE
  });

  if (err) {
    console.log('Unable to send verification email', err);
   }
}
export const sendResetPassEmail = async (mailId) => {
  let verifyToken = generateToken();
  const { data, error } = await resend.emails.send({
    from: '',
    to: mailId,
    subject: 'Rest password',
    html: FORGOT_PASSWORD_TEMPLATE,  
  });

  if (err) {
    console.log('Unable to send verification email', err);
   }
}