import jwt from "jsonwebtoken";

import { Transport } from "../config/mailer";



export const SendEmailVerificationMail = async (email: string, userId: string, email_type:string):Promise<boolean> => {
  if(email_type !== 'email' && email_type !== 'recovery_email'){
    return false;
  }

    const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
        expiresIn: "5min",
        algorithm: "HS512",
    });


  const mailOptions = {
    from: process.env.MAILER_EMAIL,
    to: email,
    subject: "Email Verification",
    html: `<p>Click the link below to verify your email:</p>
    <a href="${process.env.BACKEND_URL}/api/v1/auth/verify-email?token=${token}&email_type=${email_type}">Verify Email</a>
    <p>Note: This link will be expired in 5 minutes.</p>
           `,
  };

  try {
    const isSent = await Transport.sendMail(mailOptions);
    if(!isSent){
        return false;
    }
    return true;
  } catch (error) {
    if(process.env.NODE_ENV !== 'production') {
        console.log("Error in Sending Email Verification Mail:", error);
        return false;
    }
    return false;
  }
}