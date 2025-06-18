import jwt from "jsonwebtoken";

import { Transport } from "../config/mailer";



export const SendForgotPasswordMail = async (email: string, userId: string):Promise<boolean> => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
        expiresIn: "5min",
        algorithm: "HS512",
    });

  const mailOptions = {
    from: process.env.MAILER_EMAIL,
    to: email,
    subject: "Forgot Password",
    html: `<p>Click the link below to reset your password:</p>
    <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}">Reset Password</a>
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
        console.log("Error in Sending Reset Password Mail:", error);
        return false;
    }
    return false;
  }
}