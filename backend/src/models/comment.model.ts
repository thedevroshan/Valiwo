import mongoose, {
    Schema,
    Document
} from 'mongoose'


interface IComment extends Document {
    post_id: Schema.Types.ObjectId;
    post_user: Schema.Types.ObjectId[];
    comment_by: Schema.Types.ObjectId;
    like_count: number;
    reply_count: number;
    comment: string;
}

const CommentSchema = new Schema<IComment>({
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
    comment_by: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    like_count: {
        type: Number,
        default: 0
    },
    reply_count: {
        type: Number,
        default: 0
    },
    comment: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Comment = mongoose.model<IComment>("Comment", CommentSchema)
export default Comment;