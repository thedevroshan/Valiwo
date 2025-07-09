import mongoose from "mongoose";

interface FollowRequest extends mongoose.Document {
    requestedBy: mongoose.Schema.Types.ObjectId;
    requestedTo: mongoose.Schema.Types.ObjectId;
}

const FollowRequestSchema = new mongoose.Schema<FollowRequest>({
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    requestedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});


const FollowRequest = mongoose.model<FollowRequest>("FollowRequest", FollowRequestSchema);
export default FollowRequest;