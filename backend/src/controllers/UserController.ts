import { Response, Request } from "express";

// Configs
import { INTERNAL_SERVER_ERROR } from "../config/commonErrors";

// Models
import { User, EUserGender } from "../models/user.model";
import { Link } from "../models/link.model";



export const GetUser = (req: Request, res: Response) => {
    try {
        res.json(req.signedInUser)
    } catch (error) {
        INTERNAL_SERVER_ERROR(res, error, 'GetUser')
    }
}



// UpdateProfile
export const UpdateProfile = async (req: Request, res: Response):Promise<void> => {
    try {
        const {updateField, updateValue} = req.query;

        if(updateField == undefined || typeof updateField !== 'string' || typeof updateValue !== 'string' || updateValue == undefined){
            res.status(400).json({
                ok: false,
                msg: 'Invalid Query.'
            })
            return
        }

        const user = await User.findById(req?.signedInUser?._id)
        if(!user){
            res.status(400).json({
                ok: false,
                msg: "User Not Found."
            })
            return;
        }

        if(updateField == 'fullname'){
            user.fullname = updateValue.toString();
            await user.save()
            res.status(200).json({
                ok: true,
                msg: 'FullName Updated.'
            })
            return;
        }

        else if(updateField == 'username'){
            if(user.username == updateValue)
                return;
            
            const existingUsername = await User.findOne({username: updateValue})
            if(existingUsername){
                res.status(400).json({
                    ok: false,
                    msg: "Username not availabel."
                })
                return;
            }

            user.username = updateValue
            await user.save()

            res.status(200).json({
                ok: true,
                msg: "Username Changed."
            })
        }

        else if(updateField == 'bio'){
            user.bio = updateValue;
            await user.save()

            res.status(200).json({
                ok: true,
                msg: "Bio Updated."
            })
        }

        else if(updateField == 'gender'){
            user.gender = updateValue == EUserGender.Male?EUserGender.Male:EUserGender.Female;
            await user.save()
            
            res.status(200).json({
                ok: true,
                msg: "Gender Changed."
            })
        }

        else if(updateField == 'display_gender'){
            user.display_gender = updateValue == 'true'?true:false;
            await user.save()

            res.status(200).json({
                ok: true,
                msg: "Display Gender Updated."
            })
        }

        else if(updateField == 'is_private'){
            user.is_private = updateValue == 'true'?true:false;
            await user.save()

            res.status(200).json({
                ok: true,
                msg: 'Profile Visibility has been changed.'
            })
        }
        
    } catch (error) {
        INTERNAL_SERVER_ERROR(res, error, 'UpdateProfile')
    }
}



export const AddLink = async (req: Request, res: Response):Promise<void> => {
    try {
        const {title, link} = req.body;

        if(title == undefined || typeof title != 'string' || link == undefined || typeof link != 'string'){
            res.status(400).json({
                ok: false,
                msg: 'Title and Link are requried.'
            })
            return;
        }

        const newLink = await Link.create({
            title,
            link,
            user: req?.signedInUser?.id
        })

        if(!newLink){
            res.status(500).json({
                ok: false,
                msg: "Unable to add new link. Try again later."
            })
            return;
        }

        res.status(200).json({
            ok: true,
            msg: "New Link Added."
        })
    } catch (error) {
        INTERNAL_SERVER_ERROR(res, error, 'AddLink')
    }
}

export const RemoveLink = async (req: Request, res: Response):Promise<void> => {
    try {
        const {link_id} = req.query;

        if(link_id == undefined || typeof link_id !== 'string'){
            res.status(400).json({
                ok: false,
                msg: 'Link id not provided.'
            })
            return;
        }

        const isDeleted = await Link.findOneAndDelete({
            _id: link_id,
            user: req.signedInUser?.id
        })

        if(!isDeleted){
            res.status(500).json({
                ok: false,
                msg: 'Unable to delete link. Try again later.'
            })
            return;
        }

        res.status(200).json({
            ok: true,
            msg: 'Link deleted successfully.'
        })
    } catch (error) {
        INTERNAL_SERVER_ERROR(res, error, 'RemoveLink')
    }
}


export const EditLink = async (req: Request, res: Response):Promise<void> => {
    try {
        const {link_id} = req.query;
        const {title, link} = req.body;

        if(!link_id || !title || !link){
            res.status(400).json({
                ok: false,
                msg: 'Required fields are missing.'
            })
            return;
        }

        const isUpdated = await Link.findByIdAndUpdate(link_id, {
            $set: {
                title,
                link
            }
        }, {new: true})

        if(!isUpdated){
            res.status(500).json({
                ok: false,
                msg: 'Unable to update link. Try again later.'
            })
            return;
        }

        res.status(200).json({
            ok: true,
            msg: 'Link updated successfully',
            link: isUpdated
        })
    } catch (error) {
        INTERNAL_SERVER_ERROR(res, error, 'EditLink')
    }
}

export const GetLinks = async (req: Request, res: Response):Promise<void> => {
    try {
        const links = await Link.find({user: req.signedInUser?.id})
        if(links.length == 0){
            res.status(200).json({
                ok: true,
                msg: 'No Links.'
            })
            return;
        }

        res.status(200).json({
            ok: true,
            msg: "All links fetched successfully.",
            links
        })
    } catch (error) {
        INTERNAL_SERVER_ERROR(res, error, "GetLinks")
    }
}