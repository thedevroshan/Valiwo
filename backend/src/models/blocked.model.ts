import mongoose, {
    Schema,
    Document
} from 'mongoose'


export interface IBlocked extends Document {
    blocked_by: Schema.Types.ObjectId;
    blocked: Schema.Types.ObjectId;
}

const BlockedSchema = new Schema<IBlocked>({
    blocked_by: {
        type: Schema.Types.ObjectId,
        required: true
    },
    blocked: {
        type: Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
})

const Blocked = mongoose.model<IBlocked>("Blocked", BlockedSchema)
export default Blocked;