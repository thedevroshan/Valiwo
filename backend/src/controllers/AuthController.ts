import express, { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";

// config
import { INTERNAL_SERVER_ERROR } from "../config/commonErrors";

// Models
import User from "../models/user.model";

// Utils
import { SendEmailVerificationMail } from "../utils/SendEmailVerificationMail";
import { GenerateJWTToken } from "../utils/GenerateJWTToken";

export const SignUp = async (req: Request, res: Response) => {
  try {
    const { username, email, fullname, password, profile_pic } = req.body;
    const { auth } = req.query;

    const existingUsername = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUsername) {
      res.status(400).json({
        ok: false,
        msg: "Username not available.",
      });
      return;
    }

    if (existingEmail) {
      res.status(400).json({
        ok: false,
        msg: "Email already registered.",
      });
      return;
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      fullname,
      password: hashedPassword,
      is_verified: auth != undefined || auth == "google" ? true : false,
      profile_pic: auth != undefined || auth == "google" ? profile_pic : "",
    });

    if (!newUser) {
      res.status(400).json({
        ok: false,
        msg: "Failed to create user.",
      });
      return;
    }

    if (auth != "google" || auth == undefined) {
      // Send verification email
      const isSent = await SendEmailVerificationMail(
        newUser.email,
        newUser.id.toString(),
        'email' // for verification of default email
      );

      if (!isSent) {
        res.status(500).json({
          ok: false,
          msg: "Failed to send verification email. Please try again later.",
        });
        return;
      }

      res.status(201).json({
        ok: true,
        msg: "User created successfully. We have sent you a verification email to verify your account.",
      });
      return;
    }

    const token = await GenerateJWTToken(newUser.id);

    if (!token) {
      res.status(500).json({
        ok: false,
        msg: "Internal Server Error. Please try again later.",
      });
      return;
    }

    res
      .cookie("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict", // Prevent CSRF attacks
        maxAge: 28 * 24 * 60 * 60 * 1000, // 28 days
      })
      .status(200)
      .json({
        ok: true,
        msg: "Account Created Successfully.",
      });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "SignUp");
  }
};

export const VerifyEmail = async (req: Request, res: Response) => {
  try {
    const { token, email_type } = req.query;

    if (!token || typeof token !== "string" || !email_type || typeof email_type !== 'string') {
      res.status(400).json({
        ok: false,
        msg: "Invalid or missing token.",
      });
      return;
    }
    
    if(email_type !== 'email' && email_type !== 'recovery_email'){
      res.status(400).json({
        ok: false,
        msg: "Invalid email type."
      })
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(404).json({
        ok: false,
        msg: "User not found.",
      });
      return;
    }

    email_type=='email'?user.is_verified = true:user.is_recovery_email_verified = true;
    await user.save();

    res.status(200).json({
      ok: true,
      msg: "Email verified successfully.",
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "VerifyEmail");
  }
};

export const SignIn = async (req: Request, res: Response) => {
  try {
    const { email_or_username, password } = req.query;

    if (
      !email_or_username ||
      !password ||
      typeof email_or_username !== "string" ||
      typeof password !== "string"
    ) {
      res.status(400).json({
        ok: false,
        msg: "Email and password are required.",
      });
      return;
    }

    const user = await User.findOne({
      $or: [{ email: email_or_username }, { username: email_or_username }],
    });
    if (!user) {
      res.status(400).json({
        ok: false,
        msg: "User not found.",
      });
      return;
    }
    if (!user.is_verified) {
      const isSent: boolean = await SendEmailVerificationMail(
        user.email,
        user.id.toString(),
        'email' // for verification of default email
      );
      if (!isSent) {
        res.status(500).json({
          ok: false,
          msg: "Failed to send verification email. Please try again later.",
        });
        return;
      }
      res.status(400).json({
        ok: false,
        msg: "Please verify your email before signing in. We have sent you a verification email.",
      });
      return;
    }
    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(400).json({
        ok: false,
        msg: "Incorrect Password.",
      });
      return;
    }

    const token = await GenerateJWTToken(user.id);
    if (token == null) {
      res.status(500).json({
        ok: false,
        msg: "Internal Server Error.",
      });
      return;
    }

    res
      .cookie("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict", // Prevent CSRF attacks
        maxAge: 28 * 24 * 60 * 60 * 1000, // 28 days
      })
      .status(200)
      .json({
        ok: true,
        msg: "Sign in successful.",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullname: user.fullname,
        },
      });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "SignIn");
  }
};

export const SignOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie("session");
    res.status(200).json({
      ok: true,
      msg: "Sign out successful.",
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "SignOut");
  }
};

export const GoogleSignIn = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { fullname, email, profile_pic } = req.user as {
      fullname: string;
      email: string;
      profile_pic: string;
    };

    if (
      fullname == undefined ||
      email == undefined ||
      profile_pic == undefined
    ) {
      res.status(400).json({
        ok: false,
        msg: "DisplayName or Email or ProfilePic is undefined.",
      });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.redirect(
        `${process.env.FRONTEND_URL}/auth/signup?auth=google&fullname=${fullname}&email=${email}&profile_pic=${profile_pic}`
      );
      return;
    }

    if (!user.is_verified) {
      user.is_verified = true;
      await user.save();
    }

    const token = await GenerateJWTToken(user.id);
    if (token == null) {
      res.status(500).json({
        ok: false,
        msg: "Internal Server Error.",
      });
      return;
    }

    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "GoogleSignIn");
  }
};
