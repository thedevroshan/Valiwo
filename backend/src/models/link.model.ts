import mongoose, {
    Document,
    Schema
} from "mongoose";

interface ILink extends Document {
    title: string;
    link: string;
    user: Schema.Types.ObjectId;
}

const LinkSchema = new Schema<ILink>({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})


export const Link = mongoose.model("Link", LinkSchema)