import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  fullname: string;
  password: string;
  profile_pic: string;
  followers: Schema.Types.ObjectId[];
  following: Schema.Types.ObjectId[];
  bio: string;
  posts: Number;
  links: Schema.Types.ObjectId[];
  is_verified: boolean;
  is_private: boolean;
  requested_deletion_date: Date | null;
  is_requested_deletion: boolean;
  is_deactivated: boolean;
  pinned_post: Schema.Types.ObjectId[];
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile_pic: {
      type: String,
      default: "",
    },
    posts: {
      type: Number,
      default: 0
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    bio: {
      type: String,
      default: "",
    },
    links: [
      {
        type: Schema.Types.ObjectId,
        ref: "Link",
      },
    ],
    is_verified: {
      type: Boolean,
      default: false,
    },
    is_private: {
      type: Boolean,
      default: false,
    },
    requested_deletion_date: {
      type: Date,
      default: null,
    },
    is_requested_deletion: {
      type: Boolean,
      default: false,
    },
    is_deactivated: {
      type: Boolean,
      default: false,
    },
    pinned_post: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", UserSchema);
