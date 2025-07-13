import mongoose, {
    Schema,
    Document
} from 'mongoose'


interface IRestricted extends Document {
    restricted_by: Schema.Types.ObjectId;
    restricted: Schema.Types.ObjectId;
}

const RestrictedSchema = new Schema<IRestricted>({
    restricted_by: {
        type: Schema.Types.ObjectId,
        required: true
    },
    restricted: {
        type: Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
})

const Restricted = mongoose.model<IRestricted>("Restricted", RestrictedSchema)
export default Restricted;