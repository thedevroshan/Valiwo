import { Request, Response } from "express";
import mongoose from "mongoose";

// Configs
import { INTERNAL_SERVER_ERROR } from "../config/commonErrors";

// Models
import User, {IUser} from "../models/user.model";
import FollowRequest from "../models/follow_request.model";


export const FollowUnfollowUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.query;

    if (!username || typeof username !== "string") {
      res.status(400).json({
        ok: false,
        msg: "Username is required.",
      });
      return;
    }

    const userToFollow = await User.findOne({username});

    if (!userToFollow) {
      res.status(404).json({
        ok: false,
        msg: "User not found.",
      });
      return;
    }

    if(userToFollow.id == req.signedInUser?.id){
      res.status(400).json({
        ok: false,
        msg: "You can't follow yourself."
      })
      return;
    }


    // Sending Follow Request if the user is private
    if (userToFollow.is_private) {
      const isAlreadyRequested = await FollowRequest.exists({
        requestedBy: req.signedInUser?.id,
        requestedTo: userToFollow.id,
      });

      if( isAlreadyRequested) {
        res.status(400).json({
          ok: false,
          msg: "You have already sent a follow request to this user.",
        });
        return;
      }

      // Creating Follow Request Doc
      const followRequest = await FollowRequest.create({
        requestedBy: req.signedInUser?.id,
        requestedTo: userToFollow.id,
      });

      // Send Notification to the user

      res.status(200).json({
        ok: true,
        msg: "Follow request sent successfully.",
      });
      return;
    }
    
    if( req.signedInUser?.id === userToFollow.id) {
      res.status(400).json({
        ok: false,
        msg: "You cannot follow yourself.",
      });
      return;
    }

    const isFollowing = req.signedInUser?.following.includes(userToFollow.id);
    if(isFollowing) {
      // Unfollow the user
      await User.findByIdAndUpdate(req.signedInUser?.id, {
        $pull: {
          following: userToFollow.id,
        }, 
      });
      await User.findByIdAndUpdate(userToFollow.id, {
        $pull: {
          followers: req.signedInUser?.id,
        },  
      });
      res.status(200).json({
        ok: true,
        msg: "Unfollowed the user successfully.",
      });
    }else {
      // Follow the user
      await User.findByIdAndUpdate(req.signedInUser?.id, {
        $addToSet: {
          following: userToFollow.id,
        },
      });
      await User.findByIdAndUpdate(userToFollow.id, {
        $addToSet: {
          followers: req.signedInUser?.id,
        },
      });
      res.status(200).json({
        ok: true,
        msg: "Followed the user successfully.",
      });
    }
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "FollowUser");
  }
};

export const AcceptFollowRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { follow_request_id } = req.query;    

    if (!follow_request_id || typeof follow_request_id !== "string" || !mongoose.isValidObjectId(follow_request_id)) {
      res.status(400).json({
        ok: false,
        msg: "Follow Request ID is required.",
      });
      return;
    }

    const followRequest = await FollowRequest.findById(follow_request_id);
    if (!followRequest) {
      res.status(404).json({
        ok: false,
        msg: "Follow Request not found.",
      });
      return;
    }

    if (followRequest.requestedTo.toString() !== req.signedInUser?.id) {
      res.status(403).json({
        ok: false,
        msg: "You are not authorized to accept this follow request.",
      });
      return;
    }

    // Add the follower to the user's followers list
    await User.findByIdAndUpdate(req.signedInUser?.id, {
      $addToSet: {
        followers: followRequest.requestedBy,
      },
    });

    // Add the user to the follower's following list
    await User.findByIdAndUpdate(followRequest.requestedBy, {
      $addToSet: {
        following: req.signedInUser?.id,
      },
    });

    // Delete the follow request
    await FollowRequest.findByIdAndDelete(follow_request_id);

    res.status(200).json({
      ok: true,
      msg: "Follow request accepted successfully.",
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "AcceptFollowRequest");
  }
}

export const RemoveFollower = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { follower_id } = req.query;

    if (!follower_id || typeof follower_id !== "string" || !mongoose.isValidObjectId(follower_id)) {
      res.status(400).json({
        ok: false,
        msg: "Follower ID is required.",
      });
      return;
    }

    const isFollower:boolean = req.signedInUser?.followers.some(followerId => {
      return followerId.toString() === follower_id.toString();
    });
    if (!isFollower) {
      res.status(404).json({
        ok: false,
        msg: "Follower not found.",
      });
      return;
    }

    // Remove the follower from the user's followers list
    await User.findByIdAndUpdate(req.signedInUser?.id, {
      $pull: {
        followers: follower_id,
      },
    });

    // Remove the user from the follower's following list
    await User.findByIdAndUpdate(follower_id, {
      $pull: {
        following: req.signedInUser?.id,
      },
    });

    res.status(200).json({
      ok: true,
      msg: "Follower removed successfully.",
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "RemoveFollower");
  }
}

export const DeleteFollowRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { follow_request_id } = req.query;

    if (!follow_request_id || typeof follow_request_id !== "string" || !mongoose.isValidObjectId(follow_request_id)) {
      res.status(400).json({
        ok: false,
        msg: "Follow Request ID is required.",
      });
      return;
    }

    const followRequest = await FollowRequest.findById(follow_request_id);
    if (!followRequest) {
      res.status(404).json({
        ok: false,
        msg: "Follow Request not found.",
      });
      return;
    }

    if (followRequest.requestedBy.toString() !== req.signedInUser?.id && followRequest.requestedTo.toString() !== req.signedInUser?.id) {
      res.status(403).json({
        ok: false,
        msg: "You are not authorized to delete this follow request.",
      });
      return;
    }

    await FollowRequest.findByIdAndDelete(follow_request_id);

    res.status(200).json({
      ok: true,
      msg: "Follow request deleted successfully.",
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "DeleteFollowRequest");
  }
}

export const GetFollowers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.query;

    let followers = [] as IUser[];

    if (username == undefined) {
      await Promise.all(
        req?.signedInUser?.followers.map(async (followerId) => {
          followers.push(
            await User.findById(followerId)
              .select("username")
              .select("fullname")
              .select("_id")
              .select("profile_pic")
          );
        })
      );

      if (followers.length != req?.signedInUser?.followers?.length) {
        res.status(200).json({
          ok: false,
          msg: "Something went wrong while fetching followers.",
        });
        return;
      }
    } else {
      const user = await User.findOne({ username })
        .select("followers")
        .select("is_private");

      if (!user) {
        res.status(404).json({
          ok: false,
          msg: "User not found.",
        });
        return;
      }

      if (user.is_private) {
        res.status(400).json({
          ok: false,
          msg: "User has a private profile.",
        });
        return;
      }

      await Promise.all(
        user.followers.map(async (followerId) => {
          followers.push(
            await User.findById(followerId)
              .select("username")
              .select("fullname")
              .select("_id")
              .select("profile_pic")
          );
        })
      );

      if (followers.length != user.followers.length) {
        res.status(200).json({
          ok: false,
          msg: "Something went wrong while fetching followers.",
        });
        return;
      }
    }

    res.status(200).json({
      ok: true,
      msg: "Followers fetched successfully.",
      followers
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "GetFollowers");
  }
};

export const GetFollowing = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.query;

    let following = [] as IUser[];

    if (username == undefined) {
      await Promise.all(
        req?.signedInUser?.following.map(async (followingId) => {
          following.push(
            await User.findById(followingId)
              .select("username")
              .select("fullname")
              .select("_id")
              .select("profile_pic")
          );
        })
      );

      if (following.length != req?.signedInUser?.following.length) {
        res.status(200).json({
          ok: false,
          msg: "Something went wrong while fetching following.",
        });
        return;
      }
    } else {
      const user = await User.findOne({ username })
        .select("following")
        .select("is_private");

      if (!user) {
        res.status(404).json({
          ok: false,
          msg: "User not found.",
        });
        return;
      }

      if (user.is_private) {
        res.status(400).json({
          ok: false,
          msg: "User has a private profile.",
        });
        return;
      }

      await Promise.all(
        user.following.map(async (followingId) => {
          following.push(
            await User.findById(followingId)
              .select("username")
              .select("fullname")
              .select("_id")
              .select("profile_pic")
          );
        })
      );

      if (following.length != user.following.length) {
        res.status(200).json({
          ok: false,
          msg: "Something went wrong while fetching following.",
        });
        return;
      }
    }


    res.status(200).json({
      ok: true,
      msg: "Following fetched successfully.",
      following,
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "GetFollowing");
  }
};

export const IsRequestedFollow = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_id } = req.query;

    if (!user_id || typeof user_id !== "string") {
      res.status(400).json({
        ok: false,
        msg: "Username is required.",
      });
      return;
    }

    const userToCheck = await User.findById(user_id);

    if (!userToCheck) {
      res.status(404).json({
        ok: false,
        msg: "User not found.",
      });
      return;
    }

    const isRequested = await FollowRequest.exists({
      requestedBy: req.signedInUser?.id,
      requestedTo: userToCheck.id,
    });

    res.status(200).json({
      ok: true,
      msg: "User has requested to follow.",
      isRequested: isRequested ? true : false,
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "IsRequestedFollow");
  }
};