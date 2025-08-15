import mongoose, {Document, Model, Schema} from 'mongoose'

interface INote extends Document {
    userId: Schema.Types.ObjectId;
    msg: string;
    song: string;
    likes: Schema.Types.ObjectId[];
}

const NoteSchema:Schema<INote> = new Schema<INote>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    msg: {
        type: String,
        default: ""
    },
    song: {
        type: String,
        default: ""
    },
    likes: [{
        type: Schema.Types.ObjectId
    }]
}, {timestamps: true})

const Note = mongoose.model<INote>("Note", NoteSchema);
export default Note;