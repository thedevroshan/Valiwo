import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import z from "zod";
import bcryptjs from "bcryptjs";


// Configs
import { INTERNAL_SERVER_ERROR } from "../config/commonErrors";

// Models
import User, {EUserGender} from "../models/user.model";
import { Link } from "../models/link.model";

// AppWrite
import { storage } from "../config/appwrite";
import { InputFile } from "node-appwrite/file";
import { SendForgotPasswordMail } from "../utils/SendForgotPasswordMail";

// Utils
import { HashPassword } from "../utils/HashPassword";

export const GetUser = (req: Request, res: Response) => {
  try {
    res.json(req.signedInUser);
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "GetUser");
  }
};

// UpdateProfile
export const UpdateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { updateField, updateValue } = req.query;

    if (
      updateField == undefined ||
      typeof updateField !== "string" ||
      typeof updateValue !== "string" ||
      updateValue == undefined
    ) {
      res.status(400).json({
        ok: false,
        msg: "Invalid Query.",
      });
      return;
    }

    const user = await User.findById(req?.signedInUser?._id);
    if (!user) {
      res.status(400).json({
        ok: false,
        msg: "User Not Found.",
      });
      return;
    }

    if (updateField == "fullname") {
      user.fullname = updateValue.toString();
      await user.save();
      res.status(200).json({
        ok: true,
        msg: "FullName Updated.",
      });
      return;
    } else if (updateField == "username") {
      if (user.username == updateValue) return;

      const existingUsername = await User.findOne({ username: updateValue });
      if (existingUsername) {
        res.status(400).json({
          ok: false,
          msg: "Username not availabel.",
        });
        return;
      }

      user.username = updateValue;
      await user.save();

      res.status(200).json({
        ok: true,
        msg: "Username Changed.",
      });
    } else if (updateField == "bio") {
      user.bio = updateValue;
      await user.save();

      res.status(200).json({
        ok: true,
        msg: "Bio Updated.",
      });
    } else if (updateField == "gender") {
      user.gender =
        updateValue == EUserGender.Male ? EUserGender.Male : EUserGender.Female;
      await user.save();

      res.status(200).json({
        ok: true,
        msg: "Gender Changed.",
      });
    } else if (updateField == "display_gender") {
      user.display_gender = updateValue == "true" ? true : false;
      await user.save();

      res.status(200).json({
        ok: true,
        msg: "Display Gender Updated.",
      });
    } else if (updateField == "is_private") {
      user.is_private = updateValue == "true" ? true : false;
      await user.save();

      res.status(200).json({
        ok: true,
        msg: "Profile Visibility has been changed.",
      });
    }
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "UpdateProfile");
  }
};

export const AddLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, link } = req.body;

    if (
      title == undefined ||
      typeof title != "string" ||
      link == undefined ||
      typeof link != "string"
    ) {
      res.status(400).json({
        ok: false,
        msg: "Title and Link are requried.",
      });
      return;
    }

    const newLink = await Link.create({
      title,
      link,
      user: req?.signedInUser?.id,
    });

    if (!newLink) {
      res.status(500).json({
        ok: false,
        msg: "Unable to add new link. Try again later.",
      });
      return;
    }

    res.status(200).json({
      ok: true,
      msg: "New Link Added.",
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "AddLink");
  }
};

export const RemoveLink = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { link_id } = req.query;

    if (link_id == undefined || typeof link_id !== "string") {
      res.status(400).json({
        ok: false,
        msg: "Link id not provided.",
      });
      return;
    }

    const isDeleted = await Link.findOneAndDelete({
      _id: link_id,
      user: req.signedInUser?.id,
    });

    if (!isDeleted) {
      res.status(500).json({
        ok: false,
        msg: "Unable to delete link. Try again later.",
      });
      return;
    }

    res.status(200).json({
      ok: true,
      msg: "Link deleted successfully.",
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "RemoveLink");
  }
};

export const EditLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const { link_id } = req.query;
    const { title, link } = req.body;

    if (!link_id || !title || !link) {
      res.status(400).json({
        ok: false,
        msg: "Required fields are missing.",
      });
      return;
    }

    const isUpdated = await Link.findByIdAndUpdate(
      link_id,
      {
        $set: {
          title,
          link,
        },
      },
      { new: true }
    );

    if (!isUpdated) {
      res.status(500).json({
        ok: false,
        msg: "Unable to update link. Try again later.",
      });
      return;
    }

    res.status(200).json({
      ok: true,
      msg: "Link updated successfully",
      link: isUpdated,
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "EditLink");
  }
};

export const GetLinks = async (req: Request, res: Response): Promise<void> => {
  try {
    const links = await Link.find({ user: req.signedInUser?.id });
    if (links.length == 0) {
      res.status(200).json({
        ok: true,
        msg: "No Links.",
      });
      return;
    }

    res.status(200).json({
      ok: true,
      msg: "All links fetched successfully.",
      links,
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "GetLinks");
  }
};

export const ChangeProfilePic = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (req.body.length > 2 * 1024 * 1024) {
      res.status(400).json({
        ok: false,
        msg: "Too large file. Upload upto 2MB.",
      });
      return;
    }

    try {
      await storage.deleteFile(
        process.env.PROFILEPIC_BUCKET_ID as string,
        req.signedInUser?.id
      );
    } catch (error) {
      // Simply Pass
    }

    const isUploaded = await storage.createFile(
      process.env.PROFILEPIC_BUCKET_ID as string,
      req.signedInUser?.id,
      InputFile.fromBuffer(req.body, `${req.signedInUser?.id}.jpg`)
    );

    if (!isUploaded) {
      res.status(500).json({
        ok: false,
        msg: "Unable to upload new profile pic. Try again later.",
      });
      return;
    }

    const isUpdated = await User.findByIdAndUpdate(req.signedInUser?.id, {
      $set: {
        profile_pic: `https://fra.cloud.appwrite.io/v1/storage/buckets/${
          process.env.PROFILEPIC_BUCKET_ID as string
        }/files/${req.signedInUser?.id}/view?project=${
          process.env.APPWRITE_PROJECT_ID as string
        }&mode=admin`,
      },
    });

    if (!isUpdated) {
      res.status(500).json({
        ok: false,
        msg: "Unable to change profile pic. Try again later.",
      });
      return;
    }

    res.status(200).json({
      ok: true,
      msg: "Profile Pic Changed Successfully.",
      profile_pic: `https://fra.cloud.appwrite.io/v1/storage/buckets/${
        process.env.PROFILEPIC_BUCKET_ID as string
      }/files/${req.signedInUser?.id}/view?project=${
        process.env.APPWRITE_PROJECT_ID as string
      }&mode=admin`,
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "ChangeProfilePic");
  }
};

export const RemoveProfilePic = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const isDeleted = await storage.deleteFile(
      process.env.PROFILEPIC_BUCKET_ID as string,
      req.signedInUser?.id
    );

    if (!isDeleted) {
      res.status(500).json({
        ok: false,
        msg: "Unable to remove profile pic right now. Try again later.",
      });
      return;
    }

    const isUpdated = await User.findByIdAndUpdate(req.signedInUser?.id, {
      $set: {
        profile_pic: "",
      },
    });

    if (!isUpdated) {
      res.status(500).json({
        ok: false,
        msg: "Unable to remove profile pic right now. Try again later.",
      });
      return;
    }

    res.status(200).json({
      ok: true,
      msg: "Profile Pic removed successfully.",
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "RemoveProfilePic");
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

export const ChangePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { password, confirm_password, current_password } = req.body;

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

    const user = await User.findById(req?.signedInUser?.id);

    if (!user) {
      res.status(404).json({
        ok: false,
        msg: "User not found.",
      });
      return;
    }

    const isPasswordMatch = await bcryptjs.compare(
      current_password,
      user.password
    );
    if (!isPasswordMatch) {
      res.status(400).json({
        ok: false,
        msg: "Incorrect Current Password.",
      });
      return;
    }

    user.password = (await HashPassword(password)) as string;
    await user.save();

    res.status(200).json({
      ok: true,
      msg: "Password Changed Successfully.",
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "ChangePassword");
  }
};
