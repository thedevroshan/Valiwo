import mongoose, { Schema, Document } from "mongoose";

export interface ILike extends Document {
  post_id: Schema.Types.ObjectId;
  post_user: Schema.Types.ObjectId[];
  liked_by: Schema.Types.ObjectId;
}

const LikeSchema = new Schema<ILike>(
  {
    post_id: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    post_user: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    liked_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Like = mongoose.model<ILike>("Like", LikeSchema);
export default Like;
