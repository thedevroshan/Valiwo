import mongoose, { Document, Schema } from "mongoose";
import { boolean } from "zod/v4-mini";


export enum EPrivacyOption {
    EVERYONE = 'everyone',
    FOLLOWER = 'follower'
}

export interface IPrivacySettings extends Document {
    user: Schema.Types.ObjectId;
    show_read_receiptes: boolean;
    show_online_status: boolean;
    show_typing_status: boolean;
    who_can_message: EPrivacyOption;
    who_can_men_tag: EPrivacyOption;
    end_to_end_encryption: boolean;
    chat_password: string;
}

const PrivacySettingSchema = new Schema<IPrivacySettings>({
    user: {
        type: Schema.Types.ObjectId,
        required: true  
    },
    show_read_receiptes: {
        type: Boolean,
        default: true
    },
    show_online_status: {
        type: Boolean,
        default: true
    },
    show_typing_status: {
        type: Boolean,
        default: true
    },
    who_can_message: {
        type: String,
        enum: EPrivacyOption,
        default: EPrivacyOption.EVERYONE
    },
    who_can_men_tag: {
        type: String,
        enum: EPrivacyOption,
        default: EPrivacyOption.EVERYONE
    },
    end_to_end_encryption: {
        type: Boolean,
        default: true,
    },
    chat_password: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
})

const PrivacySettings = mongoose.model<IPrivacySettings>("PrivacySettings", PrivacySettingSchema)
export default PrivacySettings;