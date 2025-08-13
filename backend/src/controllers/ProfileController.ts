import { Request, Response } from "express";

// Models
import User, { EUserGender } from "../models/user.model";
import { Link } from "../models/link.model";

// Config
import { INTERNAL_SERVER_ERROR } from "../config/commonErrors";
import { storage } from "../config/appwrite";

// Appwrite
import { InputFile } from "node-appwrite/file";
import Post from "../models/post.model";

export const GetProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const postsCount = await Post.countDocuments({
      users: req.signedInUser?.id,
    });

    const user = await User.findById(req.signedInUser?.id)
      .select("fullname")
      .select("username")
      .select("profile_pic")
      .select("email")
      .select("bio")
      .select("_id")
      .select("followers")
      .select("following")
      .select("pinned_posts")
      .select("gender")
      .select("birthday");

    res.json({
      ok: true,
      msg: "Profile",
      data: { ...user?.toObject(), posts: postsCount },
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "GetProfile");
  }
};

export const RemoveProfilePic = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    try {
      await storage.deleteFile(
        process.env.PROFILEPIC_BUCKET_ID as string,
        req.signedInUser?.id
      );
    } catch (error) {
      
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

export const ChangeProfilePic = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (req.body.length > 5 * 1024 * 1024) {
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
      data: `https://fra.cloud.appwrite.io/v1/storage/buckets/${
        process.env.PROFILEPIC_BUCKET_ID as string
      }/files/${req.signedInUser?.id}/view?project=${
        process.env.APPWRITE_PROJECT_ID as string
      }&mode=admin`,
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "ChangeProfilePic");
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
      data: links,
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "GetLinks");
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
      data: isUpdated,
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "EditLink");
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

export const AddLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, link } = req.body;

    if (
      title == undefined ||
      title == "" ||
      link == "" ||
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
      data: newLink,
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "AddLink");
  }
};

// UpdateProfile
export const UpdateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { field, field_value } = req.query;

    if (
      field == undefined ||
      typeof field !== "string" ||
      typeof field_value !== "string" ||
      field_value == undefined
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

    if (field == "fullname") {
      user.fullname = field_value.toString();
      await user.save();
      res.status(200).json({
        ok: true,
        msg: "Fullname Updated.",
      });
      return;
    } else if (field == "username") {
      if (user.username == field_value) return;

      const existingUsername = await User.findOne({ username: field_value });
      if (existingUsername) {
        res.status(400).json({
          ok: false,
          msg: "Username not availabel.",
        });
        return;
      }

      user.username = field_value;
      await user.save();

      res.status(200).json({
        ok: true,
        msg: "Username Changed.",
      });
    } else if (field == "bio") {
      user.bio = field_value;
      await user.save();

      res.status(200).json({
        ok: true,
        msg: "Bio Updated.",
      });
    } else if (field == "gender") {
      const matchedGender: string[] = [
        EUserGender.Male,
        EUserGender.Female,
        EUserGender.PREFER_NOT_TO_SAY,
      ];
      user.gender = matchedGender.includes(field_value as EUserGender)
        ? (field_value as EUserGender)
        : EUserGender.PREFER_NOT_TO_SAY;
      await user.save();

      res.status(200).json({
        ok: true,
        msg: "Gender Changed.",
      });
    } else if (field == "display_gender") {
      user.display_gender = field_value == "true" ? true : false;
      await user.save();

      res.status(200).json({
        ok: true,
        msg: "Display Gender Updated.",
      });
    } else if (field == "is_private") {
      user.is_private = field_value == "true" ? true : false;
      await user.save();

      res.status(200).json({
        ok: true,
        msg: "Profile Visibility has been changed.",
      });
    } else {
      res.status(400).json({
        ok: false,
        msg: "Invalid update fieldname.",
      });
    }
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "UpdateProfile");
  }
};
