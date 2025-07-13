import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import z from "zod";


// Configs
import { INTERNAL_SERVER_ERROR } from "../config/commonErrors";

// Models
import User from "../models/user.model";
import Blocked from "../models/blocked.model";


// Utils
import { HashPassword } from "../utils/HashPassword";
import { SendForgotPasswordMail } from "../utils/SendForgotPasswordMail";
import Post from "../models/post.model";

export const GetUser = async (req: Request, res: Response):Promise<void> => {
  try {
    const {user} = req.query;

    if(!user){
      res.status(400).json({
        ok: false,
        msg: 'User query required.'
      })
      return;
    }

    const isUser = await User.findOne({username: user})
    const isBlocked = await Blocked.exists({blocked_by: req.signedInUser?.id, blocked: isUser?.id})
    if(!isUser || isBlocked){
      res.status(404).json({
        ok: false,
        msg: 'User not found.'
      })
      return;
    }

    const numberOfPosts = await Post.countDocuments({users: user})

    res.json({
      ok: true,
      msg: "User Fetched Successfully.",
      user: {...isUser, posts: numberOfPosts}, 
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "GetUser");
  }
};


export const ForgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email_or_username } = req.query;

    if (!email_or_username) {
      res.status(400).json({
        ok: false,
        msg: "Email or Username is required.",
      });
      return;
    }

    const user = await User.findOne({
      $or: [{ email: email_or_username }, { username: email_or_username }],
    });
    if (!user) {
      res.status(400).json({
        ok: false,
        msg: "User Not Found.",
      });
      return;
    }

    const isSent = await SendForgotPasswordMail(user.email, user.id);
    if (!isSent) {
      res.status(500).json({
        ok: false,
        msg: "Unable to sent reset password link. Try again later.",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Email sent successfully.",
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "FrogotPassword");
  }
};

export const ResetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.query;
    const { password, confirm_password } = req.body;

    if (!token || typeof token !== "string") {
      res.status(400).json({
        ok: false,
        msg: "Token not provided.",
      });
      return;
    }

    const decodedToken = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    ) as { userId: string };

    if (!decodedToken) {
      res.status(400).json({
        ok: false,
        msg: "Invalid token provided.",
      });
      return;
    }

    const passwordSchema = z.object({
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          {
            message:
              "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
          }
        ),
    });

    const validation = passwordSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        ok: false,
        msg: validation.error.errors[0].message,
      });
      return;
    }

    if (password !== confirm_password) {
      res.status(400).json({
        ok: false,
        msg: "Password should be same as Confirm Password.",
      });
      return;
    }

    const isUpdated = await User.findByIdAndUpdate(decodedToken.userId, {
      $set: {
        password: await HashPassword(password),
      },
    });

    if (!isUpdated) {
      res.status(500).json({
        ok: false,
        msg: "Unable to reset password right now. Try again later.",
      });
      return;
    }

    res.status(200).json({
      ok: true,
      msg: "Password rest successfully.",
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "ResetPassword");
  }
};