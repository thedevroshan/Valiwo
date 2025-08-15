import { Request, Response } from "express";
import mongoose from "mongoose";

// Config
import { INTERNAL_SERVER_ERROR } from "../config/commonErrors";

// Models
import Blocked from "../models/blocked.model";
import Comment from "../models/comment.model";
import User, { IUser } from "../models/user.model";
import PrivacySettings, {
  EPrivacyOption,
  IPrivacySettings,
} from "../models/privacy_settings.model";
import Like from "../models/like.model";
import FollowRequest from "../models/follow_request.model";
import Post from "../models/post.model";

export const GetPrivacySettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let isPrivacySettings: IPrivacySettings | null =
      await PrivacySettings.findOne({ user: req.signedInUser?.id });
    if (!isPrivacySettings) {
      isPrivacySettings = await PrivacySettings.create({
        user: req.signedInUser?.id,
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Privacy settings fetched.",
      data: isPrivacySettings,
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "GetPrivacySettings");
  }
};

export const GetBlockedUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const blockedUserId = await Blocked.find({
      blocked_by: req.signedInUser?.id,
    });

    if (!blockedUserId) {
      res.status(404).json({
        ok: false,
        msg: "No blocked user.",
      });
      return;
    }

    const blockedUserProfile: IUser[] = await Promise.all(
      blockedUserId.map(async (blockedUser) => {
        return await User.findById(blockedUser.blocked)
          .select("username")
          .select("fullname")
          .select("profile_pic")
          .select("_id");
      })
    );

    if (!blockedUserProfile) {
      res.status(400).json({
        ok: false,
        msg: "Unable to fetch blocked user. Try again later.",
      });
      return;
    }

    res.status(200).json({
      ok: true,
      msg: "Blocked user fetched.",
      blocked_user: blockedUserProfile,
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "GetBlockedUser");
  }
};

export const BlockUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      res.status(400).json({
        ok: false,
        msg: "UserId is required.",
      });
      return;
    }

    if (userId == req.signedInUser?.id) {
      res.status(400).json({
        ok: false,
        msg: "You can't block yourself.",
      });
      return;
    }

    const isAlreadyBlocked = await Blocked.exists({
      blocked_by: req.signedInUser?.id,
      blocked: userId,
    });

    if (isAlreadyBlocked) {
      res.status(400).json({
        ok: false,
        msg: "Already blocked.",
      });
      return;
    }

    const isUser = await User.findById(userId);
    if (!isUser) {
      res.status(404).json({
        ok: false,
        msg: "User not found.",
      });
      return;
    }

    const isBlocked = await Blocked.create({
      blocked_by: req.signedInUser?.id,
      blocked: userId,
    });

    if (!isBlocked) {
      res.status(400).json({
        ok: false,
        msg: "Unable to block. Try again later.",
      });
      return;
    }

    // Deleting likes on each other's posts
    await Like.deleteMany({
      post_user: req.signedInUser?.id,
      liked_by: userId,
    });
    await Like.deleteMany({
      post_user: userId,
      liked_by: req.signedInUser?.id,
    });

    // Deleting comments on each other's posts
    await Comment.deleteMany({
      post_user: req.signedInUser?.id,
      comment_by: userId,
    });
    await Comment.deleteMany({
      post_user: userId,
      comment_by: req.signedInUser?.id,
    });

    // Deleting follow requets
    await FollowRequest.findOneAndDelete({
      requestedBy: req.signedInUser?.id,
      requestedTo: userId,
    });
    await FollowRequest.findOneAndDelete({
      requestedBy: userId,
      requestedTo: req.signedInUser?.id,
    });

    // Remove mutual follows
    await User.findByIdAndUpdate(req.signedInUser?.id, {
      $pull: {
        followers: userId,
        following: userId,
      },
    });

    await User.findByIdAndUpdate(userId, {
      $pull: {
        followers: req.signedInUser?.id,
        following: req.signedInUser?.id,
      },
    });

    res.status(200).json({
      ok: true,
      msg: `${isUser.username} Blocked.`,
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "BlockUser");
  }
};

export const UnblockUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.query;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      res.status(400).json({
        ok: false,
        msg: "UserId is required.",
      });
      return;
    }

    const isBlocked = await Blocked.exists({
      blocked_by: req.signedInUser?.id,
      blocked: userId,
    });

    if (!isBlocked) {
      res.status(400).json({
        ok: false,
        msg: "This user is not blocked.",
      });
      return;
    }

    const isUnblocked = await Blocked.findByIdAndDelete(isBlocked._id);

    if (!isUnblocked) {
      res.status(400).json({
        ok: false,
        msg: "Unable to unblock. Try again later.",
      });
      return;
    }

    res.status(200).json({
      ok: true,
      msg: `User unblocked.`,
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "UnblockUser");
  }
};

export const ShowReadReceiptes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { privacy_id, show_read_receiptes } = req.body;

    const isPrivacySettingsUpdated = await PrivacySettings.findByIdAndUpdate(
      privacy_id,
      {
        $set: {
          show_read_receiptes,
        },
      }
    );

    if (!isPrivacySettingsUpdated) {
      res.status(400).json({
        ok: false,
        msg: "Unable to toggle show read receiptes. Try again later.",
      });
      return;
    }

    res.status(200).json({
      ok: true,
      msg: "Show read receiptes toggled.",
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "ShowReadReceiptes");
  }
};

export const ShowOnlineReceiptes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { privacy_id, show_online_status } = req.body;

    const isPrivacySettingsUpdated = await PrivacySettings.findByIdAndUpdate(
      privacy_id,
      {
        $set: {
          show_online_status,
        },
      }
    );

    if (!isPrivacySettingsUpdated) {
      res.status(400).json({
        ok: false,
        msg: "Unable to toggle show online status. Try again later.",
      });
      return;
    }

    res.status(200).json({
      ok: true,
      msg: "Show online status toggled.",
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "ShowOnlineStatus");
  }
};

export const ShowTypingStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { privacy_id, show_typing_status } = req.body;

    const isPrivacySettingsUpdated = await PrivacySettings.findByIdAndUpdate(
      privacy_id,
      {
        $set: {
          show_typing_status,
        },
      }
    );

    if (!isPrivacySettingsUpdated) {
      res.status(400).json({
        ok: false,
        msg: "Unable to toggle show typing status. Try again later.",
      });
      return;
    }

    res.status(200).json({
      ok: true,
      msg: "Show typing status toggled.",
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "ShowTypingStatus");
  }
};

export const WhoCanMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { privacy_id, who_can_message } = req.body;

    const isValidOption: string[] = [
      EPrivacyOption.EVERYONE,
      EPrivacyOption.FOLLOWER,
    ];

    const isPrivacySettingsUpdated = await PrivacySettings.findByIdAndUpdate(
      privacy_id,
      {
        $set: {
          who_can_message: isValidOption.includes(who_can_message)
            ? who_can_message
            : EPrivacyOption.EVERYONE,
        },
      }
    );

    if (!isPrivacySettingsUpdated) {
      res.status(400).json({
        ok: false,
        msg: "Unable to change who can message you. Try again later.",
      });
      return;
    }

    res.status(200).json({
      ok: true,
      msg: "Who can message you changed.",
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "WhoCanMessage");
  }
};

export const WhoCanMenTag = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { privacy_id, who_can_men_tag } = req.body;

    const isValidOption: string[] = [
      EPrivacyOption.EVERYONE,
      EPrivacyOption.FOLLOWER,
    ];

    const isPrivacySettingsUpdated = await PrivacySettings.findByIdAndUpdate(
      privacy_id,
      {
        $set: {
          who_can_men_tag: isValidOption.includes(who_can_men_tag)
            ? who_can_men_tag
            : EPrivacyOption.EVERYONE,
        },
      }
    );

    if (!isPrivacySettingsUpdated) {
      res.status(400).json({
        ok: false,
        msg: "Unable to change who can mention/tag you. Try again later.",
      });
      return;
    }

    res.status(200).json({
      ok: true,
      msg: "Who can mention/tag you changed.",
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "WhoMenTag");
  }
};

export const EndToEndEcryption = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { privacy_id, end_to_end_encryption } = req.body;

    const isPrivacySettingsUpdated = await PrivacySettings.findByIdAndUpdate(
      privacy_id,
      {
        $set: {
          end_to_end_encryption,
        },
      }
    );

    if (!isPrivacySettingsUpdated) {
      res.status(400).json({
        ok: false,
        msg: "Unable to toggle end to end encryption. Try again later.",
      });
      return;
    }

    res.status(200).json({
      ok: true,
      msg: "End to end encryption toggled.",
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "EndToEndEncryption");
  }
};
