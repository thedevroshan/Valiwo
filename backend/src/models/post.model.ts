import mongoose, {
    Schema,
    Document
} from "mongoose"


export interface IPost extends Document {
    users: Schema.Types.ObjectId[];
    post: string[];
    post_file_id: string[];
    cover: string;
    caption: string;
    song: string;
    is_paid: boolean;
}

const PostSchema = new Schema<IPost>({
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    post: [
        {
            type: String,
            required: true
        }
    ],
    post_file_id: [
        {
            type: String,
            required: true
        }
    ],
    cover: {
        type: String,
        default: ""
    },
    caption: {
        type: String,
        default: ''
    },
    song: {
        type: String,
        default: ''
    },
    is_paid: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})


const Post = mongoose.model<IPost>("Post", PostSchema)
export default Post;

